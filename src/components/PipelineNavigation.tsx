import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Users, 
  Send, 
  GitFork, 
  TrendingUp, 
  MailCheck, 
  Layers, 
  CreditCard, 
  Settings,
  ArrowRight,
  ArrowLeft,
  Radio,
  Inbox,
  FileCheck,
  Zap,
  Globe,
  Webhook,
  Gem,
  Briefcase,
  Swords
} from 'lucide-react';

export interface PipelineStep {
  id: string;
  name: string;
  stageName: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'dashboard', name: 'Command & Radar', stageName: '01. RADAR', category: 'Overview', icon: Sparkles, description: 'Live revenue pulse, AI signals & priority actions' },
  { id: 'signals', name: 'Signal Intent Radar', stageName: '02. SIGNALS', category: 'Triggers', icon: Radio, description: 'Track Exec Hires, Tech Stack Shifts & Funding' },
  { id: 'discover', name: 'Global Lead Finder', stageName: '03. FIND', category: 'Intelligence', icon: Search, description: 'Pluggable multi-provider B2B lead discovery' },
  { id: 'masspitch', name: 'Global Mass Pitch (2k-5k)', stageName: '04. MASS BLAST', category: 'High-Volume', icon: Zap, description: 'Send 1 personalized pitch to 2,000–5,000+ clients at once' },
  { id: 'verify', name: 'Verification Lab', stageName: '05. VERIFY', category: 'Deliverability', icon: ShieldCheck, description: 'Multi-layer MX, DNS & SMTP zero-bounce validation' },
  { id: 'spamaudit', name: 'AI Spam Auditor', stageName: '06. AUDIT', category: 'Deliverability', icon: FileCheck, description: 'Scan spam trigger words & optimize reading level' },
  { id: 'crm', name: 'CRM & Contact 360', stageName: '07. CRM & SCORE', category: 'Pipeline', icon: Users, description: '4D AI scoring matrix (Fit, Intent, Value, Stage)' },
  { id: 'campaigns', name: 'Campaign Studio', stageName: '08. ENGAGE', category: 'Outreach', icon: Send, description: 'Multi-channel email & WhatsApp sequences' },
  { id: 'inbox', name: 'AI Smart Inbox', stageName: '09. INBOX', category: 'Replies', icon: Inbox, description: 'Omnichannel reply triage & 1-click AI replies' },
  { id: 'webhooks', name: 'Webhooks & Cloud Sync', stageName: '10. WEBHOOKS', category: 'Ingestion', icon: Webhook, description: 'Live WhatsApp, Gmail, Outlook webhook sync & Firestore' },
  { id: 'automations', name: 'Sequences & Flows', stageName: '11. AUTOMATE', category: 'Automation', icon: GitFork, description: 'Visual event-driven branching canvas' },
  { id: 'attribution', name: 'Revenue Attribution', stageName: '12. ATTRIBUTE', category: 'Analytics', icon: TrendingUp, description: 'Closed-loop ROI & multi-touch channel revenue' },
  { id: 'offer_matrix', name: 'Grand Slam Offer Studio', stageName: '13. OFFER ARCH', category: 'Conversion', icon: Gem, description: '$100M Value equation, order bumps & risk-reversal guarantees' },
  { id: 'deal_room', name: 'Buyer Deal Room & MAP', stageName: '14. DEAL ROOM', category: 'Closing', icon: Briefcase, description: 'Digital sales room, buyer COI & Mutual Action Plan' },
  { id: 'objections', name: 'Objection Decimator', stageName: '15. BATTLECARDS', category: 'Objections', icon: Swords, description: 'Psychological reframes & competitor flanking scripts' },
  { id: 'deliverability', name: 'DNS & Deliverability', stageName: '16. INFRA', category: 'Infrastructure', icon: MailCheck, description: 'SPF, DKIM, DMARC & domain warmup monitor' },
  { id: 'landing_pages', name: 'Landing Pages & Forms', stageName: '17. CONVERT', category: 'Acquisition', icon: Layers, description: 'High-converting capture funnels & lead magnets' },
  { id: 'billing', name: 'Plans & Credits', stageName: '18. USAGE', category: 'Account', icon: CreditCard, description: 'Manage quotas, credit top-ups & tiers' },
  { id: 'settings', name: 'Workspace Settings', stageName: '19. CONFIG', category: 'System', icon: Settings, description: 'API integrations, webhook dispatch & team roles' },
];

interface PipelineNavigationProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
}

export const PipelineNavigation: React.FC<PipelineNavigationProps> = ({
  currentTab,
  onNavigateTab,
}) => {
  const currentIndex = PIPELINE_STEPS.findIndex(s => s.id === currentTab);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  
  const prevStep = safeIndex > 0 ? PIPELINE_STEPS[safeIndex - 1] : null;
  const nextStep = safeIndex < PIPELINE_STEPS.length - 1 ? PIPELINE_STEPS[safeIndex + 1] : null;
  const currentStep = PIPELINE_STEPS[safeIndex];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-xs sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Previous Button */}
        <div className="flex items-center gap-2">
          {prevStep ? (
            <button
              id="pipeline-prev-btn"
              onClick={() => onNavigateTab(prevStep.id)}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
              title={`Move to Previous: ${prevStep.name} (Alt+Left)`}
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Previous Step</span>
                <span className="truncate max-w-[130px] inline-block">{prevStep.name}</span>
              </div>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-lg border border-transparent text-xs text-slate-300 dark:text-slate-700 select-none flex items-center gap-1.5">
              <ChevronLeft className="h-4 w-4 opacity-40" />
              <span className="text-[11px] font-medium">Start of Pipeline</span>
            </div>
          )}
        </div>

        {/* Current Step Tracker & Stepper Breadcrumbs */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 scrollbar-none">
          {PIPELINE_STEPS.slice(0, 9).map((step, idx) => {
            const isActive = step.id === currentTab;
            const isPassed = idx < safeIndex;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                id={`pipeline-step-pill-${step.id}`}
                onClick={() => onNavigateTab(step.id)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/20'
                    : isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={`${step.stageName}: ${step.description}`}
              >
                <StepIcon className={`h-3 w-3 ${isActive ? 'text-white' : isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-[11px] font-medium hidden xl:inline">{step.name}</span>
                <span className="text-[10px] font-bold xl:hidden">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <div className="flex items-center justify-end gap-2">
          {nextStep ? (
            <button
              id="pipeline-next-btn"
              onClick={() => onNavigateTab(nextStep.id)}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/70 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-xs font-semibold text-indigo-950 dark:text-indigo-200 transition-all shadow-xs"
              title={`Move to Next: ${nextStep.name} (Alt+Right)`}
            >
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 block leading-tight">Next Step</span>
                <span className="truncate max-w-[130px] inline-block">{nextStep.name}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              id="pipeline-restart-btn"
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <span>Back to Radar</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
