import React, { useState } from 'react';
import { 
  Rocket, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Key, 
  Layers, 
  CheckCircle,
  PlayCircle,
  Crown,
  CreditCard,
  X
} from 'lucide-react';
import { CostControlMetrics, BYOKConfig, WowJourneyState, User as UserType } from '../types.js';
import { isPlatformOwner } from '../lib/firebase.js';

interface SandboxTopBannerProps {
  metrics: CostControlMetrics;
  byok: BYOKConfig;
  wowJourney: WowJourneyState;
  currentUser?: UserType;
  onOpenWowJourney: () => void;
  onOpenPreservationModal: () => void;
  onOpenBYOKSettings: () => void;
  onOpenSampleStudio: () => void;
  onOpenPricing?: () => void;
  onOpenDemoTutorial?: () => void;
}

export const SandboxTopBanner: React.FC<SandboxTopBannerProps> = ({
  metrics,
  byok,
  wowJourney,
  currentUser,
  onOpenWowJourney,
  onOpenPreservationModal,
  onOpenBYOKSettings,
  onOpenSampleStudio,
  onOpenPricing,
  onOpenDemoTutorial,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const completedCount = wowJourney.steps.filter(s => s.completed).length;
  const totalSteps = wowJourney.steps.length;
  const isOwner = isPlatformOwner(currentUser?.email);

  if (isDismissed) return null;

  if (isOwner) {
    return (
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/30 text-white px-3 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px]">
              <Crown className="h-3 w-3 text-amber-400" />
              VIP Owner
            </span>
            <span className="text-slate-300 truncate text-[11px]">
              <strong>{currentUser?.email}</strong> • Unlimited Lifetime Free Plan
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenPricing && (
              <button
                id="banner-owner-pricing-btn"
                onClick={onOpenPricing}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-semibold"
              >
                <CreditCard className="h-3 w-3 text-amber-300" />
                <span className="hidden sm:inline">Pricing</span>
              </button>
            )}

            <button
              id="banner-owner-byok-btn"
              onClick={onOpenBYOKSettings}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
            >
              <Key className="h-3 w-3 text-amber-400" />
              <span>BYOK</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Dismiss announcement"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/20 text-white px-3 py-1.5 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Trial / Sandbox Status */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-[10px]">
            <Rocket className="h-2.5 w-2.5 text-indigo-400" />
            14d Trial
          </span>

          <span className="text-slate-300 text-[11px] truncate">
            <strong>Day {14 - metrics.trialDaysRemaining || 3} of 14</strong> • Zero Cost Sandbox
          </span>
        </div>

        {/* Right: Quick Action Hub */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Wow Journey Button */}
          <button
            id="banner-wow-journey-btn"
            onClick={onOpenWowJourney}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-[11px]"
          >
            <Sparkles className="h-2.5 w-2.5 text-indigo-300" />
            <span>Journey ({completedCount}/{totalSteps})</span>
          </button>

          {/* Sample Mode Pitch Generator */}
          <button
            id="banner-sample-studio-btn"
            onClick={onOpenSampleStudio}
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 text-[11px]"
          >
            <PlayCircle className="h-2.5 w-2.5 text-purple-300" />
            <span>Sample Pitch</span>
          </button>

          {/* Preservation Modal Trigger */}
          <button
            id="banner-my-work-waiting-btn"
            onClick={onOpenPreservationModal}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 text-white font-bold text-[11px] shadow-xs"
          >
            <Layers className="h-3 w-3" />
            <span>Preserve Work</span>
            <ArrowRight className="h-2.5 w-2.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Dismiss announcement"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
