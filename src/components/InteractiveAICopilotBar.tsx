import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Search, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Mail, 
  ArrowRight, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Zap,
  HelpCircle,
  RefreshCw,
  Layers
} from 'lucide-react';
import { AICommandResponse } from '../../server/ai/revenueEngine.js';
import { DiscoveredLead } from '../types.js';

interface InteractiveAICopilotBarProps {
  onNavigateTab: (tab: string) => void;
  onImportLeads?: (leads: DiscoveredLead[]) => void;
  onPreloadLeadSearch?: (query: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const InteractiveAICopilotBar: React.FC<InteractiveAICopilotBarProps> = ({
  onNavigateTab,
  onImportLeads,
  onPreloadLeadSearch,
  isOpen = true,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AICommandResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: AICommandResponse; timestamp: string }>>([]);

  const quickPrompts = [
    { label: '🚀 Pitch 2k–5k at Once', prompt: 'Scout 2,000 clients selling B2B SaaS and send 1 mass pitch to all of them at once' },
    { label: '💎 Grand Slam Offer & Bumps', prompt: 'Show Grand Slam Offer Studio to engineer order bumps, upsells and risk reversal guarantees' },
    { label: '🤝 Buyer Deal Room (MAP)', prompt: 'Open Buyer Deal Room with interactive Cost of Inaction and 30-day Mutual Action Plan' },
    { label: '⚔️ Kill Objections', prompt: 'Show objection counter scripts for price, competitor and timing hesitations' },
    { label: '📡 Buying Signals', prompt: 'Show active buying intent signals and executive hires' },
    { label: '📥 Smart Inbox', prompt: 'Show unread smart inbox replies and sentiment classification' },
    { label: '🛡️ Audit Spam Words', prompt: 'Audit cold email copy for spam words and deliverability score' },
    { label: '🔥 Top Hot Leads', prompt: 'Show my hottest leads with intent score > 85' },
  ];

  const handleAsk = async (textToAsk?: string) => {
    const promptToSubmit = textToAsk || query;
    if (!promptToSubmit.trim()) return;

    setLoading(true);
    setIsExpanded(true);
    try {
      const res = await fetch('/api/v1/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSubmit }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResponse(data.result);
        setHistory(prev => [{ query: promptToSubmit, response: data.result, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error('Failed to ask AI copilot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResponse(null);
    setIsExpanded(false);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-500/30 shadow-md animate-in slide-in-from-top-2 duration-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        {/* Top Input Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-xs">
              <Sparkles className="h-4 w-4 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">AI Copilot</span>
                <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">Active</span>
              </div>
            </div>
          </div>

          {/* Search / Ask Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex-1 relative flex items-center"
          >
            <input
              id="interactive-ai-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type anything (e.g. 'What is our MRR?', 'Find SaaS founders in UK', 'Verify ceo@acme.com', 'Draft email')..."
              className="w-full pl-3.5 pr-24 py-2 rounded-xl bg-slate-800/90 border border-indigo-400/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-inner"
            />
            
            <div className="absolute right-1.5 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                id="interactive-ai-submit-btn"
                type="submit"
                disabled={loading || !query.trim()}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
              >
                {loading ? (
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Send className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Expand / Collapse / Clear */}
          {response && (
            <div className="flex items-center gap-1.5 shrink-0 justify-end">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
              >
                <span>{isExpanded ? 'Hide Result' : 'Show Result'}</span>
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700"
                title="Clear result"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 shrink-0"
              title="Close Copilot (Esc or ⌘J)"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wider">
            <Zap className="h-3 w-3 text-amber-400" /> Instant Queries:
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              id={`quick-ai-prompt-${idx}`}
              onClick={() => {
                setQuery(item.prompt);
                handleAsk(item.prompt);
              }}
              className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-indigo-600/60 text-slate-300 hover:text-white border border-slate-700/70 hover:border-indigo-400/50 transition-all shrink-0 font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Interactive Answer Panel (Expanded) */}
        {isExpanded && response && (
          <div className="mt-3 p-4 rounded-xl bg-slate-900/95 border border-indigo-500/30 shadow-xl space-y-3.5 animate-in fade-in duration-150">
            {/* Answer Headline */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {response.actionTaken || 'AI Intelligence Result'}
                    </span>
                    <span className="text-[10px] text-slate-400">Contextual Real-Time Analysis</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">{response.summary}</p>
                </div>
              </div>
            </div>

            {/* Interactive Data Card: Discovered Leads */}
            {response.data?.leads && response.data.leads.length > 0 && (
              <div className="rounded-lg bg-slate-950/80 border border-slate-800 overflow-hidden">
                <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    Discovered Decision Makers ({response.data.leadsCount} found)
                  </span>
                  {onImportLeads && (
                    <button
                      onClick={() => onImportLeads(response.data.leads)}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      <span>Import All to CRM</span>
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-800/80 max-h-48 overflow-y-auto">
                  {response.data.leads.map((lead: any, i: number) => (
                    <div key={i} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-900/40">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">{lead.fullName}</span>
                          <span className="text-slate-400">• {lead.jobTitle}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{lead.companyName} ({lead.city}, {lead.country}) — <span className="text-indigo-300">{lead.email}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          Fit {lead.leadFitScore}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                          Intent {lead.buyingIntentScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Data Card: Email Verification */}
            {response.data?.verification && (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">{response.data.verification.email}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {response.data.verification.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Confidence: {response.data.verification.confidenceScore}% • MX Found: {response.data.verification.details?.mxRecordsFound ? 'Yes' : 'No'} • Disposable: {response.data.verification.details?.isDisposable ? 'Yes' : 'No'}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('verify')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1"
                >
                  <span>Verification Lab</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Interactive Data Card: Campaign Blueprint */}
            {response.data?.steps && (
              <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{response.data.campaignName || 'Campaign Blueprint'}</span>
                  <span className="text-[11px] text-indigo-300">{response.data.stepsCount || 3} Automated Steps</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {response.data.steps.map((step: any, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-indigo-400 font-bold mb-1">
                        <span>Step {step.step || idx + 1} ({step.channel || 'Email'})</span>
                        <span>+{step.delayDays || 0}d</span>
                      </div>
                      <p className="font-medium text-slate-200 truncate">{step.subject}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{step.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Followups & Direct Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Quick Actions:</span>
                {response.suggestedFollowUps?.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (response.suggestedRoute) {
                        const target = response.suggestedRoute.replace('/', '');
                        onNavigateTab(target);
                      }
                    }}
                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                  >
                    <span>{action}</span>
                    <ArrowRight className="h-2.5 w-2.5 opacity-60" />
                  </button>
                ))}
              </div>

              {response.suggestedRoute && (
                <button
                  onClick={() => {
                    const target = response.suggestedRoute!.replace('/', '');
                    onNavigateTab(target);
                  }}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open {response.suggestedRoute.replace('/', '').toUpperCase()} Module</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
