import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Crown, 
  CreditCard, 
  LogIn, 
  RefreshCw, 
  Zap, 
  Radio, 
  ShieldCheck, 
  FileCheck, 
  Users, 
  Send, 
  Inbox, 
  Webhook, 
  GitFork, 
  TrendingUp, 
  MailCheck, 
  Layers, 
  Settings, 
  Check, 
  Cloud,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { CurrencyCode, Organization, User as UserType, UserRole, CostControlMetrics } from '../types.js';
import { isPlatformOwner } from '../lib/firebase.js';
import { PIPELINE_STEPS, PipelineStep } from './PipelineNavigation.js';

interface FigmaAppHeaderProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  organization: Organization;
  user: UserType;
  userRole: UserRole;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onOpenAICommand: () => void;
  isCopilotOpen: boolean;
  onToggleCopilot: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenDemoTutorial?: () => void;
  onOpenPricing?: () => void;
  onOpenAuthModal: () => void;
  onOpenPreservationModal?: () => void;
  onOpenWowJourney?: () => void;
  costMetrics?: CostControlMetrics;
}

const WORKFLOW_PILLARS = [
  { id: 'discover', label: '1. Discover', targetTab: 'discover', description: 'Radar, Signals & 50k Miner' },
  { id: 'verify', label: '2. Verify', targetTab: 'verify', description: 'Zero-Bounce & Anti-Spam' },
  { id: 'crm', label: '3. Pipeline', targetTab: 'crm', description: 'Contacts, Scoring & Inbox' },
  { id: 'campaigns', label: '4. Engage', targetTab: 'campaigns', description: 'Sequences & Mass Pitch' },
  { id: 'attribution', label: '5. ROI', targetTab: 'attribution', description: 'Closed-Loop Revenue' },
];

export const FigmaAppHeader: React.FC<FigmaAppHeaderProps> = ({
  currentTab,
  onNavigateTab,
  organization,
  user,
  userRole,
  currency,
  onChangeCurrency,
  onOpenAICommand,
  isCopilotOpen,
  onToggleCopilot,
  onRefresh,
  isRefreshing,
  onOpenDemoTutorial,
  onOpenPricing,
  onOpenAuthModal,
  onOpenPreservationModal,
  onOpenWowJourney,
  costMetrics,
}) => {
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOwner = isPlatformOwner(user.email);

  const currentIndex = PIPELINE_STEPS.findIndex(s => s.id === currentTab);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentStep = PIPELINE_STEPS[safeIndex];
  const prevStep = safeIndex > 0 ? PIPELINE_STEPS[safeIndex - 1] : null;
  const nextStep = safeIndex < PIPELINE_STEPS.length - 1 ? PIPELINE_STEPS[safeIndex + 1] : null;

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsStageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-30 select-none shadow-xs">
      {/* Primary Top Bar (50px) */}
      <div className="h-12 px-3 sm:px-4 flex items-center justify-between gap-3">
        {/* Left: Breadcrumb & Stage Selector */}
        <div className="flex items-center gap-2 relative min-w-0" ref={menuRef}>
          {/* Previous / Next Chevrons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => prevStep && onNavigateTab(prevStep.id)}
              disabled={!prevStep}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              title={prevStep ? `Go to Previous: ${prevStep.name} (Alt+Left)` : 'First Step'}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => nextStep && onNavigateTab(nextStep.id)}
              disabled={!nextStep}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              title={nextStep ? `Go to Next: ${nextStep.name} (Alt+Right)` : 'End of Pipeline'}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Breadcrumb Stage Button */}
          <button
            onClick={() => setIsStageMenuOpen(!isStageMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200 group text-left max-w-[200px] sm:max-w-xs"
          >
            <span className="text-slate-400 font-medium hidden md:inline">Workspace /</span>
            <span className="truncate">{currentStep?.name || 'Workspace'}</span>
            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isStageMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Stage Menu Popover */}
          {isStageMenuOpen && (
            <div className="absolute top-11 left-0 w-80 max-h-[80vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in-50 zoom-in-95">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <span>Pipeline Architecture (16 Stages)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{safeIndex + 1}/16</span>
              </div>
              <div className="space-y-0.5 pt-1">
                {PIPELINE_STEPS.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = step.id === currentTab;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        onNavigateTab(step.id);
                        setIsStageMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <StepIcon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <div className="text-left truncate">
                          <p className="font-semibold leading-tight truncate">{step.name}</p>
                          <p className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{step.category}</p>
                        </div>
                      </div>
                      {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Center: Search & AI Copilot Trigger */}
        <div className="flex items-center gap-2 max-w-md w-full justify-center">
          {/* Quick Search & AI Command Trigger */}
          <button
            onClick={onOpenAICommand}
            className="hidden sm:flex items-center justify-between px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 hover:border-indigo-500/50 hover:text-slate-600 dark:hover:text-slate-200 transition-all w-48 md:w-56"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Search className="h-3 w-3" />
              <span className="truncate">Search or Ask AI...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1 py-0.2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* AI Copilot Toggle Button */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-xs border ${
              isCopilotOpen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20'
                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100'
            }`}
            title="Toggle Natural Language AI Copilot (⌘J)"
          >
            <Sparkles className={`h-3 w-3 ${isCopilotOpen ? 'animate-spin text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
            <span>AI Copilot</span>
            <kbd className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
              isCopilotOpen ? 'bg-indigo-700 border-indigo-400 text-white' : 'bg-white dark:bg-slate-800 border-indigo-200 text-indigo-500'
            }`}>
              ⌘J
            </kbd>
          </button>
        </div>

        {/* Right: Cloud Sync, Deliverability, Currency, Refresh & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cloud Sync Indicator */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium border border-emerald-500/20" title="Connected to Google Cloud Firestore">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firestore Live</span>
          </div>

          {/* Deliverability Badge */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-800" title="Zero-bounce mail server validation active">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>99.6% Zero Bounce</span>
          </div>

          {/* VIP / Sandbox Pill */}
          {isOwner ? (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/30">
              <Crown className="h-3 w-3 text-amber-500" />
              <span>Owner VIP</span>
            </span>
          ) : (
            <button
              onClick={onOpenPreservationModal || onOpenPricing}
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
              title="14-Day Free Access Trial"
            >
              <Zap className="h-2.5 w-2.5" />
              <span>14d Trial</span>
            </button>
          )}

          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
            {(['USD', 'NGN', 'GBP', 'EUR'] as CurrencyCode[]).map((curr) => (
              <button
                key={curr}
                onClick={() => onChangeCurrency(curr)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  currency === curr
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {curr === 'USD' ? '$' : curr === 'NGN' ? '₦' : curr === 'GBP' ? '£' : '€'}
              </button>
            ))}
          </div>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Refresh All Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
          </button>

          {/* User Account / Sign In */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
            title="Account & Auth Settings"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-6 w-6 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs ${
                isOwner ? 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
              }`}>
                {isOwner ? <Crown className="h-3.5 w-3.5 text-slate-950" /> : user.fullName.charAt(0)}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Low-Profile Contextual Stage Ribbon (34px) */}
      <div className="h-9 px-3 sm:px-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 text-xs">
        {/* Left: Stage Index & Category */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Stage {safeIndex + 1}/16:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">
            {currentStep?.name}
          </span>
          <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
            {currentStep?.category}
          </span>
        </div>

        {/* Center: 5 Core Workflow Pillars */}
        <div className="hidden md:flex items-center gap-1">
          {WORKFLOW_PILLARS.map((pillar) => {
            const isActive = 
              (pillar.id === 'discover' && ['dashboard', 'signals', 'discover', 'masspitch'].includes(currentTab)) ||
              (pillar.id === 'verify' && ['verify', 'spamaudit', 'deliverability'].includes(currentTab)) ||
              (pillar.id === 'crm' && ['crm', 'inbox', 'webhooks'].includes(currentTab)) ||
              (pillar.id === 'campaigns' && ['campaigns', 'automations', 'landing_pages'].includes(currentTab)) ||
              (pillar.id === 'attribution' && ['attribution', 'pricing', 'billing', 'settings'].includes(currentTab));

            return (
              <button
                key={pillar.id}
                onClick={() => onNavigateTab(pillar.targetTab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                }`}
              >
                {pillar.label}
              </button>
            );
          })}
        </div>

        {/* Right: Next Step Quick Action */}
        <div className="flex items-center gap-1.5 shrink-0">
          {nextStep ? (
            <button
              onClick={() => onNavigateTab(nextStep.id)}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <span>Next: {nextStep.name}</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <span>Back to Radar</span>
              <Sparkles className="h-3 w-3 text-amber-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
