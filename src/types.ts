export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MARKETER' | 'SALES' | 'ANALYST' | 'VIEWER';
export type PlanTier = 'STARTER' | 'PRO' | 'BUSINESS' | 'AGENCY';
export type CurrencyCode = 'USD' | 'NGN' | 'GBP' | 'EUR';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isSuperAdmin?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  currency: CurrencyCode;
  timezone: string;
  credits: {
    leadDiscovery: number;
    emailVerification: number;
    aiTokens: number;
    smsUnits: number;
    whatsappUnits: number;
  };
  limits: {
    maxContacts: number;
    maxMonthlyEmails: number;
    maxTeamMembers: number;
  };
}

export interface OrgMember {
  id: string;
  userId: string;
  orgId: string;
  role: UserRole;
  user: User;
}

export type EmailVerificationStatus = 
  | 'VALID' 
  | 'RISKY' 
  | 'INVALID' 
  | 'ACCEPT_ALL' 
  | 'DISPOSABLE' 
  | 'ROLE_ACCOUNT' 
  | 'UNKNOWN';

export interface EmailVerificationResult {
  email: string;
  status: EmailVerificationStatus;
  confidenceScore: number; // 0 - 100
  provider: string;
  verificationDate: string;
  reason: string;
  riskFlags: string[];
  details: {
    syntaxValid: boolean;
    domainExists: boolean;
    mxRecordsFound: boolean;
    isDisposable: boolean;
    isRoleAccount: boolean;
    isCatchAll: boolean;
    smtpReachable: boolean;
  };
}

export type LeadScoreCategory = 'HOT' | 'WARM' | 'COLD' | 'INACTIVE';
export type ContactStatus = 'PROSPECT' | 'LEAD' | 'QUALIFIED' | 'MQL' | 'SQL' | 'OPPORTUNITY' | 'CUSTOMER' | 'CHURNED' | 'UNSUBSCRIBED';

export interface AIScoreMatrix {
  leadFitScore: number; // 0 - 100
  engagementScore: number; // 0 - 100
  intentScore: number; // 0 - 100
  customerValueScore: number; // 0 - 100
  category: LeadScoreCategory;
  intentSignals: string[];
  recommendedAction: string;
  churnProbability?: number;
  confidence: number;
  lastCalculated: string;
}

export interface Company {
  id: string;
  orgId: string;
  name: string;
  domain: string;
  industry: string;
  subIndustry?: string;
  employeeCountRange: string;
  annualRevenueRange: string;
  country: string;
  city: string;
  techStack: string[];
  linkedinUrl?: string;
  website?: string;
  description?: string;
  createdAt: string;
}

export interface ActivityTimelineItem {
  id: string;
  contactId: string;
  type: 
    | 'lead_created' 
    | 'email_sent' 
    | 'email_opened' 
    | 'email_reply'
    | 'link_clicked' 
    | 'page_viewed' 
    | 'form_submitted' 
    | 'sales_call' 
    | 'proposal_sent' 
    | 'checkout_started' 
    | 'purchase_completed' 
    | 'whatsapp_sent' 
    | 'whatsapp_reply'
    | 'sms_sent' 
    | 'score_updated';
  title: string;
  description: string;
  channel?: 'email' | 'whatsapp' | 'sms' | 'web' | 'direct';
  metadata?: Record<string, any>;
  monetaryValue?: number;
  timestamp: string;
}

export interface Contact {
  id: string;
  orgId: string;
  companyId?: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  department?: string;
  seniority: string;
  country: string;
  city: string;
  timezone: string;
  status: ContactStatus;
  emailVerification: EmailVerificationResult;
  scores: AIScoreMatrix;
  tags: string[];
  customFields: Record<string, string | number | boolean>;
  source: string;
  consentSource?: string;
  consentTimestamp?: string;
  revenueTotal: number;
  timeline: ActivityTimelineItem[];
  notes?: string[];
  tasks?: Array<{ id: string; title: string; dueDate: string; completed: boolean }>;
  createdAt: string;
  updatedAt: string;
}

export type LeadTargetCategory = 
  | 'INDIVIDUALS'
  | 'BUSINESS'
  | 'BUSINESS_B2B' 
  | 'STUDENTS_ACADEMIC' 
  | 'CRYPTO_WEB3' 
  | 'HOT_NICHES_BRANDS' 
  | 'INDIVIDUALS_B2C';

export type DomainProviderFilter = 
  | 'ALL_DOMAINS' 
  | 'GMAIL' 
  | 'YAHOO' 
  | 'OUTLOOK_HOTMAIL' 
  | 'ICLOUD' 
  | 'PROTON' 
  | 'UNIVERSITY_EDU' 
  | 'CORPORATE_CUSTOM' 
  | 'CRYPTO_WEB3_DOMAINS';

export type SocialMediaPlatform = 
  | 'all'
  | 'facebook' 
  | 'youtube' 
  | 'linkedin' 
  | 'twitter' 
  | 'tiktok' 
  | 'instagram' 
  | 'pinterest' 
  | 'forums' 
  | 'snapchat';

export interface LeadDiscoveryFilter {
  naturalLanguage?: string;
  targetCategory?: LeadTargetCategory;
  domainProvider?: DomainProviderFilter;
  continent?: string;
  country?: string;
  state?: string;
  city?: string;
  industry?: string;
  subIndustry?: string;
  // Product-Driven & Niche-Driven Prospecting fields
  productName?: string;
  productDescription?: string;
  targetNiches?: string[];
  socialPlatform?: SocialMediaPlatform;
  socialPlatforms?: SocialMediaPlatform[];
  detectedPainKeywords?: string[];
  // Student & Academic fields
  schoolOrUniversity?: string;
  department?: string;
  courseOrDegree?: string;
  graduationYear?: string;
  // Crypto & Web3 fields
  cryptoNiche?: string;
  blockchainEcosystem?: string;
  // Hot Niches & Brands
  brandNiche?: string;
  revenueRange?: string;
  employeeRange?: string;
  seniority?: string;
  techStack?: string[];
  jobTitle?: string;
  keywords?: string;
  painPoint?: string;
  targetAudience?: string;
  whatTheySell?: string;
  userGoal?: string;
  provider?: 'auto' | 'apollo' | 'hunter' | 'tomba' | 'global_registry' | 'social_omni';
}

export interface DiscoveredLead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  seniority: string;
  department?: string;
  companyName: string; // Or University / DAO / Brand Name / Social Profile
  companyDomain: string;
  domainProviderType?: string;
  industry: string;
  targetCategory?: LeadTargetCategory;
  // Social Intelligence & Pain Extraction
  socialPlatform?: SocialMediaPlatform;
  socialHandle?: string;
  socialProfileUrl?: string;
  detectedPainExcerpt?: string;
  painSeverity?: 'CRITICAL' | 'HIGH' | 'MODERATE';
  productMatchReason?: string;
  matchedProductName?: string;
  targetNiche?: string;
  postEngagementSnippet?: string;
  painPoint?: string;
  targetAudience?: string;
  whatTheySell?: string;
  userGoal?: string;
  solutionFitReason?: string;
  schoolOrUniversity?: string;
  courseOrDegree?: string;
  cryptoNiche?: string;
  blockchainEcosystem?: string;
  brandNiche?: string;
  employeeCount: string;
  revenueRange: string;
  country: string;
  city: string;
  techStack: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  telegramHandle?: string;
  sourceProvider: string;
  verificationStatus: EmailVerificationStatus;
  confidenceScore: number;
  leadFitScore: number;
  buyingIntentScore: number;
  importedToCRM?: boolean;
}

export type CampaignType = 'EMAIL_BLAST' | 'SEQUENCE' | 'MULTI_CHANNEL' | 'AB_TEST';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface CampaignStep {
  id: string;
  stepNumber: number;
  subject: string;
  previewText: string;
  bodyHtml: string;
  delayDays: number;
  delayHours: number;
  channel: 'email' | 'whatsapp' | 'sms';
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
}

export interface Campaign {
  id: string;
  orgId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  targetAudience: {
    segmentName: string;
    totalRecipients: number;
    filters: {
      tags?: string[];
      minIntentScore?: number;
      country?: string;
      status?: ContactStatus[];
    };
  };
  steps: CampaignStep[];
  abTesting?: {
    enabled: boolean;
    variantBSubject?: string;
    variantBBody?: string;
    splitRatio: number; // e.g. 50%
    winnerMetric: 'open_rate' | 'click_rate' | 'revenue';
  };
  metrics: {
    sent: number;
    openRate: number; // 0 - 100%
    clickRate: number; // 0 - 100%
    replyRate: number; // 0 - 100%
    bounceRate: number; // 0 - 100%
    conversions: number;
    revenue: number;
  };
  scheduleDate?: string;
  createdAt: string;
}

export type WorkflowNodeType = 
  | 'TRIGGER' 
  | 'EMAIL' 
  | 'WAIT' 
  | 'CONDITION' 
  | 'TAG' 
  | 'WHATSAPP' 
  | 'SMS' 
  | 'AI_DECISION' 
  | 'UPDATE_DEAL';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  conditionBranch?: 'yes' | 'no' | 'default';
  label?: string;
}

export interface AutomationWorkflow {
  id: string;
  orgId: string;
  name: string;
  description: string;
  triggerType: 'new_lead' | 'score_threshold' | 'page_visited' | 'form_submitted' | 'abandoned_checkout' | 'tag_added';
  isActive: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  stats: {
    totalEnrolled: number;
    activeNow: number;
    completed: number;
    revenueGenerated: number;
  };
  createdAt: string;
}

export type Workflow = AutomationWorkflow;

export interface NextBestAction {
  id: string;
  category: 'high_intent' | 'abandoned_checkout' | 'reactivation' | 'upsell' | 'hot_lead';
  title: string;
  description: string;
  impactScore: number; // 1-100
  potentialRevenue: number;
  targetCount: number;
  recommendedChannel: 'email' | 'whatsapp' | 'sales_call';
  suggestedActionText: string;
  actionPayload: {
    actionType: 'send_campaign' | 'trigger_workflow' | 'assign_sales' | 'apply_discount';
    campaignId?: string;
    data?: Record<string, any>;
  };
}

export interface DeliverabilityHealth {
  spfConfigured: boolean;
  dkimConfigured: boolean;
  dmarcConfigured: boolean;
  domainReputation: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'POOR';
  reputationScore: number; // 0 - 100
  overallBounceRate: number; // e.g. 0.8%
  spamComplaintRate: number; // e.g. 0.02%
  suppressedCount: number;
  dailyQuota: {
    used: number;
    max: number;
  };
  recommendations: string[];
}

export interface RevenueAttributionSummary {
  totalRevenue: number;
  channelBreakdown: {
    email: number;
    whatsapp: number;
    sms: number;
    organic: number;
    paid: number;
  };
  topCampaigns: Array<{
    id: string;
    name: string;
    revenue: number;
    roiPercentage: number;
    cost: number;
  }>;
  geographicRevenue: Array<{
    country: string;
    countryCode: string;
    revenue: number;
    customerCount: number;
  }>;
  conversionFunnel: {
    discovered: number;
    verified: number;
    engaged: number;
    qualified: number;
    converted: number;
  };
}

export interface LandingPageItem {
  id: string;
  title: string;
  slug: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  leadMagnetName?: string;
  leadMagnetType?: 'PDF' | 'Video' | 'Template' | 'Audio';
  published: boolean;
  views: number;
  submissions: number;
  conversionRate: number;
  createdAt: string;
}

export type LandingPage = LandingPageItem;

// --- High-Value Gap-Filling Additions ---

// 1. Signal-Based Buying Intent & Account Trigger Engine
export type IntentSignalType = 
  | 'EXECUTIVE_HIRE' 
  | 'TECH_STACK_DETECTED' 
  | 'FUNDING_ROUND' 
  | 'WEBSITE_INTENT_SURGE' 
  | 'JOB_POSTING' 
  | 'EXPANSION_EVENT';

export interface IntentSignalEvent {
  id: string;
  companyName: string;
  companyDomain: string;
  type: IntentSignalType;
  title: string;
  description: string;
  detectedAt: string;
  intentScoreBoost: number;
  confidence: number;
  contactLead?: {
    name: string;
    email: string;
    jobTitle: string;
  };
  recommendedAction: string;
  recommendedCampaignId?: string;
  status: 'NEW' | 'ACTIONED' | 'DISMISSED';
}

// 2. AI Smart Inbox & Sentiment-Classified Multi-Channel Reply Matrix
export type ReplySentiment = 
  | 'INTERESTED_DEMO' 
  | 'PRICING_QUERY' 
  | 'OBJECTION_GATEKEEPER' 
  | 'NOT_NOW' 
  | 'OUT_OF_OFFICE' 
  | 'UNSUBSCRIBE';

export interface SmartInboxMessage {
  id: string;
  sender: 'lead' | 'user' | 'ai_auto';
  channel: 'email' | 'whatsapp' | 'sms';
  content: string;
  timestamp: string;
}

export interface SmartInboxThread {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  companyName: string;
  jobTitle: string;
  avatarUrl?: string;
  channel: 'email' | 'whatsapp' | 'sms';
  sentiment: ReplySentiment;
  dealValue?: number;
  intentScore: number;
  status: 'OPEN' | 'REPLIED' | 'SNOOZED' | 'CLOSED';
  lastActivity: string;
  messages: SmartInboxMessage[];
  suggestedAIReply: {
    subject?: string;
    body: string;
    rationale: string;
  };
}

// 3. AI Deliverability & Spam Word Auditor
export interface SpamAuditResult {
  deliverabilityScore: number; // 0 - 100
  riskCategory: 'SAFE' | 'MODERATE' | 'HIGH_RISK';
  readingGradeLevel: string; // e.g. "Grade 6.4 (Optimal)"
  readingTimeSeconds: number;
  spamWordsDetected: Array<{ word: string; category: string; severity: 'HIGH' | 'MEDIUM' }>;
  subjectScore: number;
  linkCount: number;
  hasSpammyCapitalization: boolean;
  recommendations: string[];
  optimizedAlternative: {
    subject: string;
    bodyHtml: string;
    explanation: string;
  };
}

// 4. Global High-Volume Scouting & 1-Click Mass Pitching Engine (2,000 - 5,000+ Clients at Once)
export type GlobalRegion = 
  | 'GLOBAL'
  | 'NORTH_AMERICA' 
  | 'UK_AND_EUROPE' 
  | 'AFRICA' 
  | 'ASIA_PACIFIC' 
  | 'LATIN_AMERICA' 
  | 'MIDDLE_EAST';

export interface GlobalScoutFilter {
  userGoal?: string; // e.g. "I want to generate content for my business", "I want to sell web development", "I want to get coaching clients"
  whatTheySell: string; // e.g. "E-commerce fashion", "B2B SaaS CRM", "Digital Marketing Retainers", "Commercial Real Estate"
  painPoint?: string; // e.g. "Losing 30% pipeline to manual followups", "High customer acquisition cost"
  targetAudience?: string; // e.g. "Mid-market B2B SaaS", "Shopify brands", "Clinic owners"
  industry?: string;
  targetRegion: GlobalRegion;
  targetCategory?: LeadTargetCategory;
  domainProvider?: DomainProviderFilter;
  schoolOrUniversity?: string;
  department?: string;
  courseOrDegree?: string;
  cryptoNiche?: string;
  blockchainEcosystem?: string;
  brandNiche?: string;
  keywords?: string;
  leadVolume: number; // 500 to 100000
  minIntentScore?: number;
  seniority?: string;
  sampleLimit?: number;
  page?: number;
  pageSize?: number;
}

export interface MassRecipientDispatchLog {
  id: string;
  recipientName: string;
  recipientEmail: string;
  companyName: string;
  whatTheySell: string;
  country: string;
  status: 'SENT' | 'DELIVERED' | 'OPENED' | 'REPLIED' | 'QUEUED';
  channel: 'email' | 'whatsapp' | 'sms' | 'omnichannel';
  timestamp: string;
  intentScore: number;
}

export interface MassDispatchJob {
  id: string;
  campaignName: string;
  targetOffer: string;
  whatTheySell: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openCount: number;
  replyCount: number;
  bounceShieldCount: number;
  channel: 'email' | 'whatsapp' | 'omnichannel';
  dispatchSpeed: 'INSTANT_TURBO' | 'SMART_RAMPED';
  status: 'QUEUED' | 'DISPATCHING' | 'COMPLETED' | 'PAUSED';
  progressPercentage: number;
  startedAt: string;
  estimatedCompletion: string;
  subject?: string;
  bodyMessage: string;
  sampleLogs: MassRecipientDispatchLog[];
}

// 5. External Webhook Ingestion Engine & Multi-Tenant Team Cloud Sync
export type WebhookProviderType = 'GMAIL' | 'OUTLOOK' | 'WHATSAPP' | 'CUSTOM';

export interface WebhookEventLog {
  id: string;
  provider: WebhookProviderType;
  eventType: string;
  sourceIdentifier: string;
  senderName?: string;
  companyName?: string;
  payloadSummary: string;
  status: 'PROCESSED' | 'PENDING' | 'FAILED';
  actionTaken: string;
  createdAt: string;
  latencyMs: number;
  signatureVerified: boolean;
}

export interface CloudSyncStatus {
  connected: boolean;
  provider: 'FIREBASE_FIRESTORE';
  projectId: string;
  databaseId: string;
  lastSyncedAt: string;
  recordsCount: {
    contacts: number;
    campaigns: number;
    threads: number;
    signals: number;
    webhooks: number;
  };
}

// 6. 14-Day Full Access Sandbox, Cost Control & Onboarding Engine
export type WowJourneyGoal = 
  | 'GROW_BUSINESS' 
  | 'FIND_CUSTOMERS' 
  | 'MASS_OUTREACH' 
  | 'REVENUE_AUTOMATION' 
  | 'CONTENT_MEDIA';

export interface WowJourneyStep {
  day: number;
  id: string;
  title: string;
  description: string;
  targetTab: string;
  actionLabel: string;
  completed: boolean;
  impactMetric: string;
  category: 'lead_gen' | 'copywriting' | 'deliverability' | 'automation' | 'conversion';
}

export interface WowJourneyState {
  selectedGoal: WowJourneyGoal;
  goalTitle: string;
  currentDay: number;
  completedStepIds: string[];
  steps: WowJourneyStep[];
  ahaMomentReached: boolean;
  activationScore: number; // 0 - 100
}

export interface BYOKConfig {
  enabled: boolean;
  activeMode: 'PLATFORM_FAIR_USE' | 'BYOK_DIRECT';
  geminiApiKey?: string;
  openaiApiKey?: string;
  elevenLabsApiKey?: string;
  sendgridApiKey?: string;
  whatsappApiToken?: string;
  customWebhookUrl?: string;
  lastTestedAt?: string;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'TESTING' | 'ERROR';
}

export interface CostControlMetrics {
  tier: 'TRIAL_SANDBOX' | 'STARTER' | 'PRO' | 'BUSINESS' | 'AGENCY';
  isTrialActive: boolean;
  trialDaysRemaining: number;
  trialStartedAt: string;
  trialExpiresAt: string;
  preservationExpiresAt: string; // 30 days after trial
  preservationDaysRemaining: number;
  sampleModeActive: boolean;
  fairUseStatus: 'OPTIMAL' | 'MODERATE' | 'NEAR_DAILY_CAP' | 'BYOK_UNLIMITED';
  dailyUsage: {
    aiTokensUsedToday: number;
    aiTokensDailyLimit: number;
    leadsDiscoveredToday: number;
    leadsDailyLimit: number;
    emailsVerifiedToday: number;
    emailsDailyLimit: number;
    pitchesDispatchedToday: number;
    pitchesDailyLimit: number;
    sampleMediaGeneratedToday: number;
    sampleMediaDailyLimit: number;
  };
  totalAccumulatedAssets: {
    leadsFound: number;
    verifiedEmails: number;
    pitchesCrafted: number;
    campaignsActive: number;
    crmContacts: number;
    smartInboxThreads: number;
    attributedPipelineValue: number;
  };
  modelRouting: {
    cheapModel: string;
    midTierModel: string;
    premiumModel: string;
    currentRoutingMode: 'AUTO_COST_OPTIMIZER' | 'MAX_QUALITY_PRO' | 'BYOK_DIRECT';
  };
}

export interface SandboxWorkspaceState {
  costControl: CostControlMetrics;
  byok: BYOKConfig;
  wowJourney: WowJourneyState;
  showPreservationModal: boolean;
  showWowJourneyModal: boolean;
}

// ==========================================
// SELLER PROFITABILITY & BUYER PAIN ENGINES
// ==========================================

export interface GrandSlamOffer {
  id: string;
  productName: string;
  targetBuyerRole: string;
  primaryBuyerPain: string;
  dreamOutcome: string;
  corePrice: number;
  deliveryFormat: 'SaaS' | 'DONE_FOR_YOU' | 'HYBRID_CONSULTING' | 'DIGITAL_PRODUCT' | 'PHYSICAL_GOODS';
  valueScores: {
    dreamOutcomeScore: number; // 1-10
    perceivedLikelihood: number; // 1-10
    timeDelayReduction: number; // 1-10
    effortSacrificeReduction: number; // 1-10
  };
  orderBumps: OrderBump[];
  upsellPaths: UpsellPath[];
  downsellOptions: DownsellOption[];
  guarantees: GuaranteeOption[];
  activeGuaranteeId: string;
}

export interface OrderBump {
  id: string;
  title: string;
  price: number;
  tagline: string;
  perceivedValue: number;
  takeRatePercentage: number;
  active: boolean;
}

export interface UpsellPath {
  id: string;
  title: string;
  price: number;
  recurringMonthly: boolean;
  valueProposition: string;
  profitMargin: number; // e.g. 85%
  active: boolean;
}

export interface DownsellOption {
  id: string;
  title: string;
  price: number;
  paymentSplit: string; // e.g. "3 x $199"
  preservesMargin: number; // percentage
  idealFor: string;
}

export interface GuaranteeOption {
  id: string;
  type: 'UNCONDITIONAL' | 'MILESTONE_PERFORMANCE' | 'SHARED_ESCROW' | 'RISK_FREE_PILOT';
  title: string;
  description: string;
  buyerRiskReduction: string;
  conversionMultiplier: string;
}

export interface BuyerDealRoom {
  id: string;
  dealName: string;
  clientCompanyName: string;
  clientDecisionMaker: string;
  clientEmail: string;
  sellerProductName: string;
  contractValue: number;
  status: 'DRAFT' | 'SHARED_WITH_BUYER' | 'IN_REVIEW' | 'STAKEHOLDER_APPROVAL' | 'ACCEPTED' | 'ACTIVE';
  buyerPainSummary: string;
  prescribedSolution: string;
  buyerRoiMetrics: {
    currentWeeklyHoursLost: number;
    currentMonthlyCostOfInaction: number;
    projectedMonthlyNetGain: number;
    paybackPeriodDays: number;
    expected12MonthRoiMultiple: number;
  };
  mutualActionPlan: DealMilestone[];
  selectedAddonIds: string[];
  lastViewedAt?: string;
  acceptedAt?: string;
}

export interface DealMilestone {
  id: string;
  stepNumber: number;
  title: string;
  targetTimeline: string;
  owner: 'BUYER' | 'SELLER' | 'JOINT';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  verificationDeliverable: string;
}

export interface ObjectionCard {
  id: string;
  category: 'PRICE_BUDGET' | 'COMPETITOR' | 'TIMING' | 'COMPLEXITY' | 'TRUST_PROOF';
  buyerObjectionText: string;
  psychologicalFear: string;
  theReframeStrategy: string;
  battleTestedScript: string;
  proofAssetSnippet: string;
  winRateImpact: string;
}

export interface CompetitorBattlecard {
  id: string;
  competitorName: string;
  competitorCategory: string;
  theirWeakness: string;
  ourUnfairAdvantage: string;
  switchingEaseScore: string;
  landmineToPlant: string; // Question to prompt the buyer to ask competitor
}




