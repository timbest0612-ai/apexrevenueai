import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Search, 
  ArrowRight, 
  Flame, 
  Mail, 
  ShoppingCart, 
  X,
  Bot,
  Zap,
  Check,
  Building,
  UserCheck
} from 'lucide-react';
import { AICommandResponse } from '../../server/ai/revenueEngine.js';

interface AICommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectLeadQuery?: (query: string) => void;
}

export const AICommandCenter: React.FC<AICommandCenterProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectLeadQuery,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AICommandResponse | null>(null);

  const samplePrompts = [
    { text: 'Find 5,000 verified Computer Science & AI students in UNILAG and UI with .edu.ng emails', icon: UserCheck, tag: 'Academics' },
    { text: 'Harvest 10,000 DeFi traders & Solana smart contract developers with Telegram handles', icon: Zap, tag: 'Crypto' },
    { text: 'Mine 2,500 D2C fashion & skincare brand founders on Shopify Plus with @gmail.com', icon: Building, tag: 'Brands' },
    { text: 'Find B2B SaaS CEOs & VP Sales in United States with corporate domains', icon: Search, tag: 'B2B Leads' },
    { text: 'Who are my hottest leads with intent score > 85?', icon: Flame, tag: 'CRM' },
    { text: 'Recover my 14 abandoned checkouts with a VIP discount sequence', icon: ShoppingCart, tag: 'Revenue' },
  ];

  const handleExecute = async (commandText?: string) => {
    const textToRun = commandText || prompt;
    if (!textToRun.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToRun }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResponse(data.result);
      }
    } catch (err) {
      console.error('Failed to run AI command:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Apex AI Command Center</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Natural language orchestrator for discovery, revenue intelligence & campaigns</p>
            </div>
          </div>
          <button
            id="close-ai-command-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute();
            }}
            className="relative flex items-center"
          >
            <input
              id="ai-command-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to accomplish today? (e.g. Find agency owners in Lagos...)"
              className="w-full pl-4 pr-24 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-xs"
              autoFocus
            />
            <button
              id="ai-command-submit-btn"
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Execute</span>
                  <Send className="h-3 w-3" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {!response && !loading && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Suggested Revenue & Discovery Commands
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {samplePrompts.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      id={`sample-prompt-${idx}`}
                      onClick={() => {
                        setPrompt(p.text);
                        handleExecute(p.text);
                      }}
                      className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all text-xs flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 dark:text-slate-200 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{p.text}</p>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{p.tag}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="h-10 w-10 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Apex AI is synthesizing data, checking provider brokers & scoring prospects...
              </p>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-slate-800 dark:text-slate-200 text-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Execution Result</span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{response.summary}</p>
              </div>

              {/* Data Preview if Discovery */}
              {response.data?.leads && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Discovered Prospects ({response.data.leadsCount})
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% MX & Syntax Verified</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {response.data.leads.map((l: any, i: number) => (
                      <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{l.fullName}</p>
                          <p className="text-[11px] text-slate-500">{l.jobTitle} • <span className="font-medium text-slate-700 dark:text-slate-300">{l.companyName}</span> ({l.city}, {l.country})</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                            Fit: {l.leadFitScore}%
                          </span>
                          <span className="text-slate-500 text-[11px]">{l.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Followups */}
              {response.suggestedFollowUps && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Next Recommended Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {response.suggestedFollowUps.map((action, i) => (
                      <button
                        key={i}
                        id={`ai-followup-${i}`}
                        onClick={() => {
                          if (response.suggestedRoute) {
                            onNavigateTab(response.suggestedRoute.replace('/', ''));
                            onClose();
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Zap className="h-3 w-3 text-indigo-500" />
                        <span>{action}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Route CTA */}
              {response.suggestedRoute && (
                <div className="pt-2 flex justify-end">
                  <button
                    id="ai-navigate-direct-btn"
                    onClick={() => {
                      onNavigateTab(response.suggestedRoute!.replace('/', ''));
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
                  >
                    <span>Open Module ({response.suggestedRoute})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
