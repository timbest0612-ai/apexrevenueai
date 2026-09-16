import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Building2, 
  UserCheck, 
  Layers, 
  ArrowRight, 
  Check, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Search, 
  Filter,
  DollarSign,
  Briefcase,
  Globe,
  ExternalLink,
  Code
} from 'lucide-react';
import { IntentSignalEvent, CurrencyCode } from '../types.js';

interface SignalRadarViewProps {
  currency: CurrencyCode;
  onNavigateTab: (tab: string) => void;
  onEnrollLeadInCampaign?: (leadEmail: string, campaignId?: string) => void;
}

export const SignalRadarView: React.FC<SignalRadarViewProps> = ({
  currency,
  onNavigateTab,
  onEnrollLeadInCampaign,
}) => {
  const [signals, setSignals] = useState<IntentSignalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/signals');
      const data = await res.json();
      if (data.success && data.signals) {
        setSignals(data.signals);
      }
    } catch (err) {
      console.error('Failed to fetch intent signals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleActionSignal = async (signal: IntentSignalEvent) => {
    setActioningId(signal.id);
    try {
      const res = await fetch(`/api/v1/signals/${signal.id}/action`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setSignals(prev => prev.map(s => s.id === signal.id ? { ...s, status: 'ACTIONED' } : s));
        if (onEnrollLeadInCampaign && signal.contactLead) {
          onEnrollLeadInCampaign(signal.contactLead.email, signal.recommendedCampaignId);
        }
      }
    } catch (err) {
      console.error('Failed to action signal:', err);
    } finally {
      setActioningId(null);
    }
  };

  const filteredSignals = signals.filter(s => {
    if (filterType === 'ALL') return true;
    return s.type === filterType;
  });

  const getSignalBadge = (type: string) => {
    switch (type) {
      case 'EXECUTIVE_HIRE':
        return { label: 'Exec Hire', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', icon: Briefcase };
      case 'TECH_STACK_DETECTED':
        return { label: 'Tech Stack Shift', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: Code };
      case 'FUNDING_ROUND':
        return { label: 'Funding Closed', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: DollarSign };
      case 'WEBSITE_INTENT_SURGE':
        return { label: 'Pricing Surge', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', icon: Flame };
      default:
        return { label: 'Intent Signal', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', icon: Zap };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white border border-indigo-500/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/30 flex items-center justify-center border border-indigo-400/40">
              <Radio className="h-4 w-4 text-indigo-300 animate-pulse" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Real-Time Signal Engine
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Signal-Based Buying Intent Radar</h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Detects high-propensity buying triggers (Executive Hires, Tech Stack Installations, Series A Funding, Website Deanonymized IP Surges) to engage target accounts at peak decision moments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSignals}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>Scan Signals</span>
            <Zap className="h-3.5 w-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => onNavigateTab('campaigns')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Automate Signal Triggers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Signal Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Live Account Signals</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{signals.length}</p>
          <p className="text-[11px] text-emerald-500 font-medium mt-0.5">Scanned across 4,850 companies</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Intent Boost</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">+36.5 pts</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Surging CRM score priority</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">High Confidence Rate</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">95.4%</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Verified across 3+ data feeds</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Response Velocity</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">3.4x</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Higher meeting booking rate</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'All Signals' },
          { id: 'EXECUTIVE_HIRE', label: '👔 Exec Hires' },
          { id: 'TECH_STACK_DETECTED', label: '⚡ Tech Stack Shifts' },
          { id: 'FUNDING_ROUND', label: '💰 Funding Rounds' },
          { id: 'WEBSITE_INTENT_SURGE', label: '🔥 Website Surges' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Signals Feed List */}
      <div className="space-y-3.5">
        {filteredSignals.map(sig => {
          const badge = getSignalBadge(sig.type);
          const BadgeIcon = badge.icon;
          return (
            <div
              key={sig.id}
              className={`p-5 rounded-xl border bg-white dark:bg-slate-900 transition-all ${
                sig.status === 'ACTIONED'
                  ? 'border-slate-200 dark:border-slate-800 opacity-70'
                  : 'border-indigo-500/30 dark:border-indigo-500/20 shadow-xs hover:border-indigo-500/50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                      <BadgeIcon className="h-3 w-3" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {sig.companyName}
                    </span>

                    <span className="text-[11px] text-slate-400">({sig.companyDomain})</span>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto lg:ml-2">
                      <Clock className="h-3 w-3" />
                      {sig.detectedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{sig.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{sig.description}</p>

                  {/* Decision Maker Contact Card */}
                  {sig.contactLead && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                          {sig.contactLead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{sig.contactLead.name}</p>
                          <p className="text-[11px] text-slate-500">{sig.contactLead.jobTitle} • <span className="text-indigo-600 dark:text-indigo-400 font-mono">{sig.contactLead.email}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          +{sig.intentScoreBoost} Intent Boost
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                          {sig.confidence}% Confidence
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Action Box */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-5 shrink-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Recommended Action</p>
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">{sig.recommendedAction}</p>
                  </div>

                  {sig.status === 'ACTIONED' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20">
                      <Check className="h-3.5 w-3.5" />
                      <span>Trigger Dispatched</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleActionSignal(sig)}
                      disabled={actioningId === sig.id}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      {actioningId === sig.id ? (
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          <span>Dispatch AI Outreach</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
