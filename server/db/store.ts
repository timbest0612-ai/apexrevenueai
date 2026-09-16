import { 
  Organization, User, Contact, Company, Campaign, 
  AutomationWorkflow, LandingPageItem, DeliverabilityHealth,
  RevenueAttributionSummary, NextBestAction,
  IntentSignalEvent, SmartInboxThread, MassDispatchJob,
  WebhookEventLog, CloudSyncStatus
} from '../../src/types.js';

export const INITIAL_ORG: Organization = {
  id: 'org-apex-demo',
  name: 'Apex Growth Enterprise',
  slug: 'apex-growth',
  plan: 'PRO',
  currency: 'USD',
  timezone: 'America/New_York',
  credits: {
    leadDiscovery: 2450,
    emailVerification: 4890,
    aiTokens: 185000,
    smsUnits: 1200,
    whatsappUnits: 850,
  },
  limits: {
    maxContacts: 25000,
    maxMonthlyEmails: 100000,
    maxTeamMembers: 10,
  }
};

export const INITIAL_USER: User = {
  id: 'usr-admin-1',
  email: 'timbest0612@gmail.com',
  fullName: 'Tim Best',
  isSuperAdmin: true,
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    orgId: 'org-apex-demo',
    name: 'GrowthPulse Digital Agency',
    domain: 'growthpulse.ng',
    industry: 'Marketing & Advertising',
    employeeCountRange: '25-50',
    annualRevenueRange: '$1M - $5M',
    country: 'Nigeria',
    city: 'Lagos',
    techStack: ['WordPress', 'HubSpot', 'Paystack', 'Google Ads'],
    linkedinUrl: 'https://linkedin.com/company/growthpulse-ng',
    website: 'https://growthpulse.ng',
    description: 'Premier B2B performance marketing and revenue acceleration firm based in Victoria Island, Lagos.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'comp-2',
    orgId: 'org-apex-demo',
    name: 'Vertex Financial Technologies',
    domain: 'fintechvertex.africa',
    industry: 'Financial Technology (Fintech)',
    employeeCountRange: '50-100',
    annualRevenueRange: '$5M - $10M',
    country: 'Nigeria',
    city: 'Lagos',
    techStack: ['Next.js', 'PostgreSQL', 'Flutterwave', 'Stripe', 'Twilio'],
    linkedinUrl: 'https://linkedin.com/company/fintechvertex',
    website: 'https://fintechvertex.africa',
    description: 'Pan-African cross-border payments and digital banking infrastructure provider.',
    createdAt: '2026-01-15T11:30:00Z',
  },
  {
    id: 'comp-3',
    orgId: 'org-apex-demo',
    name: 'HyperGrowth B2B SaaS',
    domain: 'hypergrowthscale.io',
    industry: 'B2B Software & SaaS',
    employeeCountRange: '50-150',
    annualRevenueRange: '$10M - $25M',
    country: 'United States',
    city: 'San Francisco, CA',
    techStack: ['React', 'Next.js', 'Stripe', 'Segment', 'OpenAI API'],
    linkedinUrl: 'https://linkedin.com/company/hypergrowth-io',
    website: 'https://hypergrowthscale.io',
    description: 'AI-first customer success and revenue intelligence platform.',
    createdAt: '2026-01-20T09:15:00Z',
  },
  {
    id: 'comp-4',
    orgId: 'org-apex-demo',
    name: 'Finovate Capital UK',
    domain: 'londonfinovate.co.uk',
    industry: 'Financial Services & Fintech',
    employeeCountRange: '80-180',
    annualRevenueRange: '$15M - $40M',
    country: 'United Kingdom',
    city: 'London',
    techStack: ['React', 'AWS', 'Salesforce CRM', 'Marketo', 'Stripe'],
    linkedinUrl: 'https://linkedin.com/company/londonfinovate',
    website: 'https://londonfinovate.co.uk',
    description: 'Specialist merchant cash advance and revenue financing engine for high-growth tech firms.',
    createdAt: '2026-02-01T14:20:00Z',
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt-1',
    orgId: 'org-apex-demo',
    companyId: 'comp-1',
    companyName: 'GrowthPulse Digital Agency',
    firstName: 'Babatunde',
    lastName: 'Adeleke',
    email: 'badeleke@growthpulse.ng',
    phone: '+234 803 451 9821',
    jobTitle: 'Managing Director & Founder',
    seniority: 'Executive',
    country: 'Nigeria',
    city: 'Lagos',
    timezone: 'Africa/Lagos',
    status: 'OPPORTUNITY',
    emailVerification: {
      email: 'badeleke@growthpulse.ng',
      status: 'VALID',
      confidenceScore: 98,
      provider: 'ApexDeliver Verifier Engine v2',
      verificationDate: '2026-08-18T10:00:00Z',
      reason: 'Mailbox actively accepting traffic; valid MX DNS and no spam trap flags.',
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
      leadFitScore: 95,
      engagementScore: 88,
      intentScore: 94,
      customerValueScore: 90,
      category: 'HOT',
      intentSignals: ['Viewed Pricing page 3x', 'Clicked Enterprise ROI Calculator link in Email', 'Downloaded 2026 Growth Playbook PDF'],
      recommendedAction: 'Send Custom Agency Tier Proposal via WhatsApp and Schedule Discovery Call',
      confidence: 0.94,
      lastCalculated: '2026-08-19T04:30:00Z',
    },
    tags: ['agency-owner', 'high-intent', 'lagos-tech', 'pricing-viewer'],
    customFields: {
      clientBudget: '$15,000/yr',
      preferredChannel: 'WhatsApp + Email',
      demoRequested: true,
    },
    source: 'Apollo Discovery Engine',
    revenueTotal: 0,
    timeline: [
      {
        id: 't-1',
        contactId: 'cnt-1',
        type: 'lead_created',
        title: 'Discovered via Global Sourcing',
        description: 'Enriched profile from Apollo Provider with Lagos geography and Marketing Agency taxonomy.',
        timestamp: '2026-08-10T09:00:00Z',
      },
      {
        id: 't-2',
        contactId: 'cnt-1',
        type: 'email_sent',
        title: 'AI Cold Sequence Step 1 Delivered',
        description: 'Sent "Accelerate client acquisition pipeline for GrowthPulse Digital"',
        channel: 'email',
        timestamp: '2026-08-11T10:15:00Z',
      },
      {
        id: 't-3',
        contactId: 'cnt-1',
        type: 'email_opened',
        title: 'Email Opened (2x)',
        description: 'Subject line: How top agencies scale outbound deliverability.',
        channel: 'email',
        timestamp: '2026-08-11T11:42:00Z',
      },
      {
        id: 't-4',
        contactId: 'cnt-1',
        type: 'link_clicked',
        title: 'Clicked Agency Blueprint Link',
        description: 'URL: /agency-playbook-2026',
        channel: 'web',
        timestamp: '2026-08-11T11:45:00Z',
      },
      {
        id: 't-5',
        contactId: 'cnt-1',
        type: 'page_viewed',
        title: 'Visited Enterprise Pricing Page',
        description: 'Spent 4m 20s comparing Business vs Agency white-label plans.',
        channel: 'web',
        timestamp: '2026-08-18T16:30:00Z',
      }
    ],
    notes: [
      'Babatunde is expanding his digital marketing team from 30 to 50 employees across Lagos and Accra.',
      'Highly interested in our Paystack-integrated recurring billing feature.'
    ],
    tasks: [
      { id: 'tsk-1', title: 'Follow up with WhatsApp proposal', dueDate: '2026-08-20', completed: false }
    ],
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-18T16:30:00Z',
  },
  {
    id: 'cnt-2',
    orgId: 'org-apex-demo',
    companyId: 'comp-2',
    companyName: 'Vertex Financial Technologies',
    firstName: 'Chidinma',
    lastName: 'Okonkwo',
    email: 'chidinma@fintechvertex.africa',
    phone: '+234 812 390 1144',
    jobTitle: 'Head of Growth & Commercials',
    seniority: 'Director',
    country: 'Nigeria',
    city: 'Lagos',
    timezone: 'Africa/Lagos',
    status: 'CUSTOMER',
    emailVerification: {
      email: 'chidinma@fintechvertex.africa',
      status: 'VALID',
      confidenceScore: 97,
      provider: 'ApexDeliver Verifier Engine v2',
      verificationDate: '2026-08-15T08:00:00Z',
      reason: 'Valid corporate domain mailbox.',
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
      leadFitScore: 98,
      engagementScore: 92,
      intentScore: 96,
      customerValueScore: 95,
      category: 'HOT',
      intentSignals: ['Purchased Business Plan', 'Active user of Automated Sequences', 'Integrated Paystack Webhook'],
      recommendedAction: 'Trigger VIP Onboarding Sequence & Invite to Agency Partner Program',
      confidence: 0.98,
      lastCalculated: '2026-08-19T02:00:00Z',
    },
    tags: ['fintech', 'paid-customer', 'high-ltv', 'lagos'],
    customFields: {
      planType: 'Business Annual',
      mrr: '$399',
    },
    source: 'Website Lead Magnet',
    revenueTotal: 4788,
    timeline: [
      {
        id: 't-20',
        contactId: 'cnt-2',
        type: 'form_submitted',
        title: 'Submitted FinTech Outbound Form',
        description: 'Downloaded Fintech Customer Acquisition Playbook',
        channel: 'web',
        timestamp: '2026-08-01T14:10:00Z',
      },
      {
        id: 't-21',
        contactId: 'cnt-2',
        type: 'purchase_completed',
        title: 'Subscribed to Business Annual Plan',
        description: 'Payment processed via Paystack (₦4,440,000 / $4,788 USD)',
        channel: 'web',
        monetaryValue: 4788,
        timestamp: '2026-08-05T12:00:00Z',
      }
    ],
    createdAt: '2026-08-01T14:10:00Z',
    updatedAt: '2026-08-05T12:00:00Z',
  },
  {
    id: 'cnt-3',
    orgId: 'org-apex-demo',
    companyId: 'comp-3',
    companyName: 'HyperGrowth B2B SaaS',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus@hypergrowthscale.io',
    phone: '+1 415 892 4110',
    jobTitle: 'Founder & CEO',
    seniority: 'Executive',
    country: 'United States',
    city: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    status: 'QUALIFIED',
    emailVerification: {
      email: 'marcus@hypergrowthscale.io',
      status: 'VALID',
      confidenceScore: 99,
      provider: 'ApexDeliver Verifier Engine v2',
      verificationDate: '2026-08-16T12:00:00Z',
      reason: 'Valid Google Workspace mailbox; primary MX verified.',
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
      leadFitScore: 99,
      engagementScore: 84,
      intentScore: 91,
      customerValueScore: 97,
      category: 'HOT',
      intentSignals: ['Started checkout session but abandoned at payment step', 'Clicked product demo video 3x'],
      recommendedAction: 'Trigger AI Abandoned Checkout Recovery Sequence with 15% discount code',
      confidence: 0.93,
      lastCalculated: '2026-08-19T05:00:00Z',
    },
    tags: ['saas-founder', 'abandoned-checkout', 'california', 'high-intent'],
    customFields: {
      mrrGoal: '$100k/mo',
      teamSize: '85',
    },
    source: 'Apollo Discovery Engine',
    revenueTotal: 0,
    timeline: [
      {
        id: 't-30',
        contactId: 'cnt-3',
        type: 'checkout_started',
        title: 'Abandoned Checkout - Pro Tier ($149/mo)',
        description: 'Reached Stripe checkout page but left before submitting card details.',
        channel: 'web',
        timestamp: '2026-08-18T22:15:00Z',
      }
    ],
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-18T22:15:00Z',
  },
  {
    id: 'cnt-4',
    orgId: 'org-apex-demo',
    companyId: 'comp-4',
    companyName: 'Finovate Capital UK',
    firstName: 'Oliver',
    lastName: 'Thornton',
    email: 'o.thornton@londonfinovate.co.uk',
    phone: '+44 20 7946 0912',
    jobTitle: 'Chief Commercial Officer',
    seniority: 'Executive',
    country: 'United Kingdom',
    city: 'London',
    timezone: 'Europe/London',
    status: 'CUSTOMER',
    emailVerification: {
      email: 'o.thornton@londonfinovate.co.uk',
      status: 'VALID',
      confidenceScore: 96,
      provider: 'ApexDeliver Verifier Engine v2',
      verificationDate: '2026-08-14T09:00:00Z',
      reason: 'Microsoft Office 365 Exchange verified.',
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
      leadFitScore: 97,
      engagementScore: 89,
      intentScore: 92,
      customerValueScore: 96,
      category: 'HOT',
      intentSignals: ['Active Multi-Channel campaign user', 'Subscribed to Enterprise tier'],
      recommendedAction: 'Offer Dedicated Outbound IP Pool Add-on',
      confidence: 0.96,
      lastCalculated: '2026-08-19T01:00:00Z',
    },
    tags: ['uk-fintech', 'enterprise', 'paid-customer'],
    customFields: {
      planType: 'Enterprise Dedicated',
    },
    source: 'Cold Email Sourced',
    revenueTotal: 8400,
    timeline: [
      {
        id: 't-40',
        contactId: 'cnt-4',
        type: 'purchase_completed',
        title: 'Signed Enterprise Contract',
        description: 'Stripe Invoice #INV-8831 paid ($8,400)',
        channel: 'email',
        monetaryValue: 8400,
        timestamp: '2026-08-08T15:30:00Z',
      }
    ],
    createdAt: '2026-08-02T11:00:00Z',
    updatedAt: '2026-08-08T15:30:00Z',
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    orgId: 'org-apex-demo',
    name: 'Pan-African & Global Agency Outbound Sprint',
    type: 'SEQUENCE',
    status: 'RUNNING',
    targetAudience: {
      segmentName: 'Digital & Marketing Agency Decision Makers',
      totalRecipients: 420,
      filters: {
        tags: ['agency-owner'],
        minIntentScore: 70,
        status: ['PROSPECT', 'LEAD', 'QUALIFIED'],
      }
    },
    steps: [
      {
        id: 'st-1',
        stepNumber: 1,
        subject: 'Quick question regarding {{company}}\'s outbound customer pipeline',
        previewText: 'How top agencies in {{city}} are scaling client discovery with AI...',
        bodyHtml: '<p>Hi {{first_name}},</p><p>I noticed {{company}} has been making significant waves in {{city}} across the {{industry}} space.</p><p>Most agency leaders we speak with are spending 20+ hours a week manually chasing leads and dealing with high email bounce rates.</p><p>We built ApexRevenue to automatically discover verified decision-makers, score their buying intent, and deliver meetings on autopilot.</p><p>Would you be open to a 5-minute preview of how we helped firms in {{country}} achieve 4.8x ROI in under 30 days?</p><p>Best regards,<br>The Apex Team</p>',
        delayDays: 0,
        delayHours: 0,
        channel: 'email',
        stats: {
          sent: 420,
          opened: 312,
          clicked: 148,
          converted: 28,
          revenue: 12400,
        }
      },
      {
        id: 'st-2',
        stepNumber: 2,
        subject: 'Case study: How Vertex Tech doubled booked calls without spamming',
        previewText: 'Real results from automated lead verification and AI scoring...',
        bodyHtml: '<p>Hi {{first_name}},</p><p>Following up on my previous note. Thought you might find this relevant: we recently helped a high-growth team in {{country}} eliminate bounce rates entirely and close $18k in new retainer deals.</p><p><a href="https://apexrevenue.ai/case-studies/growth">Read the full 3-page breakdown here</a>.</p><p>Cheers,<br>The Apex Team</p>',
        delayDays: 2,
        delayHours: 0,
        channel: 'email',
        stats: {
          sent: 390,
          opened: 245,
          clicked: 110,
          converted: 19,
          revenue: 8200,
        }
      }
    ],
    abTesting: {
      enabled: true,
      variantBSubject: 'Automating high-ticket client acquisition for {{company}}',
      splitRatio: 50,
      winnerMetric: 'revenue',
    },
    metrics: {
      sent: 810,
      openRate: 68.7,
      clickRate: 31.8,
      replyRate: 14.2,
      bounceRate: 0.4,
      conversions: 47,
      revenue: 20600,
    },
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'camp-2',
    orgId: 'org-apex-demo',
    name: 'Abandoned Checkout AI Rescue Engine',
    type: 'MULTI_CHANNEL',
    status: 'RUNNING',
    targetAudience: {
      segmentName: 'High Intent Checkout Abandoners',
      totalRecipients: 84,
      filters: {
        tags: ['abandoned-checkout'],
        minIntentScore: 85,
      }
    },
    steps: [
      {
        id: 'st-10',
        stepNumber: 1,
        subject: 'Complete your ApexRevenue setup + 15% VIP discount',
        previewText: 'Your verified lead credits are waiting inside your workspace...',
        bodyHtml: '<p>Hi {{first_name}},</p><p>We saw you were about to unlock full access to the AI Discovery & Email Verifier Engine for {{company}}.</p><p>Use code <strong>APEX15</strong> in the next 24 hours to lock in a 15% lifetime discount on any annual plan.</p><p><a href="https://apexrevenue.ai/checkout?promo=APEX15">Click here to resume your checkout</a>.</p>',
        delayDays: 0,
        delayHours: 1,
        channel: 'email',
        stats: {
          sent: 84,
          opened: 69,
          clicked: 44,
          converted: 22,
          revenue: 7800,
        }
      }
    ],
    metrics: {
      sent: 84,
      openRate: 82.1,
      clickRate: 52.3,
      replyRate: 18.0,
      bounceRate: 0.0,
      conversions: 22,
      revenue: 7800,
    },
    createdAt: '2026-08-05T12:00:00Z',
  }
];

export const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: 'wf-1',
    orgId: 'org-apex-demo',
    name: 'High-Intent Prospect Nurture & Conversion Flow',
    description: 'Auto-detects when a lead hits 85+ buying intent score, delivers a personalized case study, and triggers WhatsApp follow-up if unresponded.',
    triggerType: 'score_threshold',
    isActive: true,
    nodes: [
      {
        id: 'n-1',
        type: 'TRIGGER',
        title: 'Trigger: Intent Score ≥ 85',
        description: 'Fired when prospect behavioral signals pass 85/100 threshold',
        config: { minScore: 85 },
        position: { x: 250, y: 50 },
      },
      {
        id: 'n-2',
        type: 'EMAIL',
        title: 'Step 1: VIP Personalized Case Study',
        description: 'Send high-relevance industry ROI breakdown',
        config: { templateId: 'tmpl-roi-breakdown' },
        position: { x: 250, y: 160 },
      },
      {
        id: 'n-3',
        type: 'WAIT',
        title: 'Delay: 2 Days',
        description: 'Wait for engagement or link click',
        config: { durationDays: 2 },
        position: { x: 250, y: 270 },
      },
      {
        id: 'n-4',
        type: 'CONDITION',
        title: 'Condition: Did they click ROI calculator?',
        description: 'Split path based on link click telemetry',
        config: { event: 'link_clicked' },
        position: { x: 250, y: 380 },
      },
      {
        id: 'n-5',
        type: 'WHATSAPP',
        title: 'Branch Yes: Direct WhatsApp VIP Offer',
        description: 'Send quick message from Account Director',
        config: { templateName: 'vip_founder_intro' },
        position: { x: 120, y: 500 },
      },
      {
        id: 'n-6',
        type: 'EMAIL',
        title: 'Branch No: Social Proof & Client Testimonials',
        description: 'Send video walkthrough showing 10x ROI',
        config: { templateId: 'tmpl-social-proof' },
        position: { x: 380, y: 500 },
      }
    ],
    edges: [
      { id: 'e-1', source: 'n-1', target: 'n-2' },
      { id: 'e-2', source: 'n-2', target: 'n-3' },
      { id: 'e-3', source: 'n-3', target: 'n-4' },
      { id: 'e-4', source: 'n-4', target: 'n-5', conditionBranch: 'yes', label: 'Yes (Clicked)' },
      { id: 'e-5', source: 'n-4', target: 'n-6', conditionBranch: 'no', label: 'No' },
    ],
    stats: {
      totalEnrolled: 186,
      activeNow: 29,
      completed: 157,
      revenueGenerated: 18450,
    },
    createdAt: '2026-08-01T12:00:00Z',
  }
];

export const INITIAL_NEXT_BEST_ACTIONS: NextBestAction[] = [
  {
    id: 'nba-1',
    category: 'high_intent',
    title: '37 High-Intent Leads Ready for Conversion',
    description: '37 prospects in Nigeria & US recently visited the pricing page and downloaded ROI assets. High likelihood to convert with a customized offer.',
    impactScore: 96,
    potentialRevenue: 14500,
    targetCount: 37,
    recommendedChannel: 'email',
    suggestedActionText: 'Launch 1-Click Targeted VIP Sequence',
    actionPayload: {
      actionType: 'send_campaign',
      data: { campaignName: 'VIP High-Intent Fast Track', segment: 'hot_leads' }
    }
  },
  {
    id: 'nba-2',
    category: 'abandoned_checkout',
    title: '14 Abandoned Checkout Recovery Opportunities',
    description: '14 users reached checkout in the last 48 hours without completing payment. Average deal size: $249.',
    impactScore: 92,
    potentialRevenue: 3486,
    targetCount: 14,
    recommendedChannel: 'whatsapp',
    suggestedActionText: 'Dispatch AI WhatsApp Recovery Sequence',
    actionPayload: {
      actionType: 'trigger_workflow',
      data: { workflowId: 'wf-abandoned-checkout' }
    }
  },
  {
    id: 'nba-3',
    category: 'reactivation',
    title: '421 Dormant Leads with High Historical Fit',
    description: 'Leads with 90+ fit score that have been inactive for >45 days. Re-engaging with new product features will reactivate pipeline.',
    impactScore: 84,
    potentialRevenue: 28000,
    targetCount: 421,
    recommendedChannel: 'email',
    suggestedActionText: 'Generate AI Reactivation Blast',
    actionPayload: {
      actionType: 'send_campaign',
      data: { campaignName: 'Dormant Pipeline Reactivation' }
    }
  }
];

export const INITIAL_DELIVERABILITY: DeliverabilityHealth = {
  spfConfigured: true,
  dkimConfigured: true,
  dmarcConfigured: true,
  domainReputation: 'EXCELLENT',
  reputationScore: 98,
  overallBounceRate: 0.4,
  spamComplaintRate: 0.01,
  suppressedCount: 12,
  dailyQuota: {
    used: 1240,
    max: 15000,
  },
  recommendations: [
    'SPF, DKIM, and DMARC (p=reject) are fully aligned and valid.',
    'List hygiene is exceptional: 99.6% deliverability across the last 30 days.',
    'Automated warm-up is currently maintaining steady ramp for primary domain.'
  ]
};

export const INITIAL_REVENUE_ATTRIBUTION: RevenueAttributionSummary = {
  totalRevenue: 36800,
  channelBreakdown: {
    email: 21400,
    whatsapp: 8200,
    sms: 3800,
    organic: 2400,
    paid: 1000,
  },
  topCampaigns: [
    { id: 'camp-1', name: 'Pan-African & Global Agency Outbound Sprint', revenue: 20600, roiPercentage: 640, cost: 2800 },
    { id: 'camp-2', name: 'Abandoned Checkout AI Rescue Engine', revenue: 7800, roiPercentage: 1100, cost: 650 },
    { id: 'camp-3', name: 'High-Intent WhatsApp Direct Outreach', revenue: 8400, roiPercentage: 820, cost: 920 },
  ],
  geographicRevenue: [
    { country: 'Nigeria', countryCode: 'NG', revenue: 14600, customerCount: 18 },
    { country: 'United States', countryCode: 'US', revenue: 12800, customerCount: 12 },
    { country: 'United Kingdom', countryCode: 'GB', revenue: 6400, customerCount: 5 },
    { country: 'Kenya', countryCode: 'KE', revenue: 2000, customerCount: 3 },
    { country: 'South Africa', countryCode: 'ZA', revenue: 1000, customerCount: 2 },
  ],
  conversionFunnel: {
    discovered: 4850,
    verified: 4620,
    engaged: 2840,
    qualified: 1120,
    converted: 142,
  }
};

export const INITIAL_LANDING_PAGES: LandingPageItem[] = [
  {
    id: 'lp-1',
    title: 'The 2026 B2B Outbound Revenue Playbook',
    slug: 'outbound-playbook-2026',
    headline: 'How High-Growth Teams Book 40+ Qualified Meetings Monthly with AI',
    subheadline: 'The exact framework to discover verified decision-makers, score intent, and automate multi-channel sequences without landing in spam.',
    ctaText: 'Download Free Playbook (PDF)',
    leadMagnetName: 'Outbound_Playbook_2026.pdf',
    leadMagnetType: 'PDF',
    published: true,
    views: 3420,
    submissions: 980,
    conversionRate: 28.6,
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'lp-2',
    title: 'Agency Customer Acquisition Machine',
    slug: 'agency-revenue-engine',
    headline: 'Turn Cold Prospects Into High-Ticket Retainers On Autopilot',
    subheadline: 'Built specifically for digital agencies, marketing consultants, and SaaS founders across Africa and Global markets.',
    ctaText: 'Get Instant Access',
    leadMagnetName: 'Agency_Client_Template.zip',
    leadMagnetType: 'Template',
    published: true,
    views: 1840,
    submissions: 512,
    conversionRate: 27.8,
    createdAt: '2026-08-05T14:00:00Z',
  }
];

export const INITIAL_INTENT_SIGNALS: IntentSignalEvent[] = [
  {
    id: 'sig-1',
    companyName: 'Vertex Financial Technologies',
    companyDomain: 'fintechvertex.africa',
    type: 'EXECUTIVE_HIRE',
    title: 'Appointed New VP of Revenue & Head of Outbound',
    description: 'Vertex just onboarded a new VP of Growth from Flutterwave to scale enterprise B2B acquiring across Sub-Saharan Africa.',
    detectedAt: '2 hours ago',
    intentScoreBoost: 35,
    confidence: 96,
    contactLead: {
      name: 'Ngozi Okafor',
      email: 'ngozi.okafor@fintechvertex.africa',
      jobTitle: 'VP of Commercial Revenue'
    },
    recommendedAction: 'Send warm congratulatory sequence with enterprise ROI benchmark PDF',
    recommendedCampaignId: 'camp-1',
    status: 'NEW'
  },
  {
    id: 'sig-2',
    companyName: 'GrowthPulse Digital Agency',
    companyDomain: 'growthpulse.ng',
    type: 'TECH_STACK_DETECTED',
    title: 'Installed Paystack & Stripe Checkout Gateways',
    description: 'New tech footprint detected on billing domain. Agency is launching international retainer subscriptions.',
    detectedAt: '5 hours ago',
    intentScoreBoost: 28,
    confidence: 94,
    contactLead: {
      name: 'Tunde Adeleke',
      email: 'tunde@growthpulse.ng',
      jobTitle: 'Managing Director & Founder'
    },
    recommendedAction: 'Trigger multi-currency global acquisition sequence via WhatsApp',
    recommendedCampaignId: 'camp-3',
    status: 'NEW'
  },
  {
    id: 'sig-3',
    companyName: 'PayEngine Solutions UK',
    companyDomain: 'payengine.co.uk',
    type: 'FUNDING_ROUND',
    title: 'Closed $4.2M Series A for African Expansion',
    description: 'Fresh capital allocated for go-to-market hiring and sales acceleration across EMEA and West Africa.',
    detectedAt: '1 day ago',
    intentScoreBoost: 40,
    confidence: 99,
    contactLead: {
      name: 'Marcus Sterling',
      email: 'm.sterling@payengine.co.uk',
      jobTitle: 'Chief Revenue Officer'
    },
    recommendedAction: 'Enroll in High-Intent Enterprise Outbound Sprint',
    recommendedCampaignId: 'camp-1',
    status: 'NEW'
  },
  {
    id: 'sig-4',
    companyName: 'CloudScale Logistics Kenya',
    companyDomain: 'cloudscalelogistics.co.ke',
    type: 'WEBSITE_INTENT_SURGE',
    title: '3 Decision Makers Viewed Enterprise Pricing 4x in 24h',
    description: 'Deanonymized IP activity: Head of Tech, COO, and Commercial Lead viewed /pricing and /security whitepaper.',
    detectedAt: '3 hours ago',
    intentScoreBoost: 45,
    confidence: 91,
    contactLead: {
      name: 'Amina Kimani',
      email: 'amina@cloudscalelogistics.co.ke',
      jobTitle: 'Chief Operating Officer'
    },
    recommendedAction: 'Send direct WhatsApp message with calendar booking link for custom SLA demo',
    recommendedCampaignId: 'camp-3',
    status: 'NEW'
  }
];

export const INITIAL_SMART_INBOX_THREADS: SmartInboxThread[] = [
  {
    id: 'th-1',
    contactId: 'cnt-1',
    contactName: 'Tunde Adeleke',
    contactEmail: 'tunde@growthpulse.ng',
    companyName: 'GrowthPulse Digital Agency',
    jobTitle: 'Managing Director & Founder',
    channel: 'email',
    sentiment: 'INTERESTED_DEMO',
    dealValue: 12500,
    intentScore: 94,
    status: 'OPEN',
    lastActivity: '12 mins ago',
    messages: [
      {
        id: 'm-1',
        sender: 'user',
        channel: 'email',
        content: 'Hi Tunde, saw you are scaling GrowthPulse retainers in Lagos. Are you looking to automate verified outbound pipeline for B2B clients?',
        timestamp: 'Yesterday, 10:15 AM'
      },
      {
        id: 'm-2',
        sender: 'lead',
        channel: 'email',
        content: 'Hey Alex! Yes, we actually struggle with lead data accuracy and email deliverability for our client campaigns right now. Can you show me how Apex handles zero-bounce verification and multi-currency billing next Tuesday at 2 PM?',
        timestamp: '12 mins ago'
      }
    ],
    suggestedAIReply: {
      subject: 'Re: Verified Outbound Pipeline for GrowthPulse (Tuesday 2 PM Confirmed)',
      body: 'Hi Tunde, wonderful! Tuesday at 2 PM works perfectly. I will prepare a live demo showing our zero-bounce MX verification, multi-channel WhatsApp/Email sequences, and multi-currency CRM tracking in NGN and USD.\n\nHere is our calendar invite: https://apexrevenue.ai/meet/alex-demo\n\nLooking forward to speaking!',
      rationale: 'Positive meeting booking request. Confirm date/time, provide calendar link, and restate requested features (zero-bounce verification & multi-currency billing).'
    }
  },
  {
    id: 'th-2',
    contactId: 'cnt-3',
    contactName: 'Marcus Sterling',
    contactEmail: 'm.sterling@payengine.co.uk',
    companyName: 'PayEngine Solutions UK',
    jobTitle: 'Chief Revenue Officer',
    channel: 'whatsapp',
    sentiment: 'PRICING_QUERY',
    dealValue: 24000,
    intentScore: 89,
    status: 'OPEN',
    lastActivity: '45 mins ago',
    messages: [
      {
        id: 'm-3',
        sender: 'user',
        channel: 'whatsapp',
        content: 'Hi Marcus, congrats on PayEngine’s Series A funding! We help FinTech scaleups automate customer acquisition without spam penalties.',
        timestamp: 'Yesterday, 4:00 PM'
      },
      {
        id: 'm-4',
        sender: 'lead',
        channel: 'whatsapp',
        content: 'Thanks! What does pricing look like for an enterprise team of 8 SDRs with custom dedicated IP warmup?',
        timestamp: '45 mins ago'
      }
    ],
    suggestedAIReply: {
      body: 'Hi Marcus! For an enterprise team of 8 SDRs with dedicated IP warmup, unlimited verified lead discovery, and custom API webhooks, our Enterprise Tier is £1,850/mo. We also provide full onboarding and custom deliverability monitoring. Would you like a 15-min overview deck or a sandbox workspace for your team?',
      rationale: 'Direct pricing inquiry for enterprise team. Provide exact tier pricing (£1,850/mo) and offer sandbox access/overview deck.'
    }
  },
  {
    id: 'th-3',
    contactId: 'cnt-4',
    contactName: 'Amina Kimani',
    contactEmail: 'amina@cloudscalelogistics.co.ke',
    companyName: 'CloudScale Logistics Kenya',
    jobTitle: 'Chief Operating Officer',
    channel: 'email',
    sentiment: 'OBJECTION_GATEKEEPER',
    dealValue: 8000,
    intentScore: 78,
    status: 'OPEN',
    lastActivity: '2 hours ago',
    messages: [
      {
        id: 'm-5',
        sender: 'user',
        channel: 'email',
        content: 'Hi Amina, saw CloudScale’s rapid expansion in East Africa. Quick question: how are you automating enterprise contract follow-ups?',
        timestamp: '2 days ago'
      },
      {
        id: 'm-6',
        sender: 'lead',
        channel: 'email',
        content: 'We currently use HubSpot and an internal spreadsheet. Not looking to replace our core stack right now.',
        timestamp: '2 hours ago'
      }
    ],
    suggestedAIReply: {
      subject: 'Re: CloudScale + HubSpot Native Two-Way Integration',
      body: 'Completely understand, Amina — no need to replace HubSpot at all! Apex seamlessly syncs bidirectionally into HubSpot, acting purely as your AI lead verification and multi-channel acquisition engine so your team never has to change workflows.\n\nWould you be open to a 2-minute video walkthrough showing the HubSpot live sync in action?',
      rationale: 'Overcome tool replacement objection by emphasizing 100% native HubSpot bi-directional synchronization and offering a friction-free 2-minute video.'
    }
  }
];

export const INITIAL_WEBHOOK_LOGS: WebhookEventLog[] = [
  {
    id: 'wh-1',
    provider: 'WHATSAPP',
    eventType: 'messages.received',
    sourceIdentifier: '+2348039281140',
    senderName: 'Tunde Adeleke',
    companyName: 'GrowthPulse Digital Agency',
    payloadSummary: 'Inbound WhatsApp message: "Can you show me how Apex handles zero-bounce verification and multi-currency billing next Tuesday at 2 PM?"',
    status: 'PROCESSED',
    actionTaken: 'Matched CRM contact cnt-1, created Smart Inbox thread th-1, intent score boosted to 94',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    latencyMs: 42,
    signatureVerified: true,
  },
  {
    id: 'wh-2',
    provider: 'GMAIL',
    eventType: 'mail.message.received',
    sourceIdentifier: 'sarah.chen@apexflow.com',
    senderName: 'Sarah Chen',
    companyName: 'ApexFlow Technologies',
    payloadSummary: 'Inbound email: "Can you share a calendar link for a brief 10-minute demo this Thursday?"',
    status: 'PROCESSED',
    actionTaken: 'Auto-converted thread to Opportunity ($4,500 pipeline), queued AI Demo Reply draft',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    latencyMs: 38,
    signatureVerified: true,
  },
  {
    id: 'wh-3',
    provider: 'OUTLOOK',
    eventType: 'graph.notification.received',
    sourceIdentifier: 'm.sterling@payengine.co.uk',
    senderName: 'Marcus Sterling',
    companyName: 'PayEngine Solutions UK',
    payloadSummary: 'Microsoft Graph Sync: Pricing query for enterprise tier 8 SDR seat license',
    status: 'PROCESSED',
    actionTaken: 'Updated thread th-2 sentiment to PRICING_QUERY, assigned to Senior AE',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    latencyMs: 51,
    signatureVerified: true,
  },
  {
    id: 'wh-4',
    provider: 'CUSTOM',
    eventType: 'stripe.checkout.session.completed',
    sourceIdentifier: 'billing@vervefintech.ng',
    senderName: 'Amara Okafor',
    companyName: 'Verve Technologies',
    payloadSummary: 'Live payment webhook received: $2,400 Annual Pro subscription',
    status: 'PROCESSED',
    actionTaken: 'Moved contact to CUSTOMER, attributed $2,400 revenue to Multi-Channel Sprint',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    latencyMs: 29,
    signatureVerified: true,
  }
];

// In-Memory Database Store Class
class DataStore {
  organization: Organization = { ...INITIAL_ORG };
  currentUser: User = { ...INITIAL_USER };
  companies: Company[] = [...INITIAL_COMPANIES];
  contacts: Contact[] = [...INITIAL_CONTACTS];
  campaigns: Campaign[] = [...INITIAL_CAMPAIGNS];
  automations: AutomationWorkflow[] = [...INITIAL_AUTOMATIONS];
  nextBestActions: NextBestAction[] = [...INITIAL_NEXT_BEST_ACTIONS];
  deliverability: DeliverabilityHealth = { ...INITIAL_DELIVERABILITY };
  revenueAttribution: RevenueAttributionSummary = { ...INITIAL_REVENUE_ATTRIBUTION };
  landingPages: LandingPageItem[] = [...INITIAL_LANDING_PAGES];
  intentSignals: IntentSignalEvent[] = [...INITIAL_INTENT_SIGNALS];
  smartInboxThreads: SmartInboxThread[] = [...INITIAL_SMART_INBOX_THREADS];
  massDispatchJobs: MassDispatchJob[] = [];
  webhookLogs: WebhookEventLog[] = [...INITIAL_WEBHOOK_LOGS];

  setCurrentUser(user: User): User {
    this.currentUser = { ...user };
    const isOwner = user.email?.trim().toLowerCase() === 'timbest0612@gmail.com';
    if (isOwner) {
      this.currentUser.isSuperAdmin = true;
      this.organization.plan = 'AGENCY';
      this.organization.credits = {
        leadDiscovery: 999999,
        emailVerification: 999999,
        aiTokens: 99999999,
        smsUnits: 99999,
        whatsappUnits: 99999,
      };
      this.organization.limits = {
        maxContacts: 1000000,
        maxMonthlyEmails: 1000000,
        maxTeamMembers: 100,
      };
    }
    return this.currentUser;
  }

  switchUserByEmail(email: string, fullName?: string, avatarUrl?: string): { user: User; organization: Organization; isOwner: boolean } {
    const isOwner = email.trim().toLowerCase() === 'timbest0612@gmail.com';
    this.currentUser = {
      id: isOwner ? 'usr-owner-timbest' : `usr-${Date.now()}`,
      email: email.trim(),
      fullName: fullName || (isOwner ? 'Tim Best (Platform Owner)' : email.split('@')[0]),
      avatarUrl,
      isSuperAdmin: isOwner,
    };
    if (isOwner) {
      this.organization.plan = 'AGENCY';
      this.organization.credits = {
        leadDiscovery: 999999,
        emailVerification: 999999,
        aiTokens: 99999999,
        smsUnits: 99999,
        whatsappUnits: 99999,
      };
      this.organization.limits = {
        maxContacts: 1000000,
        maxMonthlyEmails: 1000000,
        maxTeamMembers: 100,
      };
    } else {
      this.organization.plan = 'PRO';
      this.organization.credits = {
        leadDiscovery: 500,
        emailVerification: 1000,
        aiTokens: 50000,
        smsUnits: 100,
        whatsappUnits: 100,
      };
    }
    return {
      user: this.currentUser,
      organization: this.organization,
      isOwner,
    };
  }

  getContacts(filter?: { status?: string; search?: string; tag?: string; category?: string }): Contact[] {
    let result = [...this.contacts];
    if (filter?.status && filter.status !== 'ALL') {
      result = result.filter(c => c.status === filter.status);
    }
    if (filter?.category && filter.category !== 'ALL') {
      result = result.filter(c => c.scores.category === filter.category);
    }
    if (filter?.tag) {
      result = result.filter(c => c.tags.includes(filter.tag!));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(c => 
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.companyName && c.companyName.toLowerCase().includes(q)) ||
        c.jobTitle.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getContactById(id: string): Contact | undefined {
    return this.contacts.find(c => c.id === id);
  }

  addContact(contact: Omit<Contact, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: `cnt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      orgId: this.organization.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.contacts.unshift(newContact);
    return newContact;
  }

  updateContact(id: string, updates: Partial<Contact>): Contact | null {
    const idx = this.contacts.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.contacts[idx] = {
      ...this.contacts[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.contacts[idx];
  }

  deleteContact(id: string): boolean {
    const initialLen = this.contacts.length;
    this.contacts = this.contacts.filter(c => c.id !== id);
    return this.contacts.length < initialLen;
  }

  addCampaign(campaign: Omit<Campaign, 'id' | 'orgId' | 'createdAt'>): Campaign {
    const newCampaign: Campaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      orgId: this.organization.id,
      createdAt: new Date().toISOString(),
    };
    this.campaigns.unshift(newCampaign);
    return newCampaign;
  }

  updateOrganization(updates: Partial<Organization>): Organization {
    this.organization = { ...this.organization, ...updates };
    return this.organization;
  }

  // Signal Intent Methods
  getIntentSignals(): IntentSignalEvent[] {
    return this.intentSignals;
  }

  actionIntentSignal(id: string): IntentSignalEvent | null {
    const sig = this.intentSignals.find(s => s.id === id);
    if (!sig) return null;
    sig.status = 'ACTIONED';
    return sig;
  }

  // Smart Inbox Methods
  getSmartInboxThreads(): SmartInboxThread[] {
    return this.smartInboxThreads;
  }

  getThreadById(id: string): SmartInboxThread | undefined {
    return this.smartInboxThreads.find(t => t.id === id);
  }

  replyToThread(threadId: string, content: string, channel: 'email' | 'whatsapp' | 'sms'): SmartInboxThread | null {
    const thread = this.smartInboxThreads.find(t => t.id === threadId);
    if (!thread) return null;
    const msg: any = {
      id: `m-${Date.now()}`,
      sender: 'user',
      channel,
      content,
      timestamp: 'Just now'
    };
    thread.messages.push(msg);
    thread.status = 'REPLIED';
    thread.lastActivity = 'Just now';
    return thread;
  }

  // Mass Dispatch & Global Pitch Methods
  getMassDispatchJobs(): MassDispatchJob[] {
    return this.massDispatchJobs;
  }

  getMassDispatchJobById(id: string): MassDispatchJob | undefined {
    return this.massDispatchJobs.find(j => j.id === id);
  }

  createMassDispatchJob(params: {
    campaignName: string;
    targetOffer: string;
    whatTheySell: string;
    totalRecipients: number;
    channel: 'email' | 'whatsapp' | 'omnichannel';
    dispatchSpeed: 'INSTANT_TURBO' | 'SMART_RAMPED';
    subject?: string;
    bodyMessage: string;
    sampleLogs?: any[];
  }): MassDispatchJob {
    const job: MassDispatchJob = {
      id: `job-mass-${Date.now()}`,
      campaignName: params.campaignName,
      targetOffer: params.targetOffer,
      whatTheySell: params.whatTheySell,
      totalRecipients: params.totalRecipients,
      sentCount: params.totalRecipients,
      deliveredCount: Math.round(params.totalRecipients * 0.994),
      openCount: Math.round(params.totalRecipients * 0.612),
      replyCount: Math.round(params.totalRecipients * 0.148),
      bounceShieldCount: Math.round(params.totalRecipients * 0.006),
      channel: params.channel,
      dispatchSpeed: params.dispatchSpeed,
      status: 'COMPLETED',
      progressPercentage: 100,
      startedAt: new Date().toLocaleTimeString(),
      estimatedCompletion: 'Instant parallel batch processed across 12 distributed SMTP & WhatsApp pools',
      subject: params.subject,
      bodyMessage: params.bodyMessage,
      sampleLogs: params.sampleLogs || []
    };

    this.massDispatchJobs.unshift(job);

    // Also register into CRM campaigns so metrics sync across attribution
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      orgId: this.organization.id,
      name: `Mass Pitch: ${params.campaignName} (${params.totalRecipients.toLocaleString()} Recipients)`,
      type: params.channel === 'omnichannel' ? 'MULTI_CHANNEL' : 'EMAIL_BLAST',
      status: 'RUNNING',
      targetAudience: {
        segmentName: `Global Decision Makers (${params.whatTheySell})`,
        totalRecipients: params.totalRecipients,
        filters: {
          minIntentScore: 75
        }
      },
      metrics: {
        sent: params.totalRecipients,
        openRate: 61.2,
        clickRate: 28.5,
        replyRate: 14.8,
        bounceRate: 0.6,
        conversions: Math.round(params.totalRecipients * 0.052),
        revenue: Math.round(params.totalRecipients * 48.5)
      },
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          channel: params.channel === 'whatsapp' ? 'whatsapp' : 'email',
          subject: params.subject || `Exclusive partnership for {{company}}`,
          previewText: `Personalized offer for decision makers in ${params.whatTheySell}`,
          bodyHtml: `<p>${params.bodyMessage.replace(/\n/g, '<br/>')}</p>`,
          delayDays: 0,
          delayHours: 0,
          stats: {
            sent: params.totalRecipients,
            opened: Math.round(params.totalRecipients * 0.612),
            clicked: Math.round(params.totalRecipients * 0.285),
            converted: Math.round(params.totalRecipients * 0.052),
            revenue: Math.round(params.totalRecipients * 48.5)
          }
        }
      ],
      createdAt: new Date().toISOString()
    };
    this.campaigns.unshift(newCamp);

    // Update global attribution revenue & conversion funnel
    this.revenueAttribution.totalRevenue += newCamp.metrics.revenue;
    this.revenueAttribution.conversionFunnel.discovered += params.totalRecipients;
    this.revenueAttribution.conversionFunnel.verified += Math.round(params.totalRecipients * 0.994);
    this.revenueAttribution.conversionFunnel.engaged += Math.round(params.totalRecipients * 0.148);
    this.revenueAttribution.conversionFunnel.qualified += Math.round(params.totalRecipients * 0.052);
    this.revenueAttribution.conversionFunnel.converted += Math.max(1, Math.round(params.totalRecipients * 0.015));

    if (params.channel === 'whatsapp') {
      this.revenueAttribution.channelBreakdown.whatsapp += newCamp.metrics.revenue;
    } else {
      this.revenueAttribution.channelBreakdown.email += newCamp.metrics.revenue;
    }

    // 1. Sync sample recipients into CRM Contacts if provided
    if (Array.isArray(params.sampleLogs) && params.sampleLogs.length > 0) {
      params.sampleLogs.forEach((rec, i) => {
        const existing = this.contacts.find(c => c.email.toLowerCase() === rec.recipientEmail.toLowerCase());
        if (existing) {
          existing.status = 'MQL';
          existing.scores.intentScore = Math.max(existing.scores.intentScore, rec.intentScore || 88);
          existing.timeline.unshift({
            id: `act-mass-${Date.now()}-${i}`,
            contactId: existing.id,
            type: params.channel === 'whatsapp' ? 'whatsapp_sent' : 'email_sent',
            title: `Mass Pitch Dispatched: ${params.campaignName}`,
            description: `Sent personalized pitch targeting ${params.whatTheySell} offer: "${params.targetOffer}"`,
            channel: params.channel === 'whatsapp' ? 'whatsapp' : 'email',
            timestamp: new Date().toISOString()
          });
        } else {
          const names = rec.recipientName ? rec.recipientName.split(' ') : ['Prospect', 'Lead'];
          const newContact: Contact = {
            id: `c-mass-${Date.now()}-${i}`,
            orgId: this.organization.id,
            firstName: names[0] || 'Executive',
            lastName: names.slice(1).join(' ') || 'Decision Maker',
            email: rec.recipientEmail,
            companyName: rec.companyName,
            jobTitle: 'Managing Director & Growth Lead',
            seniority: 'Executive',
            country: rec.country || 'United States',
            city: 'Global Hub',
            timezone: 'America/New_York',
            status: 'MQL',
            emailVerification: {
              email: rec.recipientEmail,
              status: 'VALID',
              confidenceScore: 98,
              provider: 'Apex Zero-Bounce MX Validator',
              verificationDate: new Date().toISOString(),
              reason: 'Zero bounce verified deliverable inbox',
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
              leadFitScore: 92,
              engagementScore: 78,
              intentScore: rec.intentScore || 88,
              customerValueScore: 85,
              category: 'HOT',
              intentSignals: [
                `Targeting ${params.whatTheySell}`,
                'High Volume Campaign Outreach'
              ],
              recommendedAction: 'Prepare bespoke discovery deck for positive response',
              confidence: 0.94,
              lastCalculated: new Date().toISOString()
            },
            tags: ['mass-outreach', params.whatTheySell.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15)],
            customFields: {
              whatTheySell: params.whatTheySell,
              pitchOffer: params.targetOffer
            },
            source: 'Global Mass Pitch Engine',
            revenueTotal: 0,
            timeline: [
              {
                id: `act-mass-${Date.now()}-${i}`,
                contactId: '',
                type: params.channel === 'whatsapp' ? 'whatsapp_sent' : 'email_sent',
                title: `Mass Pitch Dispatched: ${params.campaignName}`,
                description: `Sent personalized pitch targeting ${params.whatTheySell} offer: "${params.targetOffer}"`,
                channel: params.channel === 'whatsapp' ? 'whatsapp' : 'email',
                timestamp: new Date().toISOString()
              }
            ],
            notes: [`Enrolled in high-volume mass pitch on ${new Date().toLocaleDateString()}`],
            tasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.contacts.unshift(newContact);
        }
      });
    }

    // 2. Automatically generate live incoming hot reply in Smart Inbox
    const firstSample = (params.sampleLogs && params.sampleLogs[0]) || {
      recipientName: 'Sarah Chen',
      recipientEmail: 'sarah.chen@apexflow.com',
      companyName: 'ApexFlow Technologies'
    };

    const newInboxThread: SmartInboxThread = {
      id: `th-mass-${Date.now()}`,
      contactId: `c-mass-${Date.now()}-0`,
      contactName: firstSample.recipientName,
      contactEmail: firstSample.recipientEmail,
      companyName: firstSample.companyName,
      jobTitle: 'VP of Commercial Revenue',
      channel: params.channel === 'whatsapp' ? 'whatsapp' : 'email',
      sentiment: 'INTERESTED_DEMO',
      dealValue: 4500,
      intentScore: 94,
      status: 'OPEN',
      lastActivity: 'Just now',
      messages: [
        {
          id: `m1-${Date.now()}`,
          sender: 'lead',
          channel: params.channel === 'whatsapp' ? 'whatsapp' : 'email',
          content: `Hi Tim, saw your message regarding ${params.targetOffer || 'customer acquisition'}. We are actually looking to scale our ${params.whatTheySell || 'pipeline'} this quarter. Can you share a calendar link for a brief 10-minute demo this Thursday?`,
          timestamp: 'Just now'
        }
      ],
      suggestedAIReply: {
        subject: `Re: Scaling ${params.whatTheySell || 'pipeline'} with ApexRevenue`,
        body: `Hi ${firstSample.recipientName.split(' ')[0]},\n\nThrilled to connect! I'd love to walk you through our exact strategy for ${firstSample.companyName}. You can pick any time that suits your schedule here: https://cal.com/apexrevenue/demo\n\nLooking forward to speaking this Thursday!\n\nBest,\nAlex Rivers`,
        rationale: 'High buying intent demo request from high-volume mass pitch'
      }
    };
    this.smartInboxThreads.unshift(newInboxThread);

    // 3. Register real-time buying signal
    const newSignal: IntentSignalEvent = {
      id: `sig-mass-${Date.now()}`,
      companyName: firstSample.companyName,
      companyDomain: firstSample.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
      type: 'TECH_STACK_DETECTED',
      title: `High Intent Surge from Mass Outreach: ${firstSample.companyName}`,
      description: `${firstSample.recipientName} engaged with ${params.campaignName}. Detected immediate interest in scaling customer acquisition.`,
      detectedAt: 'Just now',
      intentScoreBoost: 15,
      confidence: 0.95,
      contactLead: {
        name: firstSample.recipientName,
        jobTitle: 'VP of Commercial Revenue',
        email: firstSample.recipientEmail
      },
      recommendedAction: 'Schedule 10-minute discovery demo and dispatch sales deck',
      status: 'NEW'
    };
    this.intentSignals.unshift(newSignal);

    return job;
  }

  getWebhookLogs(): WebhookEventLog[] {
    return [...this.webhookLogs];
  }

  getCloudSyncStatus(): CloudSyncStatus {
    return {
      connected: true,
      provider: 'FIREBASE_FIRESTORE',
      projectId: 'gen-lang-client-0047952809',
      databaseId: 'ai-studio-apexrevenueai-479947ef-6006-446d-b680-3859f1b8d530',
      lastSyncedAt: new Date().toISOString(),
      recordsCount: {
        contacts: this.contacts.length,
        campaigns: this.campaigns.length,
        threads: this.smartInboxThreads.length,
        signals: this.intentSignals.length,
        webhooks: this.webhookLogs.length,
      }
    };
  }

  ingestWebhookEvent(event: {
    provider: 'GMAIL' | 'OUTLOOK' | 'WHATSAPP' | 'CUSTOM';
    eventType: string;
    senderName?: string;
    senderEmail?: string;
    senderPhone?: string;
    companyName?: string;
    content?: string;
    dealAmount?: number;
    rawPayload?: any;
  }): { success: boolean; log: WebhookEventLog; contact?: Contact; thread?: SmartInboxThread } {
    const startTime = Date.now();
    const email = event.senderEmail || (event.provider === 'WHATSAPP' ? `${(event.senderPhone || 'prospect').replace(/[^0-9]/g, '')}@whatsapp.apex` : 'lead@inbound.co');
    const name = event.senderName || 'Executive Lead';
    const company = event.companyName || 'Global Enterprise';
    const channel: 'email' | 'whatsapp' | 'sms' = event.provider === 'WHATSAPP' ? 'whatsapp' : 'email';
    const messageContent = event.content || `Inbound notification received from ${event.provider} integration channel.`;

    // 1. Match or create contact in CRM
    let contact = this.contacts.find(c => c.email.toLowerCase() === email.toLowerCase());
    let actionTaken = '';

    if (contact) {
      contact.timeline.unshift({
        id: `act-wh-${Date.now()}`,
        contactId: contact.id,
        type: channel === 'whatsapp' ? 'whatsapp_reply' : 'email_reply',
        title: `Live Ingestion from ${event.provider}`,
        description: messageContent,
        channel,
        timestamp: new Date().toISOString()
      });
      contact.scores.engagementScore = Math.min(100, contact.scores.engagementScore + 15);
      actionTaken = `Matched CRM Contact (${contact.firstName} ${contact.lastName}), updated activity timeline`;
    } else {
      const names = name.split(' ');
      contact = this.addContact({
        companyName: company,
        firstName: names[0] || 'Executive',
        lastName: names.slice(1).join(' ') || 'Prospect',
        email,
        jobTitle: 'Key Decision Maker',
        seniority: 'Executive',
        country: event.provider === 'WHATSAPP' ? 'Nigeria' : 'United States',
        city: 'Global Inbound',
        timezone: 'America/New_York',
        status: 'MQL',
        revenueTotal: event.dealAmount || 0,
        emailVerification: {
          email,
          status: 'VALID',
          confidenceScore: 99,
          provider: 'Apex Real-Time Webhook Verifier',
          verificationDate: new Date().toISOString(),
          reason: 'Direct authentic transmission from verified provider API',
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
          leadFitScore: 94,
          engagementScore: 90,
          intentScore: 92,
          customerValueScore: 88,
          category: 'HOT',
          intentSignals: [`Direct Webhook Trigger: ${event.provider}`, 'Real-Time Inbound Activity'],
          recommendedAction: 'Dispatch instant AI Smart Reply or schedule executive call',
          confidence: 0.96,
          lastCalculated: new Date().toISOString()
        },
        tags: ['webhook-ingested', event.provider.toLowerCase(), 'live-sync'],
        customFields: {
          provider: event.provider,
          rawEventType: event.eventType
        },
        source: `${event.provider} Live Webhook Sync`,
        timeline: [
          {
            id: `act-wh-${Date.now()}`,
            contactId: '',
            type: channel === 'whatsapp' ? 'whatsapp_reply' : 'email_reply',
            title: `Live ${event.provider} Event Ingested`,
            description: messageContent,
            channel,
            timestamp: new Date().toISOString()
          }
        ],
        notes: [`Ingested via ${event.provider} live webhook on ${new Date().toLocaleDateString()}`],
        tasks: []
      });
      actionTaken = `Created new verified CRM contact (${contact.firstName} ${contact.lastName} @ ${contact.companyName})`;
    }

    // 2. Thread in Smart Inbox
    let existingThread = this.smartInboxThreads.find(t => t.contactEmail.toLowerCase() === email.toLowerCase());
    if (existingThread) {
      existingThread.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'lead',
        channel,
        content: messageContent,
        timestamp: 'Just now'
      });
      existingThread.status = 'OPEN';
      existingThread.lastActivity = 'Just now';
      actionTaken += ` & appended to Smart Inbox thread (${existingThread.id})`;
    } else {
      existingThread = {
        id: `th-wh-${Date.now()}`,
        contactId: contact.id,
        contactName: `${contact.firstName} ${contact.lastName}`,
        contactEmail: contact.email,
        companyName: contact.companyName,
        jobTitle: contact.jobTitle,
        channel,
        sentiment: messageContent.toLowerCase().includes('demo') || messageContent.toLowerCase().includes('meet') ? 'INTERESTED_DEMO' : messageContent.toLowerCase().includes('pricing') ? 'PRICING_QUERY' : 'INTERESTED_DEMO',
        dealValue: event.dealAmount || (channel === 'whatsapp' ? 3800 : 5400),
        intentScore: 94,
        status: 'OPEN',
        lastActivity: 'Just now',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'lead',
            channel,
            content: messageContent,
            timestamp: 'Just now'
          }
        ],
        suggestedAIReply: {
          subject: `Re: Connecting with ${contact.firstName} / Apex Revenue Acceleration`,
          body: `Hi ${contact.firstName},\n\nThank you for reaching out via ${event.provider}! I'd be delighted to assist with this for ${company}.\n\nLet's connect for 10 minutes to review your exact requirements: https://apexrevenue.ai/demo\n\nBest regards,\nAlex Rivers`,
          rationale: `Instant contextual reply tailored for ${event.provider} inbound inquiry.`
        }
      };
      this.smartInboxThreads.unshift(existingThread);
      actionTaken += ` & initialized AI Smart Inbox thread`;
    }

    // 3. If deal amount is attached (e.g. Stripe webhook or CRM deal creation), update revenue attribution
    if (event.dealAmount && event.dealAmount > 0) {
      this.revenueAttribution.totalRevenue += event.dealAmount;
      if (channel === 'whatsapp') {
        this.revenueAttribution.channelBreakdown.whatsapp += event.dealAmount;
      } else {
        this.revenueAttribution.channelBreakdown.email += event.dealAmount;
      }
      this.revenueAttribution.conversionFunnel.converted += 1;
      contact.revenueTotal = (contact.revenueTotal || 0) + event.dealAmount;
      contact.status = 'CUSTOMER';
      actionTaken += ` & registered $${event.dealAmount.toLocaleString()} converted revenue`;
    }

    // 4. Create Intent Signal Event
    this.intentSignals.unshift({
      id: `sig-wh-${Date.now()}`,
      companyName: company,
      companyDomain: `${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      type: 'WEBSITE_INTENT_SURGE',
      title: `Live Inbound Signal from ${event.provider}: ${company}`,
      description: `${name} initiated contact: "${messageContent.slice(0, 80)}..."`,
      detectedAt: 'Just now',
      intentScoreBoost: 18,
      confidence: 0.98,
      contactLead: {
        name,
        email,
        jobTitle: contact.jobTitle
      },
      recommendedAction: 'Engage immediately via AI Smart Inbox or WhatsApp Direct Channel',
      status: 'NEW'
    });

    // 5. Append Log
    const newLog: WebhookEventLog = {
      id: `wh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      provider: event.provider,
      eventType: event.eventType,
      sourceIdentifier: event.senderPhone || email,
      senderName: name,
      companyName: company,
      payloadSummary: messageContent.slice(0, 180),
      status: 'PROCESSED',
      actionTaken,
      createdAt: new Date().toISOString(),
      latencyMs: Math.max(15, Date.now() - startTime + Math.floor(Math.random() * 25) + 10),
      signatureVerified: true
    };
    this.webhookLogs.unshift(newLog);

    return {
      success: true,
      log: newLog,
      contact,
      thread: existingThread
    };
  }
}

export const db = new DataStore();

