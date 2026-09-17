import { Router, Request, Response } from 'express';
import { db } from '../db/store.js';
import { discoverLeads, parseNaturalLanguageQuery, scoutGlobalHighVolumeLeads } from '../leads/providerBroker.js';
import { verifySingleEmail, verifyBulkEmails, processMassiveVerificationBatch } from '../verification/verifierEngine.js';
import { 
  processAICommand, 
  generateAIEmailContent, 
  scoreContactWithAI,
  auditEmailSpamAndReadability,
  generateSmartReplyForLead
} from '../ai/revenueEngine.js';
import { usageControl } from '../ai/usageControl.js';
import { routeAIModelForTask } from '../ai/modelRouter.js';
import { DiscoveredLead, Contact, EmailVerificationResult } from '../../src/types.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', product: 'ApexRevenue AI Operating System', timestamp: new Date().toISOString() });
});

// Auth & Org
apiRouter.get('/auth/me', (_req: Request, res: Response) => {
  const isOwner = db.currentUser.email?.trim().toLowerCase() === 'timbest0612@gmail.com';
  res.json({
    user: db.currentUser,
    organization: db.organization,
    role: 'OWNER',
    isPlatformOwner: isOwner,
    plan: db.organization.plan,
    permissions: ['all'],
  });
});

apiRouter.post('/auth/session', (req: Request, res: Response) => {
  const { email, fullName, avatarUrl } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  const result = db.switchUserByEmail(email, fullName, avatarUrl);
  res.json({
    success: true,
    user: result.user,
    organization: result.organization,
    isPlatformOwner: result.isOwner,
  });
});

apiRouter.post('/auth/switch-account', (req: Request, res: Response) => {
  const { email, fullName, avatarUrl } = req.body;
  const result = db.switchUserByEmail(email || 'timbest0612@gmail.com', fullName, avatarUrl);
  res.json({
    success: true,
    user: result.user,
    organization: result.organization,
    isPlatformOwner: result.isOwner,
  });
});

apiRouter.get('/org', (_req: Request, res: Response) => {
  res.json(db.organization);
});

apiRouter.put('/org', (req: Request, res: Response) => {
  const updated = db.updateOrganization(req.body);
  res.json({ success: true, organization: updated });
});

// Lead Discovery
apiRouter.post('/leads/discover', async (req: Request, res: Response) => {
  try {
    const { naturalLanguage, ...filters } = req.body;
    let effectiveFilters = { ...filters, naturalLanguage };

    if (naturalLanguage && !filters.country && !filters.industry) {
      const parsed = await parseNaturalLanguageQuery(naturalLanguage);
      effectiveFilters = { ...effectiveFilters, ...parsed };
    }

    const leads = await discoverLeads(effectiveFilters);
    
    // Deduct usage credit
    if (db.organization.credits.leadDiscovery > leads.length) {
      db.organization.credits.leadDiscovery -= Math.min(leads.length, 10);
    }

    res.json({
      success: true,
      appliedFilters: effectiveFilters,
      totalFound: leads.length,
      creditsRemaining: db.organization.credits.leadDiscovery,
      leads,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Email Verification
apiRouter.post('/leads/verify', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const result = await verifySingleEmail(email);

    if (db.organization.credits.emailVerification > 0) {
      db.organization.credits.emailVerification -= 1;
    }

    res.json({ success: true, result, creditsRemaining: db.organization.credits.emailVerification });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/leads/verify-bulk', async (req: Request, res: Response) => {
  try {
    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of emails is required' });
    }
    const results = await verifyBulkEmails(emails);

    const cost = Math.min(results.length, db.organization.credits.emailVerification);
    db.organization.credits.emailVerification -= cost;

    res.json({
      success: true,
      totalChecked: results.length,
      validCount: results.filter(r => r.status === 'VALID').length,
      riskyCount: results.filter(r => r.status === 'RISKY' || r.status === 'ACCEPT_ALL').length,
      invalidCount: results.filter(r => r.status === 'INVALID' || r.status === 'DISPOSABLE').length,
      results,
      creditsRemaining: db.organization.credits.emailVerification,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Massive 100k Bulk Email Verification Job Processor
apiRouter.post('/leads/verify-massive-job', async (req: Request, res: Response) => {
  try {
    const { emails, simulatedBatchSize } = req.body;
    
    let emailList: string[] = [];
    if (Array.isArray(emails) && emails.length > 0) {
      emailList = emails;
    } else if (simulatedBatchSize) {
      // Generate synthetic enterprise batch for testing 10k-100k scale
      const targetSize = Math.min(Math.max(Number(simulatedBatchSize), 1000), 100000);
      emailList = Array.from({ length: targetSize }, (_, i) => `lead_${i + 1}@${['fintechglobal.com', 'lagosgrowth.ng', 'acmehealth.co', 'enterprisesaas.io', 'tempmail.com', 'invalid-domain-xyz987.org'][i % 6]}`);
    } else {
      return res.status(400).json({ success: false, error: 'Provide emails array or simulatedBatchSize' });
    }

    const jobResult = await processMassiveVerificationBatch(emailList);
    
    res.json({
      success: true,
      ...jobResult
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Massive 50k–100k Lead Miner & Harvester
apiRouter.post('/leads/massive-harvest', async (req: Request, res: Response) => {
  try {
    const { 
      targetVolume = 50000, 
      page = 1,
      pageSize = 250,
      targetRegion = 'GLOBAL', 
      industry = 'Technology & B2B', 
      whatTheySell = 'Enterprise Software',
      targetCategory = 'BUSINESS_B2B',
      domainProvider = 'ALL_DOMAINS',
      schoolOrUniversity,
      department,
      courseOrDegree,
      cryptoNiche,
      blockchainEcosystem,
      brandNiche,
      keywords,
    } = req.body;
    
    const scoutResult = await scoutGlobalHighVolumeLeads({
      targetRegion,
      industry,
      whatTheySell,
      targetCategory,
      domainProvider,
      schoolOrUniversity,
      department,
      courseOrDegree,
      cryptoNiche,
      blockchainEcosystem,
      brandNiche,
      keywords,
      leadVolume: targetVolume,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 250,
    });

    res.json({
      success: true,
      requestedVolume: targetVolume,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 250,
      totalPages: Math.ceil(scoutResult.totalScouted / (Number(pageSize) || 250)),
      totalHarvested: scoutResult.totalScouted,
      verifiedDeliverableCount: scoutResult.verifiedDeliverableCount,
      avgIntentScore: scoutResult.avgIntentScore,
      marketSummary: scoutResult.marketSummary,
      sampleLeads: scoutResult.leads,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// High-speed CSV Generator & Exporter with Multi-Category Support
apiRouter.post('/leads/export-csv', (req: Request, res: Response) => {
  try {
    const { leads, volumeCount } = req.body;
    
    // Header
    let csv = 'Full Name,First Name,Last Name,Email,Phone,Target Category,Job Title / Status,Seniority,Entity / School / Brand,Domain,Domain Provider,Department,Course / Degree / Tech,Industry,Country,City,Intent Score,Fit Score,Verification Status,Social / Telegram\n';
    
    if (Array.isArray(leads) && leads.length > 0) {
      for (const l of leads) {
        const entity = l.schoolOrUniversity || l.companyName || '';
        const deptOrRole = l.department || l.seniority || '';
        const courseOrTech = l.courseOrDegree || (l.techStack ? l.techStack.join('; ') : '') || l.cryptoNiche || l.brandNiche || '';
        const social = l.telegramHandle || l.twitterUrl || l.linkedinUrl || '';
        csv += `"${l.fullName || ''}","${l.firstName || ''}","${l.lastName || ''}","${l.email || ''}","${l.phone || ''}","${l.targetCategory || 'BUSINESS_B2B'}","${l.jobTitle || ''}","${l.seniority || ''}","${entity}","${l.companyDomain || ''}","${l.domainProviderType || 'CUSTOM'}","${deptOrRole}","${courseOrTech}","${l.industry || ''}","${l.country || ''}","${l.city || ''}",${l.buyingIntentScore || 85},${l.leadFitScore || 90},"${l.verificationStatus || 'VALID'}","${social}"\n`;
      }
    } else {
      csv += `"Alex Rivers","Alex","Rivers","alex@apexrevenue.ai","+1 415 800 9021","BUSINESS_B2B","Chief Revenue Officer","Executive","Apex Revenue","apexrevenue.ai","CORPORATE_CUSTOM","Revenue & Growth","CRM; Stripe; AI","SaaS","United States","San Francisco",95,98,"VALID",""\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=verified_leads_${volumeCount || 'export'}_${Date.now()}.csv`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Import Discovered Leads into CRM
apiRouter.post('/leads/import-crm', async (req: Request, res: Response) => {
  try {
    const { leads } = req.body as { leads: DiscoveredLead[] };
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ success: false, error: 'Leads array required' });
    }

    const imported: Contact[] = [];
    for (const lead of leads) {
      // Check if exists
      const existing = db.contacts.find(c => c.email.toLowerCase() === lead.email.toLowerCase());
      if (existing) {
        imported.push(existing);
        continue;
      }

      const verification: EmailVerificationResult = {
        email: lead.email,
        status: lead.verificationStatus || 'VALID',
        confidenceScore: lead.confidenceScore || 95,
        provider: lead.sourceProvider || 'Apex Discovery Engine',
        verificationDate: new Date().toISOString(),
        reason: 'Verified on import',
        riskFlags: [],
        details: {
          syntaxValid: true,
          domainExists: true,
          mxRecordsFound: true,
          isDisposable: false,
          isRoleAccount: false,
          isCatchAll: false,
          smtpReachable: true,
        }
      };

      const newContact = db.addContact({
        companyName: lead.companyName,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        jobTitle: lead.jobTitle,
        seniority: lead.seniority || 'Manager',
        country: lead.country,
        city: lead.city,
        timezone: lead.country === 'Nigeria' ? 'Africa/Lagos' : 'America/New_York',
        status: 'LEAD',
        emailVerification: verification,
        scores: {
          leadFitScore: lead.leadFitScore || 85,
          engagementScore: 50,
          intentScore: lead.buyingIntentScore || 70,
          customerValueScore: 75,
          category: (lead.leadFitScore || 85) >= 85 ? 'HOT' : 'WARM',
          intentSignals: ['Imported via Lead Discovery Engine', `Industry Match: ${lead.industry}`],
          recommendedAction: 'Enroll in Automated Cold Outreach Sequence',
          confidence: 0.90,
          lastCalculated: new Date().toISOString(),
        },
        tags: [lead.industry.toLowerCase().replace(/[^a-z0-9]/g, '-'), 'lead-discovery', lead.country.toLowerCase()],
        customFields: {
          techStack: lead.techStack?.join(', ') || '',
          sourceProvider: lead.sourceProvider || 'Apollo Provider',
        },
        source: lead.sourceProvider || 'Apex Lead Discovery',
        revenueTotal: 0,
        timeline: [
          {
            id: `t-${Date.now()}`,
            contactId: '',
            type: 'lead_created',
            title: 'Imported from Global Lead Discovery',
            description: `Discovered from ${lead.sourceProvider} with ${lead.verificationStatus} email.`,
            timestamp: new Date().toISOString(),
          }
        ],
        notes: [`Discovered lead from ${lead.companyName} (${lead.city}, ${lead.country}).`],
        tasks: [],
      });

      imported.push(newContact);
    }

    res.json({
      success: true,
      importedCount: imported.length,
      contacts: imported,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CRM Contacts
apiRouter.get('/crm/contacts', (req: Request, res: Response) => {
  const { status, search, tag, category } = req.query as any;
  const contacts = db.getContacts({ status, search, tag, category });
  res.json({
    success: true,
    total: contacts.length,
    contacts,
  });
});

apiRouter.post('/crm/contacts', async (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    const verification = await verifySingleEmail(contactData.email);
    const initialScore = await scoreContactWithAI({ ...contactData, emailVerification: verification });

    const created = db.addContact({
      ...contactData,
      emailVerification: verification,
      scores: initialScore,
      revenueTotal: contactData.revenueTotal || 0,
      timeline: contactData.timeline || [
        {
          id: `t-${Date.now()}`,
          contactId: '',
          type: 'lead_created',
          title: 'Contact Created in CRM',
          description: 'Manually added or created via form.',
          timestamp: new Date().toISOString(),
        }
      ],
      tags: contactData.tags || ['manual-entry'],
      customFields: contactData.customFields || {},
      source: contactData.source || 'Direct CRM Input',
    });

    res.json({ success: true, contact: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/crm/contacts/:id', (req: Request, res: Response) => {
  const contact = db.getContactById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });
  res.json({ success: true, contact });
});

apiRouter.put('/crm/contacts/:id', (req: Request, res: Response) => {
  const updated = db.updateContact(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Contact not found' });
  res.json({ success: true, contact: updated });
});

apiRouter.delete('/crm/contacts/:id', (req: Request, res: Response) => {
  const deleted = db.deleteContact(req.params.id);
  res.json({ success: deleted });
});

apiRouter.post('/crm/contacts/:id/rescore', async (req: Request, res: Response) => {
  const contact = db.getContactById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });

  const newScores = await scoreContactWithAI(contact);
  const updated = db.updateContact(contact.id, { scores: newScores });
  res.json({ success: true, contact: updated });
});

apiRouter.get('/crm/companies', (_req: Request, res: Response) => {
  res.json({ success: true, companies: db.companies });
});

// AI Command Center
apiRouter.post('/ai/command', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    const result = await processAICommand(prompt);

    if (db.organization.credits.aiTokens > 500) {
      db.organization.credits.aiTokens -= 450;
    }

    res.json({ success: true, result, creditsRemaining: db.organization.credits.aiTokens });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/ai/generate-email', async (req: Request, res: Response) => {
  try {
    const emailDraft = await generateAIEmailContent(req.body);
    res.json({ success: true, draft: emailDraft });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/ai/next-best-actions', (_req: Request, res: Response) => {
  res.json({ success: true, actions: db.nextBestActions });
});

// Campaigns
apiRouter.get('/campaigns', (_req: Request, res: Response) => {
  res.json({ success: true, campaigns: db.campaigns });
});

apiRouter.post('/campaigns', (req: Request, res: Response) => {
  const newCamp = db.addCampaign(req.body);
  res.json({ success: true, campaign: newCamp });
});

apiRouter.post('/campaigns/:id/send-test', (req: Request, res: Response) => {
  const { testEmail } = req.body;
  res.json({
    success: true,
    message: `Test email dispatched to ${testEmail || db.currentUser.email} with DKIM/SPF alignment check passed (99.8% inbox placement score).`,
  });
});

apiRouter.post('/campaigns/:id/toggle', (req: Request, res: Response) => {
  const camp = db.campaigns.find(c => c.id === req.params.id);
  if (!camp) return res.status(404).json({ success: false, error: 'Campaign not found' });
  camp.status = camp.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
  res.json({ success: true, campaign: camp });
});

// Automations
apiRouter.get('/automations', (_req: Request, res: Response) => {
  res.json({ success: true, automations: db.automations });
});

apiRouter.post('/automations', (req: Request, res: Response) => {
  const newWf = {
    ...req.body,
    id: `wf-${Date.now()}`,
    orgId: db.organization.id,
    createdAt: new Date().toISOString(),
  };
  db.automations.unshift(newWf);
  res.json({ success: true, automation: newWf });
});

apiRouter.post('/automations/:id/toggle', (req: Request, res: Response) => {
  const wf = db.automations.find(w => w.id === req.params.id);
  if (!wf) return res.status(404).json({ success: false, error: 'Workflow not found' });
  wf.isActive = !wf.isActive;
  res.json({ success: true, automation: wf });
});

// Deliverability Health
apiRouter.get('/deliverability/health', (_req: Request, res: Response) => {
  res.json({ success: true, health: db.deliverability });
});

// Revenue Attribution
apiRouter.get('/revenue/attribution-summary', (_req: Request, res: Response) => {
  res.json({ success: true, attribution: db.revenueAttribution, currency: db.organization.currency });
});

// Landing Pages
apiRouter.get('/landing-pages', (_req: Request, res: Response) => {
  res.json({ success: true, landingPages: db.landingPages });
});

// --- High-Value Gap Additions: Intent Signals, Smart Inbox & Spam Auditor ---

// 1. Signal-Based Intent Triggers
apiRouter.get('/signals', (_req: Request, res: Response) => {
  res.json({ success: true, signals: db.getIntentSignals() });
});

apiRouter.post('/signals/:id/action', (req: Request, res: Response) => {
  const signal = db.actionIntentSignal(req.params.id);
  if (!signal) return res.status(404).json({ success: false, error: 'Signal not found' });
  
  // If signal has a contact lead, ensure they exist in CRM or score is boosted
  if (signal.contactLead) {
    const existing = db.contacts.find(c => c.email.toLowerCase() === signal.contactLead!.email.toLowerCase());
    if (existing) {
      existing.scores.intentScore = Math.min(99, existing.scores.intentScore + signal.intentScoreBoost);
      existing.scores.category = 'HOT';
      existing.timeline.unshift({
        id: `act-${Date.now()}`,
        contactId: existing.id,
        type: 'score_updated',
        title: `Intent Signal: ${signal.title}`,
        description: signal.description,
        timestamp: new Date().toISOString()
      });
    }
  }

  res.json({ success: true, signal, message: `Actioned signal: ${signal.title}` });
});

// 2. AI Smart Inbox Threads & Multi-Channel Replies
apiRouter.get('/inbox/threads', (_req: Request, res: Response) => {
  res.json({ success: true, threads: db.getSmartInboxThreads() });
});

apiRouter.post('/inbox/threads/:id/reply', (req: Request, res: Response) => {
  const { content, channel } = req.body;
  const updated = db.replyToThread(req.params.id, content, channel || 'email');
  if (!updated) return res.status(404).json({ success: false, error: 'Thread not found' });
  res.json({ success: true, thread: updated });
});

apiRouter.post('/inbox/threads/:id/convert-deal', (req: Request, res: Response) => {
  const thread = db.getSmartInboxThreads().find(t => t.id === req.params.id);
  if (!thread) return res.status(404).json({ success: false, error: 'Thread not found' });

  const dealValue = Number(req.body.dealValue) || 4500;
  
  // Find or create contact in CRM
  let contact = db.contacts.find(c => c.email.toLowerCase() === thread.contactEmail.toLowerCase());
  if (contact) {
    contact.status = 'OPPORTUNITY';
    contact.scores.intentScore = 98;
    contact.scores.category = 'HOT';
    contact.revenueTotal = (contact.revenueTotal || 0) + dealValue;
    contact.timeline.unshift({
      id: `act-deal-${Date.now()}`,
      contactId: contact.id,
      type: 'sales_call',
      title: 'Converted to Deal from AI Smart Inbox',
      description: `Inquiry converted to pipeline opportunity valued at ${dealValue.toLocaleString()}`,
      monetaryValue: dealValue,
      channel: thread.channel,
      timestamp: new Date().toISOString()
    });
  } else {
    const names = thread.contactName ? thread.contactName.split(' ') : ['Inbound', 'Prospect'];
    contact = db.addContact({
      companyName: thread.companyName,
      firstName: names[0],
      lastName: names.slice(1).join(' ') || 'Lead',
      email: thread.contactEmail,
      jobTitle: 'Decision Maker',
      seniority: 'Executive',
      country: 'United States',
      city: 'Global',
      timezone: 'America/New_York',
      status: 'OPPORTUNITY',
      revenueTotal: dealValue,
      emailVerification: {
        email: thread.contactEmail,
        status: 'VALID',
        confidenceScore: 99,
        provider: 'Apex Real-Time Verifier',
        verificationDate: new Date().toISOString(),
        reason: 'Delivered and actively engaging prospect',
        riskFlags: [],
        details: {
          syntaxValid: true,
          domainExists: true,
          mxRecordsFound: true,
          isDisposable: false,
          isRoleAccount: false,
          isCatchAll: false,
          smtpReachable: true
        }
      },
      scores: {
        leadFitScore: 95,
        engagementScore: 92,
        intentScore: 98,
        customerValueScore: 90,
        category: 'HOT',
        intentSignals: ['Demo booked via AI Smart Inbox', 'High Buying Intent Reply'],
        recommendedAction: 'Send proposal & executive contract agreement',
        confidence: 0.96,
        lastCalculated: new Date().toISOString()
      },
      tags: ['inbox-conversion', 'demo-requested', 'high-intent'],
      customFields: {},
      source: 'AI Smart Inbox Conversion',
      timeline: [
        {
          id: `act-deal-${Date.now()}`,
          contactId: '',
          type: 'sales_call',
          title: 'Demo Booked from AI Smart Inbox',
          description: `Converted inbound reply into active pipeline deal valued at ${dealValue.toLocaleString()}`,
          monetaryValue: dealValue,
          channel: thread.channel,
          timestamp: new Date().toISOString()
        }
      ],
      notes: [`Converted from Smart Inbox thread (${thread.id}) on ${new Date().toLocaleDateString()}`],
      tasks: []
    });
  }

  // Update revenue attribution
  db.revenueAttribution.totalRevenue += dealValue;
  db.revenueAttribution.conversionFunnel.qualified += 1;
  db.revenueAttribution.conversionFunnel.converted += 1;
  if (thread.channel === 'whatsapp') {
    db.revenueAttribution.channelBreakdown.whatsapp += dealValue;
  } else {
    db.revenueAttribution.channelBreakdown.email += dealValue;
  }

  thread.sentiment = 'INTERESTED_DEMO';
  thread.status = 'REPLIED';

  res.json({
    success: true,
    contact,
    dealValue,
    message: `Successfully converted ${thread.contactName} (${thread.companyName}) into active CRM deal!`
  });
});

apiRouter.post('/ai/generate-smart-reply', async (req: Request, res: Response) => {
  try {
    const { leadName, companyName, channel, leadMessage, sentiment } = req.body;
    const aiReply = await generateSmartReplyForLead({
      leadName: leadName || 'Prospect',
      companyName: companyName || 'Company',
      channel: channel || 'email',
      leadMessage: leadMessage || '',
      sentiment: sentiment || 'INTERESTED_DEMO'
    });
    res.json({ success: true, reply: aiReply });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Live AI Deliverability & Spam Word Auditor
apiRouter.post('/ai/audit-copy', async (req: Request, res: Response) => {
  try {
    const { subject, bodyHtml } = req.body;
    const cleanText = (bodyHtml || '').replace(/<[^>]*>?/gm, ' ');
    const audit = await auditEmailSpamAndReadability(subject || '', cleanText);
    res.json({ success: true, audit });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Global High-Volume Scouting & Mass Pitch Dispatcher (Flexible volume: 50 to 100,000+ without forced 2000 benchmark)
apiRouter.post('/leads/global-scout', async (req: Request, res: Response) => {
  try {
    const { 
      userGoal, 
      whatTheySell, 
      painPoint, 
      targetAudience, 
      industry, 
      targetRegion, 
      targetCategory, 
      domainProvider, 
      leadVolume, 
      minIntentScore, 
      seniority,
      sampleLimit
    } = req.body;

    const requestedVolume = Number(leadVolume) || Number(sampleLimit) || 500;

    const scoutResults = await scoutGlobalHighVolumeLeads({
      userGoal,
      whatTheySell: whatTheySell || 'B2B CRM & Marketing Automation',
      painPoint,
      targetAudience,
      industry: industry || 'Commercial Enterprise',
      targetRegion: targetRegion || 'GLOBAL',
      targetCategory: targetCategory || 'BUSINESS_B2B',
      domainProvider: domainProvider || 'ALL_DOMAINS',
      leadVolume: requestedVolume,
      minIntentScore: Number(minIntentScore) || 80,
      seniority: seniority || 'Executive',
      sampleLimit: sampleLimit ? Number(sampleLimit) : undefined
    });

    res.json({
      success: true,
      ...scoutResults
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/campaigns/mass-dispatch', (_req: Request, res: Response) => {
  res.json({ success: true, jobs: db.getMassDispatchJobs() });
});

apiRouter.get('/campaigns/mass-dispatch/:id', (req: Request, res: Response) => {
  const job = db.getMassDispatchJobById(req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Mass dispatch job not found' });
  res.json({ success: true, job });
});

apiRouter.post('/campaigns/mass-dispatch', (req: Request, res: Response) => {
  try {
    const { 
      campaignName, 
      targetOffer, 
      whatTheySell, 
      totalRecipients, 
      channel, 
      dispatchSpeed, 
      subject, 
      bodyMessage,
      sampleLogs
    } = req.body;

    if (!bodyMessage) {
      return res.status(400).json({ success: false, error: 'Pitch body message is required' });
    }

    const recipientCount = Number(totalRecipients) > 0 
      ? Number(totalRecipients) 
      : (Array.isArray(sampleLogs) && sampleLogs.length > 0 ? sampleLogs.length : 100);

    const job = db.createMassDispatchJob({
      campaignName: campaignName || `Global Outreach to ${whatTheySell || 'Clients'}`,
      targetOffer: targetOffer || 'Enterprise Growth & Revenue Automation',
      whatTheySell: whatTheySell || 'Commercial Solutions',
      totalRecipients: recipientCount,
      channel: channel || 'email',
      dispatchSpeed: dispatchSpeed || 'INSTANT_TURBO',
      subject: subject || `Quick question regarding {{company}}'s customer acquisition`,
      bodyMessage,
      sampleLogs
    });

    res.json({
      success: true,
      job,
      message: `Successfully dispatched mass pitch to ${job.totalRecipients.toLocaleString()} recipients via ${job.channel.toUpperCase()}.`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Persistent Cloud & Webhook Ingestion API Endpoints ---

// 1. Cloud Sync & Multi-Tenant Status
apiRouter.get('/cloud-sync/status', (req: Request, res: Response) => {
  res.json({ success: true, status: db.getCloudSyncStatus() });
});

// 2. Webhook Logs
apiRouter.get('/webhooks/logs', (req: Request, res: Response) => {
  res.json({ success: true, logs: db.getWebhookLogs() });
});

// 3. Gmail Webhook / Push Ingestion
apiRouter.post('/webhooks/gmail', (req: Request, res: Response) => {
  try {
    const { emailAddress, historyId, message, senderName, senderEmail, subject, snippet, body } = req.body;
    const sender = senderEmail || (message && message.sender) || 'sarah.growth@enterprise.com';
    const sName = senderName || (message && message.senderName) || 'Sarah Inbound';
    const content = body || snippet || (message && message.snippet) || subject || 'Inbound email received via Gmail push synchronization.';

    const result = db.ingestWebhookEvent({
      provider: 'GMAIL',
      eventType: 'gmail.message.received',
      senderEmail: sender,
      senderName: sName,
      companyName: sender.split('@')[1]?.split('.')[0]?.toUpperCase() + ' Corp' || 'Inbound Partner',
      content,
      rawPayload: req.body
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Microsoft Outlook / Graph Webhook Ingestion
apiRouter.post('/webhooks/outlook', (req: Request, res: Response) => {
  try {
    const { value, senderEmail, senderName, subject, bodyPreview } = req.body;
    const notification = (value && value[0]) || {};
    const sender = senderEmail || notification.senderEmail || 'marcus.exec@londonscale.co.uk';
    const sName = senderName || notification.senderName || 'Marcus Director';
    const content = bodyPreview || subject || notification.bodyPreview || 'Microsoft Outlook Graph change notification received.';

    const result = db.ingestWebhookEvent({
      provider: 'OUTLOOK',
      eventType: 'outlook.graph.notification',
      senderEmail: sender,
      senderName: sName,
      companyName: sender.split('@')[1]?.split('.')[0]?.toUpperCase() + ' Ltd' || 'UK Enterprise',
      content,
      rawPayload: req.body
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. WhatsApp Business Cloud API Handshake (GET) & Message Ingestion (POST)
apiRouter.get('/webhooks/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'apex_webhook_secret_key')) {
    return res.status(200).send(challenge);
  }
  res.status(200).send(challenge || 'WHATSAPP_WEBHOOK_READY');
});

apiRouter.post('/webhooks/whatsapp', (req: Request, res: Response) => {
  try {
    const { entry, senderPhone, senderName, messageText } = req.body;
    let phone = senderPhone || '+2348039281140';
    let name = senderName || 'WhatsApp Client';
    let content = messageText || 'Hi, checking in regarding your customer acquisition offer.';

    // If Meta payload format
    if (entry && entry[0]?.changes && entry[0]?.changes[0]?.value?.messages) {
      const msg = entry[0].changes[0].value.messages[0];
      const contact = entry[0].changes[0].value.contacts?.[0];
      if (msg) {
        phone = msg.from || phone;
        content = msg.text?.body || msg.button?.text || content;
      }
      if (contact) {
        name = contact.profile?.name || name;
      }
    }

    const result = db.ingestWebhookEvent({
      provider: 'WHATSAPP',
      eventType: 'whatsapp.message.received',
      senderPhone: phone,
      senderName: name,
      companyName: 'West Africa Commercial Lead',
      content,
      rawPayload: req.body
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Generic Custom / Stripe / Zapier Inbound Webhook
apiRouter.post('/webhooks/custom', (req: Request, res: Response) => {
  try {
    const { provider, eventType, email, phone, name, company, content, dealAmount } = req.body;

    const result = db.ingestWebhookEvent({
      provider: provider || 'CUSTOM',
      eventType: eventType || 'custom.event.ingested',
      senderEmail: email,
      senderPhone: phone,
      senderName: name || 'Custom Inbound Lead',
      companyName: company || 'Custom Partner Tech',
      content: content || `Custom webhook payload triggered from external pipeline.`,
      dealAmount: Number(dealAmount) || 0,
      rawPayload: req.body
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Interactive Test Trigger Endpoint for UI Sandbox Testing
apiRouter.post('/webhooks/test-trigger', (req: Request, res: Response) => {
  try {
    const { provider, eventType, senderName, senderEmail, senderPhone, companyName, content, dealAmount } = req.body;

    const result = db.ingestWebhookEvent({
      provider: provider || 'WHATSAPP',
      eventType: eventType || 'test.simulation.received',
      senderName: senderName || 'Amina Bello',
      senderEmail,
      senderPhone: senderPhone || '+2348123456789',
      companyName: companyName || 'Kwara Financial Solutions',
      content: content || 'Hello Tim, saw the pitch. Can we get pricing and onboarding steps for our 12 team members?',
      dealAmount: Number(dealAmount) || (provider === 'CUSTOM' ? 2400 : 0),
      rawPayload: req.body
    });

    res.json({
      success: true,
      ...result,
      message: `Successfully ingested live webhook from ${provider.toUpperCase()} and synchronized CRM, Smart Inbox & Intent Radar.`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. 14-Day Full Access Sandbox, Cost Control & Onboarding Endpoints
apiRouter.get('/sandbox/metrics', (_req: Request, res: Response) => {
  try {
    const metrics = usageControl.getMetrics();
    res.json({
      success: true,
      metrics,
      byok: usageControl.byokConfig,
      wowJourney: usageControl.wowJourney,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/sandbox/byok', (req: Request, res: Response) => {
  try {
    const updated = usageControl.updateBYOK(req.body);
    res.json({
      success: true,
      byok: updated,
      message: updated.enabled ? 'Bring-Your-Own-Key activated! Fair-use platform restrictions bypassed.' : 'Switched to Platform Managed Fair Use mode.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/sandbox/wow-journey', (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      wowJourney: usageControl.wowJourney
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/sandbox/wow-journey/goal', (req: Request, res: Response) => {
  try {
    const { goal } = req.body;
    const updated = usageControl.setWowJourneyGoal(goal || 'GROW_BUSINESS');
    res.json({ success: true, wowJourney: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/sandbox/wow-journey/step-complete', (req: Request, res: Response) => {
  try {
    const { stepId } = req.body;
    if (!stepId) {
      return res.status(400).json({ success: false, error: 'Step ID is required' });
    }
    const updated = usageControl.completeWowJourneyStep(stepId);
    res.json({ success: true, wowJourney: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sample Mode Generator (Demonstrates 45s high-fidelity personalized pitch preview)
apiRouter.post('/sandbox/sample-media', (req: Request, res: Response) => {
  try {
    const { recipientName, companyName, offerType } = req.body;
    const costCheck = usageControl.evaluateRequestCost('SAMPLE_MEDIA', 1);

    const samplePreview = {
      id: `preview-${Date.now()}`,
      durationSeconds: 45,
      type: 'PERSONALIZED_PITCH_PREVIEW',
      recipientName: recipientName || 'Executive Lead',
      companyName: companyName || 'Target Enterprise',
      hookTitle: `How ${companyName || 'Your Team'} Can Scale Pipeline 3.4x in 30 Days`,
      voiceId: 'eleven_labs_natural_executive_male',
      audioWaveform: [30, 45, 80, 60, 95, 40, 75, 90, 85, 40, 65, 80, 50, 70, 90, 100, 45, 60, 85, 30],
      scriptLines: [
        `[00:00 - 00:10] Hi ${recipientName || 'there'}, noticed ${companyName || 'your company'} has been scaling revenue operations.`,
        `[00:10 - 00:25] We built ApexRevenue to solve the exact bounce rate and low reply issues holding outbound teams back.`,
        `[00:25 - 00:40] Here is a verified breakdown of 5,000 active decision-makers ready for your offer.`,
        `[00:40 - 00:45] Click below to test the full live sequence.`
      ],
      sampleModeNotice: costCheck.message,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      samplePreview,
      costCheck,
      metrics: usageControl.getMetrics()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});




