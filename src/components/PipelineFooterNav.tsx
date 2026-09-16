import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { PIPELINE_STEPS } from './PipelineNavigation.js';

interface PipelineFooterNavProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
}

export const PipelineFooterNav: React.FC<PipelineFooterNavProps> = ({
  currentTab,
  onNavigateTab,
}) => {
  const currentIndex = PIPELINE_STEPS.findIndex(s => s.id === currentTab);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  const prevStep = safeIndex > 0 ? PIPELINE_STEPS[safeIndex - 1] : null;
  const nextStep = safeIndex < PIPELINE_STEPS.length - 1 ? PIPELINE_STEPS[safeIndex + 1] : null;
  const currentStep = PIPELINE_STEPS[safeIndex];

  return (
    <div className="mt-12 pt-6 pb-12 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto px-6">
      {/* Previous Action */}
      <div>
        {prevStep ? (
          <button
            id={`footer-prev-btn-${prevStep.id}`}
            onClick={() => onNavigateTab(prevStep.id)}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
          >
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400">Previous Stage</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{prevStep.name}</p>
            </div>
          </button>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
            <span>Revenue OS Entry: {currentStep.name}</span>
          </div>
        )}
      </div>

      {/* Stage Tracker Pill */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        <span>Step {safeIndex + 1} of {PIPELINE_STEPS.length}:</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{currentStep.name}</span>
      </div>

      {/* Next Action */}
      <div>
        {nextStep ? (
          <button
            id={`footer-next-btn-${nextStep.id}`}
            onClick={() => onNavigateTab(nextStep.id)}
            className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-600/20"
          >
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-indigo-200">Next Stage in Funnel</p>
              <p className="font-bold text-white">{nextStep.name}</p>
            </div>
            <div className="p-1.5 rounded-lg bg-white/20 text-white group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        ) : (
          <button
            id="footer-back-radar-btn"
            onClick={() => onNavigateTab('dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <span>Back to Command Radar</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </button>
        )}
      </div>
    </div>
  );
};
