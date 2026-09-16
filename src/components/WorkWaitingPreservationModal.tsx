import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Clock, 
  ArrowRight, 
  Key, 
  CreditCard,
  Users,
  Mail,
  Zap,
  DollarSign
} from 'lucide-react';
import { CostControlMetrics, BYOKConfig, CurrencyCode } from '../types.js';
import { formatCurrency } from '../utils/formatters.js';

interface WorkWaitingPreservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CostControlMetrics;
  byok: BYOKConfig;
  currency: CurrencyCode;
  onSelectPlan: (planId: string) => void;
  onOpenBYOK: () => void;
}

export const WorkWaitingPreservationModal: React.FC<WorkWaitingPreservationModalProps> = ({
  isOpen,
  onClose,
  metrics,
  byok,
  currency,
  onSelectPlan,
  onOpenBYOK,
}) => {
  if (!isOpen) return null;

  const [selectedPlanId, setSelectedPlanId] = useState<string>('PRO');

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      priceUsd: 19,
      period: 'per month',
      description: 'Ideal for solo founders, creators & consultants launching their first outbound engine.',
      features: [
        '1,000 Verified Leads / month',
        '2,500 Zero-Bounce Verifications',
        'AI Email & Pitch Generator',
        'Single Mailbox & Deliverability Shield',
        'Standard CRM & Contact 360',
      ],
      popular: false,
    },
    {
      id: 'PRO',
      name: 'Professional',
      priceUsd: 49,
      period: 'per month',
      description: 'For serious marketers & high-growth sales teams running multi-channel outbound.',
      features: [
        '5,000 Verified Leads / month',
        '15,000 Zero-Bounce Verifications',
        '2k–5k Mass Pitch Dispatcher',
        '4D AI Intent Scoring & Signals Radar',
        'AI Smart Inbox Auto-Replies',
        'Full Revenue Attribution Funnels',
      ],
      popular: true,
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      priceUsd: 99,
      period: 'per month',
      description: 'For businesses scaling multi-channel email, WhatsApp Cloud API & CRM automations.',
      features: [
        '15,000 Verified Leads / month',
        '50,000 Zero-Bounce Verifications',
        'Live WhatsApp Business Cloud API',
        'Automated Inbound Webhooks',
        'Visual Automation Workflow Canvas',
        'Team RBAC & Multi-Seat Access',
      ],
      popular: false,
    },
    {
      id: 'AGENCY',
      name: 'Agency / Enterprise',
      priceUsd: 249,
      period: 'per month',
      description: 'For marketing agencies managing multiple clients with custom branding & white-label.',
      features: [
        '50,000+ Verified Leads / month',
        'Unlimited Zero-Bounce Verifications',
        'Unlimited Client Workspaces',
        'White-Label Portals & Custom Domains',
        'BYOK Zero-Markup Unlimited Routing',
        'Dedicated Revenue Strategist Support',
      ],
      popular: false,
    },
  ];

  const handleContinueWork = () => {
    onSelectPlan(selectedPlanId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white overflow-hidden border-b border-indigo-500/20">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                <span>14-Day Sandbox Experience • 30-Day Preservation Policy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My Work Is Waiting
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                You’ve created real revenue assets during your 14-day experience. Your entire contact list, customized pitches, sequences, and pipeline are preserved safely in the cloud for 30 days.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Accumulated Assets Snapshot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Leads Found</span>
              <span className="text-base font-bold text-white mt-0.5 block">{metrics.totalAccumulatedAssets.leadsFound}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Emails</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">{metrics.totalAccumulatedAssets.verifiedEmails}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Pitches</span>
              <span className="text-base font-bold text-indigo-300 mt-0.5 block">{metrics.totalAccumulatedAssets.pitchesCrafted}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Campaigns</span>
              <span className="text-base font-bold text-white mt-0.5 block">{metrics.totalAccumulatedAssets.campaignsActive}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Smart Inbox</span>
              <span className="text-base font-bold text-amber-300 mt-0.5 block">{metrics.totalAccumulatedAssets.smartInboxThreads}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pipeline Value</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">{formatCurrency(metrics.totalAccumulatedAssets.attributedPipelineValue, currency)}</span>
            </div>
          </div>
        </div>

        {/* Modal Body: Pricing Tier Selector & BYOK Switch */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Select Your Plan to Continue Without Interruption
              </h3>
              <p className="text-xs text-slate-500">
                Cancel anytime. 100% money-back guarantee. No hidden charges.
              </p>
            </div>

            {/* BYOK Option Banner */}
            <button
              onClick={() => {
                onOpenBYOK();
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all self-start sm:self-auto"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Or Bring Your Own API (BYOK) for Zero Markup</span>
            </button>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => {
              const isSelected = selectedPlanId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md scale-[1.02]'
                      : 'bg-white/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.name}</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                        {formatCurrency(p.priceUsd, currency)}
                      </span>
                      <span className="text-[11px] text-slate-500">/{p.period}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3">
                    <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {isSelected ? 'Selected' : 'Choose Plan'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Conversion Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>30-Day Money-Back Guarantee • 256-Bit Encrypted Payments</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Continue In Free Sandbox
            </button>

            <button
              id="continue-work-activate-btn"
              onClick={handleContinueWork}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Continue My Work & Activate Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
