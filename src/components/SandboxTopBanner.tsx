import React from 'react';
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
  CreditCard
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
  const completedCount = wowJourney.steps.filter(s => s.completed).length;
  const totalSteps = wowJourney.steps.length;
  const isOwner = isPlatformOwner(currentUser?.email);

  if (isOwner) {
    return (
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/30 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px]">
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              Platform Owner VIP Access
            </span>
            <span className="text-slate-300">
              <strong>{currentUser?.email}</strong> • 100% Free Lifetime Unlimited Plan
            </span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="hidden lg:inline text-emerald-400 font-medium">
              Zero Cost • Unlimited Discovery & Verifications
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenPricing && (
              <button
                id="banner-owner-pricing-btn"
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 transition-all font-semibold"
              >
                <CreditCard className="h-3.5 w-3.5 text-amber-300" />
                <span>View All Pricing Tiers</span>
              </button>
            )}

            <button
              id="banner-owner-byok-btn"
              onClick={onOpenBYOKSettings}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all font-medium"
            >
              <Key className="h-3 w-3 text-amber-400" />
              <span>BYOK Engine</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/20 text-white px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Trial / Sandbox Status */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-[11px]">
            <Rocket className="h-3 w-3 text-indigo-400" />
            14-Day Free Access Trial
          </span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>
              <strong>Day {14 - metrics.trialDaysRemaining || 3} of 14</strong> • Zero Cost • No Credit Card
            </span>
          </div>

          <span className="hidden lg:inline text-slate-500">•</span>

          <div className="hidden lg:flex items-center gap-1 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero Token Drain on Owner (BYOK Ready)</span>
          </div>
        </div>

        {/* Right: Quick Action Hub */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pricing Tiers Button */}
          {onOpenPricing && (
            <button
              id="banner-pricing-btn"
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 transition-all font-semibold"
            >
              <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
              <span>Pricing Tiers</span>
            </button>
          )}

          {/* Wow Journey Button */}
          <button
            id="banner-wow-journey-btn"
            onClick={onOpenWowJourney}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 transition-all font-medium"
          >
            <Sparkles className="h-3 w-3 text-indigo-300" />
            <span>Wow Journey ({completedCount}/{totalSteps})</span>
          </button>

          {/* Sample Mode Pitch Generator */}
          <button
            id="banner-sample-studio-btn"
            onClick={onOpenSampleStudio}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 transition-all font-medium"
          >
            <PlayCircle className="h-3 w-3 text-purple-300" />
            <span>Sample Pitch Preview</span>
          </button>

          {/* BYOK Status Toggle */}
          <button
            id="banner-byok-btn"
            onClick={onOpenBYOKSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all font-medium ${
              byok.enabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Key className="h-3 w-3 text-amber-400" />
            <span>{byok.enabled ? 'BYOK Direct (Active)' : 'Connect BYOK Key'}</span>
          </button>

          {/* My Work Is Waiting / Conversion Trigger */}
          <button
            id="banner-my-work-waiting-btn"
            onClick={onOpenPreservationModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-xs transition-all hover:scale-[1.02]"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>My Work Is Waiting</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
