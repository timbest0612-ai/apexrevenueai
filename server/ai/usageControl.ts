import { 
  CostControlMetrics, 
  BYOKConfig, 
  WowJourneyState, 
  WowJourneyGoal,
  WowJourneyStep 
} from '../../src/types.js';
import { db } from '../db/store.js';

class UsageControlEngine {
  private trialStartDate: Date;
  private trialDurationDays: number = 14;
  private preservationDurationDays: number = 30;
  
  public byokConfig: BYOKConfig = {
    enabled: false,
    activeMode: 'PLATFORM_FAIR_USE',
    status: 'NOT_CONFIGURED',
  };

  public wowJourney: WowJourneyState;

  private dailyCounters = {
    date: new Date().toISOString().split('T')[0],
    aiTokens: 14500,
    leads: 180,
    verifications: 350,
    pitches: 65,
    sampleMedia: 4,
  };

  constructor() {
    // Default trial start date is 3 days ago so the user experiences an active trial with progress
    this.trialStartDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    this.wowJourney = this.initializeWowJourney('GROW_BUSINESS');
  }

  public initializeWowJourney(goal: WowJourneyGoal): WowJourneyState {
    const goalsMap: Record<WowJourneyGoal, { title: string; steps: WowJourneyStep[] }> = {
      GROW_BUSINESS: {
        title: 'Grow My Business (Full Revenue Funnel)',
        steps: [
          {
            day: 1,
            id: 'wj-step-1',
            title: 'Discover Ideal Decision Makers',
            description: 'Use the Global Lead Finder or Natural Language radar to scout 50+ high-fit prospects.',
            targetTab: 'leads',
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
            targetTab: 'verifier',
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
            targetTab: 'mass-pitch',
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
            targetTab: 'landing-pages',
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
        ]
      },
      FIND_CUSTOMERS: {
        title: 'Find & Qualify High-Value B2B Customers',
        steps: [
          {
            day: 1,
            id: 'fc-1',
            title: 'Define ICP & Industry Keywords',
            description: 'Search decision-makers across US, UK, Nigeria and global markets.',
            targetTab: 'leads',
            actionLabel: 'Search ICP',
            completed: true,
            impactMetric: '500+ Targets',
            category: 'lead_gen',
          },
          {
            day: 2,
            id: 'fc-2',
            title: 'Enrich CRM with 4D AI Scoring',
            description: 'Evaluate fit, engagement, intent, and estimated deal value.',
            targetTab: 'crm',
            actionLabel: 'Review CRM Matrix',
            completed: true,
            impactMetric: '4D Scores Calculated',
            category: 'lead_gen',
          },
          {
            day: 3,
            id: 'fc-3',
            title: 'Scout Intent Signals on Radar',
            description: 'Detect pricing page visitors, tech stack triggers, and funding changes.',
            targetTab: 'intent-radar',
            actionLabel: 'Monitor Radar',
            completed: false,
            impactMetric: '12 Active Signals',
            category: 'automation',
          },
        ]
      },
      MASS_OUTREACH: {
        title: 'High-Volume Outbound (2k–5k Prospects)',
        steps: [
          {
            day: 1,
            id: 'mo-1',
            title: 'Scout Global Seller Registry',
            description: 'Aggregate thousands of prospective buyers matching your niche offer.',
            targetTab: 'mass-pitch',
            actionLabel: 'Scout 5,000 Targets',
            completed: true,
            impactMetric: '5,000 Scoped',
            category: 'lead_gen',
          },
          {
            day: 2,
            id: 'mo-2',
            title: 'Run Anti-Spam Auditor',
            description: 'Scan subject lines and body copy for spam trigger words and spam traps.',
            targetTab: 'spam-auditor',
            actionLabel: 'Audit Pitch',
            completed: true,
            impactMetric: '98% Spam Score',
            category: 'deliverability',
          },
          {
            day: 3,
            id: 'mo-3',
            title: 'Execute Controlled Batch Dispatch',
            description: 'Send personalized pitches with ramped delivery intervals.',
            targetTab: 'mass-pitch',
            actionLabel: 'Dispatch Batch',
            completed: false,
            impactMetric: 'Active Sending',
            category: 'automation',
          },
        ]
      },
      REVENUE_AUTOMATION: {
        title: 'Autonomous Revenue Operations',
        steps: [
          {
            day: 1,
            id: 'ra-1',
            title: 'Configure Smart Sequences',
            description: 'Build automated email and WhatsApp fallback journeys in the Visual Canvas.',
            targetTab: 'automations',
            actionLabel: 'Open Canvas',
            completed: true,
            impactMetric: '3 Triggers Live',
            category: 'automation',
          },
          {
            day: 2,
            id: 'ra-2',
            title: 'AI Smart Inbox Auto-Replies',
            description: 'Let AI draft context-aware answers to executive questions in 1 click.',
            targetTab: 'smart-inbox',
            actionLabel: 'Test Smart Inbox',
            completed: true,
            impactMetric: 'Instant Triage',
            category: 'conversion',
          },
          {
            day: 3,
            id: 'ra-3',
            title: 'Closed-Loop Revenue Dashboard',
            description: 'Connect payment webhooks and analyze channel ROI across all touchpoints.',
            targetTab: 'attribution',
            actionLabel: 'Analyze Revenue',
            completed: false,
            impactMetric: '$36.8k Attributed',
            category: 'conversion',
          },
        ]
      },
      CONTENT_MEDIA: {
        title: 'Pitch Assets & Conversion Media Lab',
        steps: [
          {
            day: 1,
            id: 'cm-1',
            title: 'Generate Multi-Variate Copywriting',
            description: 'Create tailored hooks, value propositions, and case study pitches.',
            targetTab: 'campaigns',
            actionLabel: 'Generate Copy',
            completed: true,
            impactMetric: '5 Hooks Ready',
            category: 'copywriting',
          },
          {
            day: 2,
            id: 'cm-2',
            title: 'Generate 30s Pitch Preview Demo',
            description: 'Test Sample Mode generation for personalized video/audio outreach scripts.',
            targetTab: 'mass-pitch',
            actionLabel: 'Preview Sample Media',
            completed: false,
            impactMetric: 'Sample Mode Safe',
            category: 'conversion',
          },
        ]
      }
    };

    const chosen = goalsMap[goal] || goalsMap.GROW_BUSINESS;
    const completedCount = chosen.steps.filter(s => s.completed).length;

    return {
      selectedGoal: goal,
      goalTitle: chosen.title,
      currentDay: 3,
      completedStepIds: chosen.steps.filter(s => s.completed).map(s => s.id),
      steps: chosen.steps,
      ahaMomentReached: completedCount >= 3,
      activationScore: Math.round((completedCount / chosen.steps.length) * 100),
    };
  }

  private resetDailyCountersIfNeeded() {
    const today = new Date().toISOString().split('T')[0];
    if (this.dailyCounters.date !== today) {
      this.dailyCounters = {
        date: today,
        aiTokens: 0,
        leads: 0,
        verifications: 0,
        pitches: 0,
        sampleMedia: 0,
      };
    }
  }

  public getMetrics(): CostControlMetrics {
    this.resetDailyCountersIfNeeded();

    const now = Date.now();
    const elapsedMs = now - this.trialStartDate.getTime();
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    
    const trialDaysRemaining = Math.max(0, this.trialDurationDays - elapsedDays);
    const isTrialActive = trialDaysRemaining > 0;
    
    const trialExpiresAt = new Date(this.trialStartDate.getTime() + this.trialDurationDays * 24 * 60 * 60 * 1000).toISOString();
    const preservationExpiresAt = new Date(new Date(trialExpiresAt).getTime() + this.preservationDurationDays * 24 * 60 * 60 * 1000).toISOString();

    const preservationRemainingMs = new Date(preservationExpiresAt).getTime() - now;
    const preservationDaysRemaining = Math.max(0, Math.ceil(preservationRemainingMs / (1000 * 60 * 60 * 24)));

    // Fair Use Status
    let fairUseStatus: 'OPTIMAL' | 'MODERATE' | 'NEAR_DAILY_CAP' | 'BYOK_UNLIMITED' = 'OPTIMAL';
    if (this.byokConfig.enabled && this.byokConfig.activeMode === 'BYOK_DIRECT') {
      fairUseStatus = 'BYOK_UNLIMITED';
    } else if (this.dailyCounters.aiTokens > 80000 || this.dailyCounters.leads > 400) {
      fairUseStatus = 'NEAR_DAILY_CAP';
    } else if (this.dailyCounters.aiTokens > 35000 || this.dailyCounters.leads > 150) {
      fairUseStatus = 'MODERATE';
    }

    const totalLeads = db.contacts.length + 180;
    const verified = db.contacts.filter(c => c.emailVerification?.status === 'VALID').length + 350;

    return {
      tier: 'TRIAL_SANDBOX',
      isTrialActive,
      trialDaysRemaining,
      trialStartedAt: this.trialStartDate.toISOString(),
      trialExpiresAt,
      preservationExpiresAt,
      preservationDaysRemaining,
      sampleModeActive: !this.byokConfig.enabled,
      fairUseStatus,
      dailyUsage: {
        aiTokensUsedToday: this.dailyCounters.aiTokens,
        aiTokensDailyLimit: this.byokConfig.enabled ? 1000000 : 100000,
        leadsDiscoveredToday: this.dailyCounters.leads,
        leadsDailyLimit: this.byokConfig.enabled ? 5000 : 500,
        emailsVerifiedToday: this.dailyCounters.verifications,
        emailsDailyLimit: this.byokConfig.enabled ? 10000 : 1000,
        pitchesDispatchedToday: this.dailyCounters.pitches,
        pitchesDailyLimit: this.byokConfig.enabled ? 5000 : 250,
        sampleMediaGeneratedToday: this.dailyCounters.sampleMedia,
        sampleMediaDailyLimit: this.byokConfig.enabled ? 100 : 10,
      },
      totalAccumulatedAssets: {
        leadsFound: totalLeads,
        verifiedEmails: verified,
        pitchesCrafted: 18,
        campaignsActive: db.campaigns.length || 3,
        crmContacts: db.contacts.length,
        smartInboxThreads: db.smartInboxThreads?.length || 8,
        attributedPipelineValue: 36800,
      },
      modelRouting: {
        cheapModel: 'gemini-2.5-flash-lite',
        midTierModel: 'gemini-2.5-flash',
        premiumModel: 'gemini-3.7-flash',
        currentRoutingMode: this.byokConfig.enabled ? 'BYOK_DIRECT' : 'AUTO_COST_OPTIMIZER',
      }
    };
  }

  /**
   * Evaluates cost and fair-use policy before dispatching an expensive operation.
   */
  public evaluateRequestCost(operation: 'AI_PITCH' | 'LEAD_SEARCH' | 'VERIFY_BULK' | 'SAMPLE_MEDIA' | 'MASS_DISPATCH', units: number = 1): {
    allowed: boolean;
    sampleModeApplied: boolean;
    message?: string;
  } {
    this.resetDailyCountersIfNeeded();

    if (this.byokConfig.enabled && this.byokConfig.activeMode === 'BYOK_DIRECT') {
      return { allowed: true, sampleModeApplied: false };
    }

    switch (operation) {
      case 'AI_PITCH':
        if (this.dailyCounters.aiTokens + units * 500 > 100000) {
          return {
            allowed: false,
            sampleModeApplied: false,
            message: "You've reached today's 14-Day Sandbox fair-use AI allowance. Switch to BYOK or continue tomorrow with preserved workspace."
          };
        }
        this.dailyCounters.aiTokens += units * 500;
        return { allowed: true, sampleModeApplied: false };

      case 'LEAD_SEARCH':
        if (this.dailyCounters.leads + units > 500) {
          return {
            allowed: true,
            sampleModeApplied: true,
            message: "High volume request: delivering top 50 high-precision verified prospects for trial preview."
          };
        }
        this.dailyCounters.leads += units;
        return { allowed: true, sampleModeApplied: false };

      case 'SAMPLE_MEDIA':
        this.dailyCounters.sampleMedia += 1;
        return {
          allowed: true,
          sampleModeApplied: true,
          message: "Sample Mode active: Generated high-fidelity 45s demo preview to showcase voice, animations, and conversion hooks."
        };

      default:
        return { allowed: true, sampleModeApplied: false };
    }
  }

  public updateBYOK(config: Partial<BYOKConfig>): BYOKConfig {
    this.byokConfig = {
      ...this.byokConfig,
      ...config,
      status: config.geminiApiKey || config.openaiApiKey ? 'CONNECTED' : 'NOT_CONFIGURED',
      lastTestedAt: new Date().toISOString(),
    };
    return this.byokConfig;
  }

  public completeWowJourneyStep(stepId: string): WowJourneyState {
    if (!this.wowJourney.completedStepIds.includes(stepId)) {
      this.wowJourney.completedStepIds.push(stepId);
    }
    this.wowJourney.steps = this.wowJourney.steps.map(s => s.id === stepId ? { ...s, completed: true } : s);
    const completedCount = this.wowJourney.steps.filter(s => s.completed).length;
    this.wowJourney.ahaMomentReached = completedCount >= 3;
    this.wowJourney.activationScore = Math.round((completedCount / this.wowJourney.steps.length) * 100);
    return this.wowJourney;
  }

  public setWowJourneyGoal(goal: WowJourneyGoal): WowJourneyState {
    this.wowJourney = this.initializeWowJourney(goal);
    return this.wowJourney;
  }
}

export const usageControl = new UsageControlEngine();
