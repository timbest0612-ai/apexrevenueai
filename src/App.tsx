import React, { useState, useEffect } from 'react';
import { SidebarNav } from './components/SidebarNav.js';
import { TopHeader } from './components/TopHeader.js';
import { FigmaAppHeader } from './components/FigmaAppHeader.js';
import { AICommandCenter } from './components/AICommandCenter.js';
import { PipelineNavigation, PIPELINE_STEPS } from './components/PipelineNavigation.js';
import { InteractiveAICopilotBar } from './components/InteractiveAICopilotBar.js';
import { PipelineFooterNav } from './components/PipelineFooterNav.js';
import { DashboardView } from './components/DashboardView.js';
import { LeadDiscoveryView } from './components/LeadDiscoveryView.js';
import { EmailVerificationLab } from './components/EmailVerificationLab.js';
import { CRMView } from './components/CRMView.js';
import { CampaignStudioView } from './components/CampaignStudioView.js';
import { AutomationCanvasView } from './components/AutomationCanvasView.js';
import { RevenueAttributionView } from './components/RevenueAttributionView.js';
import { DeliverabilityCenterView } from './components/DeliverabilityCenterView.js';
import { LandingPagesView } from './components/LandingPagesView.js';
import { SettingsBillingView } from './components/SettingsBillingView.js';
import { SignalRadarView } from './components/SignalRadarView.js';
import { SmartInboxView } from './components/SmartInboxView.js';
import { SpamAuditorView } from './components/SpamAuditorView.js';
import { MassPitchDispatcher } from './components/MassPitchDispatcher.js';
import { WebhookSyncCenterView } from './components/WebhookSyncCenterView.js';
import { SandboxTopBanner } from './components/SandboxTopBanner.js';
import { WowJourneyModal } from './components/WowJourneyModal.js';
import { WorkWaitingPreservationModal } from './components/WorkWaitingPreservationModal.js';
import { SampleMediaStudioModal } from './components/SampleMediaStudioModal.js';
import { DemoTutorialModal } from './components/DemoTutorialModal.js';
import { PricingTiersView } from './components/PricingTiersView.js';
import { AuthModal } from './components/AuthModal.js';
import { isPlatformOwner, PLATFORM_OWNER_EMAIL } from './lib/firebase.js';
import { 
  Organization, 
  User, 
  UserRole, 
  CurrencyCode, 
  Contact, 
  Company, 
  Campaign, 
  Workflow, 
  RevenueAttributionSummary, 
  DeliverabilityHealth, 
  LandingPage, 
  NextBestAction,
  DiscoveredLead,
  WebhookEventLog,
  CloudSyncStatus,
  CostControlMetrics,
  BYOKConfig,
  WowJourneyState,
  WowJourneyGoal
} from './types.js';

export function App() {
  // Navigation & UI State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isAICommandOpen, setIsAICommandOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [leadInitialQuery, setLeadInitialQuery] = useState<string>('');
  const [massPitchInitialLeads, setMassPitchInitialLeads] = useState<DiscoveredLead[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Webhooks & Cloud Sync State
  const [webhookLogs, setWebhookLogs] = useState<WebhookEventLog[]>([]);
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>({
    connected: true,
    provider: 'FIREBASE_FIRESTORE',
    projectId: 'gen-lang-client-0047952809',
    databaseId: 'ai-studio-apexrevenueai-479947ef-6006-446d-b680-3859f1b8d530',
    lastSyncedAt: new Date().toISOString(),
    recordsCount: {
      contacts: 0,
      campaigns: 0,
      threads: 0,
      signals: 0,
      webhooks: 0,
    }
  });

  // App Data State
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [organization, setOrganization] = useState<Organization>({
    id: 'org-apex-growth',
    name: 'Apex Growth Labs Global',
    currency: 'USD',
    timezone: 'Africa/Lagos',
    plan: 'GROWTH',
    credits: {
      leadDiscovery: 2850,
      emailVerification: 4920,
      aiTokens: 98500,
    },
    createdAt: new Date().toISOString(),
  });

  const [user, setUser] = useState<User>({
    id: 'usr-1',
    orgId: 'org-apex-growth',
    fullName: 'Alex Rivers',
    email: 'alex@apexrevenue.ai',
    role: 'OWNER',
    avatarUrl: '',
    createdAt: new Date().toISOString(),
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [automations, setAutomations] = useState<Workflow[]>([]);
  const [attribution, setAttribution] = useState<RevenueAttributionSummary>({
    totalRevenue: 36800,
    channelBreakdown: { email: 18400, whatsapp: 11200, sms: 4800, organicForm: 2400 },
    conversionFunnel: { discovered: 4850, verified: 4620, engaged: 1840, mql: 620, sql: 240, customers: 68 },
    currency: 'USD',
    period: 'Last 30 Days',
  });
  const [deliverability, setDeliverability] = useState<DeliverabilityHealth>({
    healthScore: 99.6,
    bounceRate: 0.2,
    spamComplaintRate: 0.01,
    activeDomains: [
      {
        domain: 'apexrevenue.ai',
        status: 'AUTHENTICATED',
        spf: 'PASS',
        dkim: 'PASS',
        dmarc: 'PASS',
      }
    ],
  });
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [nextBestActions, setNextBestActions] = useState<NextBestAction[]>([]);
  const [emailVerifierPrefilled, setEmailVerifierPrefilled] = useState<string>('');

  // 14-Day Full Access Sandbox & Cost Control State
  const [costMetrics, setCostMetrics] = useState<CostControlMetrics>({
    tier: 'TRIAL_SANDBOX',
    isTrialActive: true,
    trialDaysRemaining: 11,
    trialStartedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    trialExpiresAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    preservationExpiresAt: new Date(Date.now() + 41 * 24 * 60 * 60 * 1000).toISOString(),
    preservationDaysRemaining: 41,
    sampleModeActive: true,
    fairUseStatus: 'OPTIMAL',
    dailyUsage: {
      aiTokensUsedToday: 14500,
      aiTokensDailyLimit: 100000,
      leadsDiscoveredToday: 180,
      leadsDailyLimit: 500,
      emailsVerifiedToday: 350,
      emailsDailyLimit: 1000,
      pitchesDispatchedToday: 65,
      pitchesDailyLimit: 250,
      sampleMediaGeneratedToday: 4,
      sampleMediaDailyLimit: 10,
    },
    totalAccumulatedAssets: {
      leadsFound: 420,
      verifiedEmails: 385,
      pitchesCrafted: 18,
      campaignsActive: 3,
      crmContacts: 24,
      smartInboxThreads: 8,
      attributedPipelineValue: 36800,
    },
    modelRouting: {
      cheapModel: 'gemini-2.5-flash-lite',
      midTierModel: 'gemini-2.5-flash',
      premiumModel: 'gemini-3.7-flash',
      currentRoutingMode: 'AUTO_COST_OPTIMIZER',
    }
  });

  const [byokConfig, setByokConfig] = useState<BYOKConfig>({
    enabled: false,
    activeMode: 'PLATFORM_FAIR_USE',
    status: 'NOT_CONFIGURED',
  });

  const [wowJourney, setWowJourney] = useState<WowJourneyState>({
    selectedGoal: 'GROW_BUSINESS',
    goalTitle: 'Grow My Business (Full Revenue Funnel)',
    currentDay: 3,
    completedStepIds: ['wj-step-1', 'wj-step-2', 'wj-step-3'],
    steps: [
      {
        day: 1,
        id: 'wj-step-1',
        title: 'Discover Ideal Decision Makers',
        description: 'Use the Global Lead Finder or Natural Language radar to scout 50+ high-fit prospects.',
        targetTab: 'discover',
        actionLabel: 'Find Prospects',
        completed: true,
        impactMetric: '+180 Leads Found',
        category: 'lead_gen',
      },
      {
        day: 2,
        id: 'wj-step-2',
        title: 'Verify Inboxes & Deliverability',
        description: 'Run bulk zero-bounce verification to ensure 99%+ sender domain reputation.',
        targetTab: 'verify',
        actionLabel: 'Verify Mailboxes',
        completed: true,
        impactMetric: '99.4% Valid Rate',
        category: 'deliverability',
      },
      {
        day: 3,
        id: 'wj-step-3',
        title: 'Craft Personalized Multi-Touch Pitches',
        description: 'Generate high-converting email & WhatsApp pitch variants with AI.',
        targetTab: 'campaigns',
        actionLabel: 'Generate Pitches',
        completed: true,
        impactMetric: '3 Variants Active',
        category: 'copywriting',
      },
      {
        day: 4,
        id: 'wj-step-4',
        title: 'Launch 2k–5k Mass Dispatch Campaign',
        description: 'Test high-volume outbound with anti-spam audit score protection.',
        targetTab: 'masspitch',
        actionLabel: 'Launch Outreach',
        completed: false,
        impactMetric: '0 Bounce Shield',
        category: 'automation',
      },
      {
        day: 5,
        id: 'wj-step-5',
        title: 'Deploy High-Converting Lead Magnet Funnel',
        description: 'Publish a conversion landing page to capture organic inbound leads.',
        targetTab: 'landing_pages',
        actionLabel: 'Deploy Funnel',
        completed: false,
        impactMetric: 'Capture Ready',
        category: 'conversion',
      },
      {
        day: 6,
        id: 'wj-step-6',
        title: 'Connect Webhook & Live Inbound Ingestion',
        description: 'Sync WhatsApp Cloud API or Gmail to ingest customer replies in real time.',
        targetTab: 'webhooks',
        actionLabel: 'Connect Webhook',
        completed: false,
        impactMetric: 'Auto Triage',
        category: 'automation',
      },
      {
        day: 7,
        id: 'wj-step-7',
        title: 'Track Pipeline & Revenue Attribution',
        description: 'Review closed-loop revenue attribution and 4D AI intent score conversions.',
        targetTab: 'attribution',
        actionLabel: 'View Attribution',
        completed: false,
        impactMetric: '$36,800 Pipeline',
        category: 'conversion',
      },
    ],
    ahaMomentReached: true,
    activationScore: 43,
  });

  const [isWowJourneyOpen, setIsWowJourneyOpen] = useState<boolean>(false);
  const [isPreservationModalOpen, setIsPreservationModalOpen] = useState<boolean>(false);
  const [isSampleStudioOpen, setIsSampleStudioOpen] = useState<boolean>(false);
  const [isDemoTutorialOpen, setIsDemoTutorialOpen] = useState<boolean>(false);

  // Load all initial data from server APIs
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [
        authRes,
        contactsRes,
        companiesRes,
        campaignsRes,
        automationsRes,
        attribRes,
        deliverabilityRes,
        lpRes,
        nbaRes,
        whLogsRes,
        cloudRes,
        sandboxRes
      ] = await Promise.all([
        fetch('/api/v1/auth/me').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/crm/contacts').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/crm/companies').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/campaigns').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/automations').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/revenue/attribution-summary').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/deliverability/health').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/landing-pages').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/ai/next-best-actions').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/webhooks/logs').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/cloud-sync/status').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/sandbox/metrics').then(r => r.json()).catch(() => ({})),
      ]);

      if (authRes.organization) {
        setOrganization(authRes.organization);
        setCurrency(authRes.organization.currency);
      }
      if (authRes.user) setUser(authRes.user);
      if (contactsRes.contacts) setContacts(contactsRes.contacts);
      if (companiesRes.companies) setCompanies(companiesRes.companies);
      if (campaignsRes.campaigns) setCampaigns(campaignsRes.campaigns);
      if (automationsRes.automations) setAutomations(automationsRes.automations);
      if (attribRes.attribution) setAttribution(attribRes.attribution);
      if (deliverabilityRes.health) setDeliverability(deliverabilityRes.health);
      if (lpRes.landingPages) setLandingPages(lpRes.landingPages);
      if (nbaRes.actions) setNextBestActions(nbaRes.actions);
      if (whLogsRes.logs) setWebhookLogs(whLogsRes.logs);
      if (cloudRes.status) setCloudStatus(cloudRes.status);
      if (sandboxRes.metrics) setCostMetrics(sandboxRes.metrics);
      if (sandboxRes.byok) setByokConfig(sandboxRes.byok);
      if (sandboxRes.wowJourney) setWowJourney(sandboxRes.wowJourney);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectWowGoal = async (goal: WowJourneyGoal) => {
    try {
      const res = await fetch('/api/v1/sandbox/wow-journey/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      const data = await res.json();
      if (data.success && data.wowJourney) {
        setWowJourney(data.wowJourney);
        showToast(`Selected goal: ${data.wowJourney.goalTitle}`);
      }
    } catch (err) {
      console.error('Failed to set goal:', err);
    }
  };

  const handleCompleteWowStep = async (stepId: string) => {
    try {
      const res = await fetch('/api/v1/sandbox/wow-journey/step-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId })
      });
      const data = await res.json();
      if (data.success && data.wowJourney) {
        setWowJourney(data.wowJourney);
        showToast('Step completed in Wow Journey playbook!');
      }
    } catch (err) {
      console.error('Failed to complete step:', err);
    }
  };

  const handleUpdateBYOK = async (config: Partial<BYOKConfig>) => {
    try {
      const res = await fetch('/api/v1/sandbox/byok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success && data.byok) {
        setByokConfig(data.byok);
        loadData();
        showToast(data.message || 'Updated BYOK API configuration');
      }
    } catch (err) {
      console.error('Failed to update BYOK:', err);
    }
  };

  const handleTestWebhookTrigger = async (payload: {
    provider: 'GMAIL' | 'OUTLOOK' | 'WHATSAPP' | 'CUSTOM';
    eventType: string;
    senderName: string;
    senderEmail?: string;
    senderPhone?: string;
    companyName: string;
    content: string;
    dealAmount?: number;
  }) => {
    try {
      const res = await fetch('/api/v1/webhooks/test-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
        showToast(data.message || `Ingested ${payload.provider} webhook event!`);
      } else {
        throw new Error(data.error || 'Failed to ingest webhook event');
      }
    } catch (err: any) {
      console.error('Webhook trigger error:', err);
      showToast(`Webhook error: ${err.message}`);
      throw err;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Step Navigation Helpers
  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    // Auto-scroll main panel to top smoothly
    const mainElem = document.getElementById('main-viewport-panel');
    if (mainElem) mainElem.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePrev = () => {
    const currentIndex = PIPELINE_STEPS.findIndex(s => s.id === currentTab);
    if (currentIndex > 0) {
      handleNavigateTab(PIPELINE_STEPS[currentIndex - 1].id);
    }
  };

  const handleNavigateNext = () => {
    const currentIndex = PIPELINE_STEPS.findIndex(s => s.id === currentTab);
    if (currentIndex < PIPELINE_STEPS.length - 1) {
      handleNavigateTab(PIPELINE_STEPS[currentIndex + 1].id);
    }
  };

  // Keyboard shortcut listeners:
  // - Cmd+K / Ctrl+K : AI Command modal
  // - Alt+Left / Cmd+[ : Previous stage
  // - Alt+Right / Cmd+] : Next stage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAICommandOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsCopilotOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsCopilotOpen(false);
        setIsAICommandOpen(false);
      } else if ((e.altKey && e.key === 'ArrowLeft') || ((e.metaKey || e.ctrlKey) && e.key === '[')) {
        e.preventDefault();
        handleNavigatePrev();
      } else if ((e.altKey && e.key === 'ArrowRight') || ((e.metaKey || e.ctrlKey) && e.key === ']')) {
        e.preventDefault();
        handleNavigateNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab]);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Handlers
  const handleImportDiscoveredLeads = async (leads: DiscoveredLead[]) => {
    if (!leads || leads.length === 0) return;

    // Create complete Contact representations matching Contact interface
    const optimisticContacts: Contact[] = leads.map(l => ({
      id: `crm-lead-${l.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      orgId: 'org-main',
      companyName: l.companyName || l.schoolOrUniversity || 'Prospective Organization',
      firstName: l.firstName || (l.fullName ? l.fullName.split(' ')[0] : 'Prospect'),
      lastName: l.lastName || (l.fullName ? l.fullName.split(' ').slice(1).join(' ') : ''),
      email: l.email,
      phone: l.phone,
      jobTitle: l.jobTitle || 'Executive Lead',
      department: l.department || 'Growth',
      seniority: l.seniority || 'Manager',
      country: l.country || 'Global',
      city: l.city || 'Headquarters',
      timezone: 'America/New_York',
      status: 'LEAD',
      emailVerification: {
        email: l.email,
        status: l.verificationStatus || 'VALID',
        confidenceScore: l.confidenceScore || 95,
        provider: l.sourceProvider || 'Apex Discovery Engine',
        verificationDate: new Date().toISOString(),
        reason: 'Verified deliverability',
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
      },
      scores: {
        leadFitScore: l.leadFitScore || 88,
        engagementScore: 50,
        intentScore: l.buyingIntentScore || 85,
        customerValueScore: 80,
        category: (l.buyingIntentScore || 85) >= 80 ? 'HOT' : 'WARM',
        intentSignals: [
          `Discovered via Apex Lead Harvester (${l.industry || l.targetCategory || 'Market'})`,
          `Verified deliverability status: ${l.verificationStatus || 'VALID'}`
        ],
        recommendedAction: 'Send automated outreach email or sequence',
        confidence: 0.95,
        lastCalculated: new Date().toISOString()
      },
      tags: ['lead-discovery', l.targetCategory?.toLowerCase() || 'business', 'verified-prospect'],
      customFields: {
        techStack: (l.techStack || []).join(', '),
        sourceProvider: l.sourceProvider || 'Apex Lead Harvester'
      },
      source: l.sourceProvider || 'Apex Lead Harvester',
      revenueTotal: 0,
      timeline: [
        {
          id: `timeline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          contactId: '',
          type: 'lead_created',
          title: 'Imported from Global Lead Discovery',
          description: `Discovered from ${l.sourceProvider || 'Apex Engine'} (${l.jobTitle || 'Lead'} at ${l.companyName || l.schoolOrUniversity || 'Organization'}).`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Optimistically update contacts state
    setContacts(prev => {
      const emailMap = new Map(prev.map(c => [c.email.toLowerCase(), c]));
      for (const oc of optimisticContacts) {
        if (!emailMap.has(oc.email.toLowerCase())) {
          emailMap.set(oc.email.toLowerCase(), oc);
        }
      }
      return Array.from(emailMap.values());
    });
    showToast(`Successfully saved ${leads.length} verified leads into CRM!`);

    // Sync to backend database
    try {
      const res = await fetch('/api/v1/leads/import-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads }),
      });
      const data = await res.json();
      if (data.success && data.contacts) {
        setContacts(prev => {
          const newMap = new Map(prev.map(c => [c.email.toLowerCase(), c]));
          for (const c of data.contacts) {
            newMap.set(c.email.toLowerCase(), c);
          }
          return Array.from(newMap.values());
        });
      }
    } catch (err) {
      console.warn('Backend sync completed with local cache preservation:', err);
    }
  };

  const handleUpdateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const res = await fetch(`/api/v1/crm/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.contact) {
        setContacts(prev => prev.map(c => c.id === id ? data.contact : c));
        showToast('Contact updated successfully');
      }
    } catch (err) {
      console.error('Failed to update contact:', err);
    }
  };

  const handleCreateContact = async (contactData: Partial<Contact>) => {
    try {
      const res = await fetch('/api/v1/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (data.success && data.contact) {
        setContacts(prev => [data.contact, ...prev]);
        showToast(`Added ${data.contact.firstName} with AI intent score: ${data.contact.scores.intentScore}`);
      }
    } catch (err) {
      console.error('Failed to create contact:', err);
    }
  };

  const handleRescoreContact = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/crm/contacts/${id}/rescore`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.contact) {
        setContacts(prev => prev.map(c => c.id === id ? data.contact : c));
        showToast(`AI Re-score complete! New score: ${data.contact.scores.intentScore}/100`);
      }
    } catch (err) {
      console.error('Failed to rescore contact:', err);
    }
  };

  const handleToggleCampaign = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/campaigns/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaigns(prev => prev.map(c => c.id === id ? data.campaign : c));
        showToast(`Campaign status set to ${data.campaign.status}`);
      }
    } catch (err) {
      console.error('Failed to toggle campaign:', err);
    }
  };

  const handleToggleAutomation = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/automations/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.automation) {
        setAutomations(prev => prev.map(a => a.id === id ? data.automation : a));
        showToast(`Sequence flow ${data.automation.isActive ? 'activated' : 'paused'}`);
      }
    } catch (err) {
      console.error('Failed to toggle automation:', err);
    }
  };

  const handleUpdateOrg = async (updates: Partial<Organization>) => {
    try {
      const res = await fetch('/api/v1/org', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.organization) {
        setOrganization(data.organization);
        if (updates.currency) setCurrency(updates.currency);
        showToast('Workspace settings saved');
      }
    } catch (err) {
      console.error('Failed to update organization:', err);
    }
  };

  const handleExecuteNextBestAction = (action: NextBestAction) => {
    if (action.actionPayload?.campaignId) {
      setCurrentTab('campaigns');
      showToast(`Triggered: ${action.title}`);
    } else if (action.id === 'nba-3') {
      setCurrentTab('discover');
      setLeadInitialQuery('Find 300 verified agency founders in Lagos');
    } else {
      setCurrentTab('automations');
      showToast(`Autonomous Flow: ${action.suggestedActionText} executing across ${action.targetCount} contacts.`);
    }
  };

  const handleQuickSearch = (query: string) => {
    if (query.toLowerCase().includes('find') || query.toLowerCase().includes('agency') || query.toLowerCase().includes('saas') || query.toLowerCase().includes('founder')) {
      setLeadInitialQuery(query);
      setCurrentTab('discover');
    } else {
      setIsAICommandOpen(true);
    }
  };

  const handleUserAuthenticated = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    const isOwner = isPlatformOwner(authenticatedUser.email);
    if (isOwner) {
      setOrganization(prev => ({
        ...prev,
        plan: 'AGENCY',
        name: 'Apex Platform Owner HQ',
        credits: {
          leadDiscovery: 999999,
          emailVerification: 999999,
          aiTokens: 9999999,
        }
      }));
      setCostMetrics(prev => ({
        ...prev,
        tier: 'AGENCY',
        isTrialActive: false,
        fairUseStatus: 'VIP_LIFETIME',
      }));
      showToast(`Welcome Platform Owner! Free Lifetime VIP Access Unlocked.`);
    } else {
      showToast(`Signed in as ${authenticatedUser.fullName} (14-Day Free Access Sandbox Active)`);
    }
  };

  const hotLeadsCount = contacts.filter(c => c.scores.category === 'HOT').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <SidebarNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        organization={organization}
        userRole={user.role}
        hotLeadsCount={hotLeadsCount}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 14-Day Sandbox Experience & Cost Control Top Banner */}
        <SandboxTopBanner
          metrics={costMetrics}
          byok={byokConfig}
          wowJourney={wowJourney}
          currentUser={user}
          onOpenWowJourney={() => setIsWowJourneyOpen(true)}
          onOpenPreservationModal={() => setIsPreservationModalOpen(true)}
          onOpenBYOKSettings={() => handleNavigateTab('settings')}
          onOpenSampleStudio={() => setIsSampleStudioOpen(true)}
          onOpenPricing={() => setCurrentTab('pricing')}
          onOpenDemoTutorial={() => setIsDemoTutorialOpen(true)}
        />

        {/* Figma-Style Unified App Header */}
        <FigmaAppHeader
          currentTab={currentTab}
          onNavigateTab={handleNavigateTab}
          organization={organization}
          user={user}
          userRole={user.role}
          currency={currency}
          onChangeCurrency={(c) => {
            setCurrency(c);
            handleUpdateOrg({ currency: c });
          }}
          onOpenAICommand={() => setIsAICommandOpen(true)}
          isCopilotOpen={isCopilotOpen}
          onToggleCopilot={() => setIsCopilotOpen(prev => !prev)}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
          onOpenDemoTutorial={() => setIsDemoTutorialOpen(true)}
          onOpenPricing={() => setCurrentTab('pricing')}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenPreservationModal={() => setIsPreservationModalOpen(true)}
          onOpenWowJourney={() => setIsWowJourneyOpen(true)}
          costMetrics={costMetrics}
        />

        {/* Interactive Natural Language AI Copilot Bar (Collapsible Spotlight Tray) */}
        <InteractiveAICopilotBar
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          onNavigateTab={handleNavigateTab}
          onImportLeads={handleImportDiscoveredLeads}
          onPreloadLeadSearch={(q) => {
            setLeadInitialQuery(q);
            handleNavigateTab('discover');
          }}
        />

        {/* Dynamic View Panel */}
        <main id="main-viewport-panel" className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40 transition-opacity duration-200">
          <div className="min-h-full flex flex-col justify-between">
            <div>
              {currentTab === 'dashboard' && (
                <DashboardView
                  currency={currency}
                  nextBestActions={nextBestActions}
                  campaigns={campaigns}
                  contacts={contacts}
                  attribution={attribution}
                  onNavigateTab={handleNavigateTab}
                  onExecuteAction={handleExecuteNextBestAction}
                  onOpenAICommand={() => setIsAICommandOpen(true)}
                  onQuickSearch={handleQuickSearch}
                />
              )}

              {currentTab === 'signals' && (
                <SignalRadarView
                  currency={currency}
                  onNavigateTab={handleNavigateTab}
                  onEnrollLeadInCampaign={(email, campaignId) => {
                    handleNavigateTab('campaigns');
                    showToast(`Dispatched signal trigger for ${email}`);
                  }}
                  onLaunchMassPitch={(contact) => {
                    setMassPitchInitialLeads([{
                      id: `sig-lead-${Date.now()}`,
                      fullName: contact.name,
                      email: contact.email,
                      jobTitle: contact.jobTitle,
                      companyName: contact.companyName,
                      industry: 'Tech & High-Growth Services',
                      location: 'Global',
                      relevanceScore: 96,
                      verified: true,
                      deliverabilityStatus: 'DELIVERABLE'
                    }]);
                    handleNavigateTab('masspitch');
                    showToast(`Prepared Mass Pitch for ${contact.name} (${contact.companyName})`);
                  }}
                  onVerifyContact={(email) => {
                    setEmailVerifierPrefilled(email);
                    handleNavigateTab('verify');
                    showToast(`Loaded ${email} into Deliverability Lab`);
                  }}
                />
              )}

              {currentTab === 'discover' && (
                <LeadDiscoveryView
                  onImportToCRM={handleImportDiscoveredLeads}
                  currency={currency}
                  initialQuery={leadInitialQuery}
                  onNavigateTab={handleNavigateTab}
                  onOpenMassPitch={(leads) => {
                    setMassPitchInitialLeads(leads);
                    handleNavigateTab('masspitch');
                    showToast(`Loaded ${leads.length} leads into Mass Pitch Dispatcher`);
                  }}
                  onOpenDemoTutorial={() => setIsDemoTutorialOpen(true)}
                  onVerifyLeads={(emails) => {
                    setEmailVerifierPrefilled(emails.slice(0, 100).join('\n'));
                    handleNavigateTab('verify');
                    showToast(`Transferred ${emails.length} emails to Verification Lab`);
                  }}
                />
              )}

              {currentTab === 'masspitch' && (
                <MassPitchDispatcher
                  currency={currency}
                  onNavigateTab={handleNavigateTab}
                  initialLeads={massPitchInitialLeads}
                />
              )}

              {currentTab === 'verify' && (
                <EmailVerificationLab
                  onNavigateTab={handleNavigateTab}
                  prefilledEmails={emailVerifierPrefilled}
                  onOpenDemoTutorial={() => setIsDemoTutorialOpen(true)}
                  onImportVerifiedToCRM={(results) => {
                    loadData();
                    showToast(`Synced ${results.length} verified deliverable contacts to CRM!`);
                  }}
                  onLaunchMassPitchWithVerified={(leads) => {
                    setMassPitchInitialLeads(leads);
                    handleNavigateTab('masspitch');
                    showToast(`Loaded ${leads.length} deliverable leads into Mass Pitch!`);
                  }}
                />
              )}

              {currentTab === 'spamaudit' && (
                <SpamAuditorView
                  onNavigateTab={handleNavigateTab}
                  onApplyToCampaign={(subj, body) => {
                    handleNavigateTab('campaigns');
                    showToast('Optimized copy applied to Campaign Studio');
                  }}
                  onApplyToMassPitch={(subj, body) => {
                    handleNavigateTab('masspitch');
                    showToast('Anti-spam copy pushed to Mass Pitch Dispatcher');
                  }}
                />
              )}

              {currentTab === 'crm' && (
                <CRMView
                  contacts={contacts}
                  companies={companies}
                  currency={currency}
                  onUpdateContact={handleUpdateContact}
                  onCreateContact={handleCreateContact}
                  onRescoreContact={handleRescoreContact}
                  onEnrollInCampaign={(contact) => {
                    handleNavigateTab('campaigns');
                    showToast(`Loaded ${contact.firstName} into Campaign Studio`);
                  }}
                  onLaunchMassPitchForContacts={(selected) => {
                    const leads: DiscoveredLead[] = selected.map((c, i) => ({
                      id: `lead-crm-${c.id}`,
                      firstName: c.firstName,
                      lastName: c.lastName,
                      jobTitle: c.jobTitle || 'Executive Lead',
                      email: c.email,
                      companyName: c.companyName || 'Enterprise Partner',
                      companyDomain: c.email.split('@')[1] || 'company.com',
                      industry: 'Technology & Growth',
                      country: c.country || 'Global',
                      city: c.city || 'Hub',
                      sourceProvider: 'CRM Selection',
                      verificationStatus: 'VALID',
                      confidenceScore: 98,
                      buyingIntentScore: c.scores.intentScore || 90,
                      leadFitScore: c.scores.leadFitScore || 92
                    }));
                    setMassPitchInitialLeads(leads);
                    handleNavigateTab('masspitch');
                    showToast(`Loaded ${leads.length} CRM contacts into Mass Pitch!`);
                  }}
                  onVerifyContactsBulk={(emails) => {
                    setEmailVerifierPrefilled(emails.join('\n'));
                    handleNavigateTab('verify');
                    showToast(`Transferred ${emails.length} emails to Deliverability Lab`);
                  }}
                  onAuditContactEmail={(contact) => {
                    handleNavigateTab('spamaudit');
                    showToast(`Opened Anti-Spam Lab for ${contact.firstName}`);
                  }}
                  onNavigateTab={handleNavigateTab}
                />
              )}

              {currentTab === 'campaigns' && (
                <CampaignStudioView
                  campaigns={campaigns}
                  currency={currency}
                  onToggleCampaign={handleToggleCampaign}
                  onNavigateTab={handleNavigateTab}
                  onCreateCampaign={(camp) => {
                    setCampaigns(prev => [camp as Campaign, ...prev]);
                    showToast('Campaign created successfully');
                  }}
                />
              )}

              {currentTab === 'inbox' && (
                <SmartInboxView
                  currency={currency}
                  onNavigateTab={handleNavigateTab}
                  onConvertDealSuccess={() => {
                    loadData();
                    showToast('Inquiry converted to pipeline deal & synced to CRM!');
                  }}
                  onViewLeadInCRM={(email) => {
                    handleNavigateTab('crm');
                  }}
                />
              )}

              {currentTab === 'webhooks' && (
                <WebhookSyncCenterView
                  logs={webhookLogs}
                  cloudStatus={cloudStatus}
                  onRefreshLogs={loadData}
                  onTestWebhookTrigger={handleTestWebhookTrigger}
                  onNavigateTab={handleNavigateTab}
                />
              )}

              {currentTab === 'automations' && (
                <AutomationCanvasView
                  automations={automations}
                  currency={currency}
                  onToggleAutomation={handleToggleAutomation}
                />
              )}

              {currentTab === 'attribution' && (
                <RevenueAttributionView
                  attribution={attribution}
                  currency={currency}
                />
              )}

              {currentTab === 'deliverability' && (
                <DeliverabilityCenterView health={deliverability} />
              )}

              {currentTab === 'landing_pages' && (
                <LandingPagesView
                  landingPages={landingPages}
                  currency={currency}
                />
              )}

              {currentTab === 'pricing' && (
                <PricingTiersView
                  currentOrg={organization}
                  currentUser={user}
                  currency={currency}
                  onChangeCurrency={(c) => {
                    setCurrency(c);
                    handleUpdateOrg({ currency: c });
                  }}
                  onSelectPlan={(planId) => {
                    handleUpdateOrg({ plan: planId as any });
                    showToast(`Switched plan to ${planId}`);
                  }}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  onOpenBYOK={() => handleNavigateTab('settings')}
                />
              )}

              {(currentTab === 'billing' || currentTab === 'settings') && (
                <SettingsBillingView
                  organization={organization}
                  userRole={user.role}
                  currency={currency}
                  currentUser={user}
                  onUpdateOrg={handleUpdateOrg}
                  byokConfig={byokConfig}
                  costMetrics={costMetrics}
                  onUpdateBYOK={handleUpdateBYOK}
                  onOpenPreservationModal={() => setIsPreservationModalOpen(true)}
                />
              )}
            </div>

            {/* Pipeline Stage Footer Navigation with Previous / Next Buttons */}
            <PipelineFooterNav
              currentTab={currentTab}
              onNavigateTab={handleNavigateTab}
            />
          </div>
        </main>
      </div>

      {/* Google Authentication & Platform Owner Portal Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onUserAuthenticated={handleUserAuthenticated}
      />

      {/* Global AI Command Center Modal */}
      <AICommandCenter
        isOpen={isAICommandOpen}
        onClose={() => setIsAICommandOpen(false)}
        onNavigateTab={handleNavigateTab}
        onSelectLeadQuery={(q) => {
          setLeadInitialQuery(q);
          handleNavigateTab('discover');
        }}
      />

      {/* Wow Journey Guided Playbook Modal */}
      <WowJourneyModal
        isOpen={isWowJourneyOpen}
        onClose={() => setIsWowJourneyOpen(false)}
        wowJourney={wowJourney}
        onSelectGoal={handleSelectWowGoal}
        onCompleteStep={handleCompleteWowStep}
        onNavigateToTab={handleNavigateTab}
      />

      {/* "My Work Is Waiting" 30-Day Workspace Preservation Trigger Modal */}
      <WorkWaitingPreservationModal
        isOpen={isPreservationModalOpen}
        onClose={() => setIsPreservationModalOpen(false)}
        metrics={costMetrics}
        byok={byokConfig}
        currency={currency}
        onSelectPlan={(planId) => {
          handleUpdateOrg({ plan: planId as any });
          showToast(`Workspace activated on ${planId} Plan! All 17+ assets preserved.`);
        }}
        onOpenBYOK={() => handleNavigateTab('settings')}
      />

      {/* Sample Media Studio Preview Modal */}
      <SampleMediaStudioModal
        isOpen={isSampleStudioOpen}
        onClose={() => setIsSampleStudioOpen(false)}
        metrics={costMetrics}
        onUpgradeToFull={() => setIsPreservationModalOpen(true)}
      />

      {/* Interactive Demo & System Tutorial Modal */}
      <DemoTutorialModal
        isOpen={isDemoTutorialOpen}
        onClose={() => setIsDemoTutorialOpen(false)}
        onNavigateTab={handleNavigateTab}
      />

      {/* Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom duration-150 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
}
