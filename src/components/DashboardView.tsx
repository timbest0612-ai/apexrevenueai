import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  Mail, 
  ArrowUpRight, 
  Users, 
  Zap, 
  Radio, 
  ShoppingCart, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  Send,
  Building,
  DollarSign
} from 'lucide-react';
import { 
  CurrencyCode, 
  NextBestAction, 
  Campaign, 
  Contact, 
  RevenueAttributionSummary 
} from '../types.js';
import { formatCurrency, formatNumber, getScoreBadgeStyles } from '../utils/formatters.js';

interface DashboardViewProps {
  currency: CurrencyCode;
  nextBestActions: NextBestAction[];
  campaigns: Campaign[];
  contacts: Contact[];
  attribution: RevenueAttributionSummary;
  onNavigateTab: (tab: string) => void;
  onExecuteAction: (action: NextBestAction) => void;
  onOpenAICommand: () => void;
  onQuickSearch: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currency,
  nextBestActions,
  campaigns,
  contacts,
  attribution,
  onNavigateTab,
  onExecuteAction,
  onOpenAICommand,
  onQuickSearch,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const hotContacts = contacts.filter(c => c.scores.category === 'HOT');
  const verifiedCount = contacts.filter(c => c.emailVerification?.status === 'VALID').length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickSearch(quickInput);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* AI Command Center Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-1 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>AI Customer Acquisition & Revenue OS</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            What do you want to accomplish today?
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Apex AI seamlessly orchestrates verified lead discovery, intent scoring, multi-channel sequences, and revenue attribution across global & African markets.
          </p>

          {/* Quick Action Input Bar */}
          <form onSubmit={handleQuickSubmit} className="pt-2">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1.5 focus-within:border-indigo-400 focus-within:bg-white/15 transition-all shadow-lg">
              <Search className="h-4 w-4 text-slate-300 ml-3 shrink-0" />
              <input
                id="dashboard-ai-search-input"
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Mine 100k leads, find UNILAG CS students, Solana Web3 devs, D2C brands, Gmail filters..."
                className="w-full px-3 py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                id="dashboard-ai-search-btn"
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span>Search / Ask</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
          </form>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Quick Prompts:</span>
            {[
              'UNILAG & UI CS Students (.edu.ng)',
              '10k Solana & DeFi Traders (Crypto)',
              'D2C Shopify Brands (@gmail.com)',
              'B2B SaaS CEOs in United States',
              'Recover 14 abandoned checkouts'
            ].map((chip, idx) => (
              <button
                key={idx}
                id={`quick-chip-${idx}`}
                onClick={() => onQuickSearch(chip)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Pulse Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Attributed Revenue */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Attributed Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(attribution.totalRevenue, currency)}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+34.2% vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Hot Leads */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Hot High-Intent Leads</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {hotContacts.length || 37}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Intent Score &gt; 85/100 (High Buying Signals)
            </p>
          </div>
        </div>

        {/* Card 3: Discovered & Verified */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Verified Pipeline Contacts</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(attribution.conversionFunnel.discovered)}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {formatNumber(attribution.conversionFunnel.verified)} verified mailboxes (95%+)
            </p>
          </div>
        </div>

        {/* Card 4: Deliverability */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Inbox Deliverability</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.6%</h3>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              SPF, DKIM & DMARC 100% Aligned
            </p>
          </div>
        </div>
      </div>

      {/* AI Market Radar + Today's Revenue Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Revenue Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Today's Revenue Opportunities
              </h2>
            </div>
            <span className="text-xs text-slate-500">Autonomous AI Recommendation Engine</span>
          </div>

          <div className="space-y-3">
            {nextBestActions.map((action) => (
              <div
                key={action.id}
                id={`nba-card-${action.id}`}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                      Impact: {action.impactScore}/100
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(action.potentialRevenue, currency)} Est. Pipeline
                    </span>
                    <span className="text-xs text-slate-400">• {action.targetCount} Prospects</span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{action.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{action.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id={`execute-nba-btn-${action.id}`}
                    onClick={() => onExecuteAction(action)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>{action.suggestedActionText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: AI Market Radar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Radio className="h-4 w-4 text-indigo-500" />
              <span>AI Market Radar</span>
            </h2>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer" onClick={() => onNavigateTab('discover')}>
              Discover More →
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Nigeria & African Agencies</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">312 Match</span>
              </div>
              <p className="text-[11px] text-slate-500">Marketing & Performance agencies with 20-50 employees in Lagos & Abuja ready for outreach.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">US & UK B2B SaaS Founders</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600">2,430 Match</span>
              </div>
              <p className="text-[11px] text-slate-500">Verified decision-makers running Stripe/HubSpot tech stacks with &gt;$2M revenue.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Checkout Abandonment Radar</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">14 Active</span>
              </div>
              <p className="text-[11px] text-slate-500">High buying intent detected at checkout stage. Average basket value: $249.</p>
            </div>

            <button
              id="launch-radar-discovery-btn"
              onClick={() => onNavigateTab('discover')}
              className="w-full py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Launch Global Lead Discovery</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gap-Filling Revenue Superpowers */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
              AI Market Gaps Filled
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">High-Velocity Intelligence & Reply Modules</h3>
          </div>
          <p className="text-xs text-slate-500">Autonomous triggers & anti-spam optimization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <button
            onClick={() => onNavigateTab('masspitch')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500 text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-emerald-500" />
                <span>Mass Pitch (2k–5k)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500">Scout & pitch 2,000–5,000+ selling clients simultaneously with 1 message.</p>
          </button>

          <button
            onClick={() => onNavigateTab('signals')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 hover:border-indigo-400 text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                <span>Signal Intent Radar</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500">Track Exec Hires, Tech Shifts & Series A funding triggers in real-time.</p>
          </button>

          <button
            onClick={() => onNavigateTab('inbox')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 hover:border-indigo-400 text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-500" />
                <span>AI Smart Inbox</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500">Auto-sentiment classification (Email/WhatsApp) with 1-click tailored replies.</p>
          </button>

          <button
            onClick={() => onNavigateTab('spamaudit')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 hover:border-indigo-400 text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Deliverability & Spam</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500">Real-time spam keyword scanner, readability metrics & anti-spam rewrites.</p>
          </button>
        </div>
      </div>

      {/* Active Campaigns Table & Performance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Active Campaigns & Sequences
          </h2>
          <button
            id="view-all-campaigns-btn"
            onClick={() => onNavigateTab('campaigns')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create New Campaign +
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4">Open Rate</th>
                  <th className="py-3 px-4">Click Rate</th>
                  <th className="py-3 px-4">Attributed Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {camp.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-[10px] text-slate-600 dark:text-slate-300">
                        {camp.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        camp.status === 'RUNNING' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{formatNumber(camp.metrics.sent)}</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">{camp.metrics.openRate}%</td>
                    <td className="py-3.5 px-4 font-medium text-blue-600 dark:text-blue-400">{camp.metrics.clickRate}%</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(camp.metrics.revenue, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
