import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Mail, 
  Users, 
  Layers,
  Award,
  Zap
} from 'lucide-react';
import { WowJourneyState, WowJourneyGoal, WowJourneyStep } from '../types.js';

interface WowJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wowJourney: WowJourneyState;
  onSelectGoal: (goal: WowJourneyGoal) => void;
  onCompleteStep: (stepId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const WowJourneyModal: React.FC<WowJourneyModalProps> = ({
  isOpen,
  onClose,
  wowJourney,
  onSelectGoal,
  onCompleteStep,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  const [activeGoal, setActiveGoal] = useState<WowJourneyGoal>(wowJourney.selectedGoal);

  const goalOptions: Array<{ id: WowJourneyGoal; label: string; icon: any; desc: string }> = [
    { 
      id: 'GROW_BUSINESS', 
      label: 'Grow My Business', 
      icon: TrendingUp, 
      desc: 'Complete full-funnel roadmap: Lead finding, deliverability, AI pitches & closed-loop revenue.' 
    },
    { 
      id: 'FIND_CUSTOMERS', 
      label: 'Find High-Value Customers', 
      icon: Users, 
      desc: 'Discover verified ICP decision-makers, enrich with 4D AI scoring, and monitor Intent Radar.' 
    },
    { 
      id: 'MASS_OUTREACH', 
      label: 'Mass Pitch 2k–5k at Once', 
      icon: Mail, 
      desc: 'Scout thousands of buyers, run spam auditor, and dispatch ramped outreach with zero-bounce shield.' 
    },
    { 
      id: 'REVENUE_AUTOMATION', 
      label: 'Autonomous Revenue Operations', 
      icon: Zap, 
      desc: 'Connect live WhatsApp/Gmail webhooks, automate sequences, and activate AI Smart Inbox.' 
    },
    { 
      id: 'CONTENT_MEDIA', 
      label: 'Pitch Copy & Media Lab', 
      icon: Layers, 
      desc: 'Craft multi-variate high-converting hooks and test Sample Mode 45s audio/video pitch demos.' 
    },
  ];

  const handleGoalChange = (newGoal: WowJourneyGoal) => {
    setActiveGoal(newGoal);
    onSelectGoal(newGoal);
  };

  const handleActionClick = (step: WowJourneyStep) => {
    onCompleteStep(step.id);
    onNavigateToTab(step.targetTab);
    onClose();
  };

  const completedCount = wowJourney.steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / wowJourney.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Welcome to Your 14-Day Wow Journey
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Don't just look at a blank dashboard. Follow your guided playbook to launch real campaigns, verify inboxes, and reach your first revenue win.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Goal Selector Chips */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            What is your primary revenue goal?
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {goalOptions.map((g) => {
              const Icon = g.icon;
              const isSelected = activeGoal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => handleGoalChange(g.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body & Step List */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Activation & Aha Moment Progress Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Activation Score: {progressPercent}% ({completedCount}/{wowJourney.steps.length} Steps Completed)
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {wowJourney.ahaMomentReached 
                  ? '🎉 Aha! Moment Reached: You have created 3+ live revenue assets in your sandbox!'
                  : 'Complete 3 steps to reach your initial activation threshold and test live outreach.'}
              </p>
            </div>

            <div className="w-full sm:w-48 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Playbook Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {wowJourney.goalTitle} — Daily Action Checklist
            </h3>

            <div className="space-y-2.5">
              {wowJourney.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    step.completed
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onCompleteStep(step.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                      title={step.completed ? 'Completed' : 'Click to toggle completion'}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          Day {step.day || idx + 1}
                        </span>
                        <h4 className={`text-xs font-bold ${step.completed ? 'text-slate-900 dark:text-slate-100 line-through opacity-80' : 'text-slate-900 dark:text-slate-100'}`}>
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                      {step.impactMetric}
                    </span>

                    <button
                      id={`wow-step-btn-${step.id}`}
                      onClick={() => handleActionClick(step)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 whitespace-nowrap"
                    >
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
          <span>Your 14-day progress and created assets are preserved automatically in the cloud.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Continue Sandbox Work
          </button>
        </div>
      </div>
    </div>
  );
};
