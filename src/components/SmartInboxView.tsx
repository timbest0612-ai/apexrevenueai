import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Send, 
  Bot, 
  Sparkles, 
  Mail, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Flame, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  ThumbsUp,
  XCircle,
  DollarSign
} from 'lucide-react';
import { SmartInboxThread, CurrencyCode } from '../types.js';

interface SmartInboxViewProps {
  currency: CurrencyCode;
  onNavigateTab: (tab: string) => void;
  onConvertDealSuccess?: () => void;
  onViewLeadInCRM?: (email: string) => void;
  onAuditReply?: (content: string) => void;
}

export const SmartInboxView: React.FC<SmartInboxViewProps> = ({
  currency,
  onNavigateTab,
  onConvertDealSuccess,
  onViewLeadInCRM,
  onAuditReply,
}) => {
  const [threads, setThreads] = useState<SmartInboxThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isConvertingDeal, setIsConvertingDeal] = useState<boolean>(false);
  const [dealConverted, setDealConverted] = useState<boolean>(false);
  const [filterSentiment, setFilterSentiment] = useState<string>('ALL');

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/inbox/threads');
      const data = await res.json();
      if (data.success && data.threads) {
        setThreads(data.threads);
        if (!selectedThreadId && data.threads.length > 0) {
          setSelectedThreadId(data.threads[0].id);
          setReplyContent(data.threads[0].suggestedAIReply?.body || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch smart inbox threads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const activeThread = threads.find(t => t.id === selectedThreadId);

  const handleSelectThread = (thread: SmartInboxThread) => {
    setSelectedThreadId(thread.id);
    setReplyContent(thread.suggestedAIReply?.body || '');
  };

  const handleSendReply = async () => {
    if (!activeThread || !replyContent.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/v1/inbox/threads/${activeThread.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          channel: activeThread.channel
        }),
      });
      const data = await res.json();
      if (data.success && data.thread) {
        setThreads(prev => prev.map(t => t.id === activeThread.id ? data.thread : t));
        setReplyContent('');
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleRegenerateAIReply = async () => {
    if (!activeThread) return;
    setIsGeneratingAI(true);
    try {
      const lastLeadMsg = activeThread.messages.filter(m => m.sender === 'lead').slice(-1)[0]?.content || '';
      const res = await fetch('/api/v1/ai/generate-smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: activeThread.contactName,
          companyName: activeThread.companyName,
          channel: activeThread.channel,
          leadMessage: lastLeadMsg,
          sentiment: activeThread.sentiment
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setReplyContent(data.reply.body);
      }
    } catch (err) {
      console.error('Failed to regenerate AI reply:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'INTERESTED_DEMO':
        return { label: '🔥 Interested / Demo', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'PRICING_QUERY':
        return { label: '💰 Pricing Inquiry', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
      case 'OBJECTION_GATEKEEPER':
        return { label: '🛡️ Stack Objection', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'OUT_OF_OFFICE':
        return { label: '⏳ Out of Office', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
      default:
        return { label: '📩 Direct Reply', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    }
  };

  const filteredThreads = threads.filter(t => {
    if (filterSentiment === 'ALL') return true;
    return t.sentiment === filterSentiment;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white border border-indigo-500/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/30 flex items-center justify-center border border-indigo-400/40">
              <Inbox className="h-4 w-4 text-indigo-300 animate-pulse" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Omnichannel AI Reply Hub
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Smart Inbox & Auto-Sentiment Classifier</h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Consolidates replies from Cold Email, WhatsApp Business API, and SMS into one unified workspace with instant AI sentiment triage and 1-click tailored replies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchThreads}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Inboxes</span>
          </button>
          <button
            onClick={() => onNavigateTab('crm')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-all flex items-center gap-1.5"
          >
            <span>View CRM Deals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Inbox Two-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Threads List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Sentiment Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Inboxes' },
              { id: 'INTERESTED_DEMO', label: '🔥 Demos' },
              { id: 'PRICING_QUERY', label: '💰 Pricing' },
              { id: 'OBJECTION_GATEKEEPER', label: '🛡️ Objections' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterSentiment(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  filterSentiment === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredThreads.map(thread => {
              const badge = getSentimentBadge(thread.sentiment);
              const isSelected = thread.id === selectedThreadId;
              const lastMessage = thread.messages.slice(-1)[0];

              return (
                <div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                        {thread.contactName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{thread.contactName}</p>
                        <p className="text-[11px] text-slate-500">{thread.companyName}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium">{thread.lastActivity}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase">
                      {thread.channel}
                    </span>

                    {thread.dealValue && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
                        ${thread.dealValue.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {lastMessage?.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Thread Transcript & AI Smart Reply Composer */}
        <div className="lg:col-span-7">
          {activeThread ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-md flex flex-col h-[680px]">
              {/* Thread Header with Cross-Feature Controls */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeThread.contactName}</h3>
                    <span className="text-xs text-slate-400">• {activeThread.jobTitle || 'Executive'} at {activeThread.companyName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{activeThread.contactEmail}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    id="convert-deal-btn"
                    onClick={async () => {
                      if (!activeThread) return;
                      setIsConvertingDeal(true);
                      try {
                        const res = await fetch(`/api/v1/inbox/threads/${activeThread.id}/convert-deal`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ dealValue: 4500 })
                        });
                        const data = await res.json();
                        if (data.success) {
                          setDealConverted(true);
                          setTimeout(() => setDealConverted(false), 5000);
                          if (onConvertDealSuccess) onConvertDealSuccess();
                        }
                      } catch (err) {
                        console.error('Failed to convert deal:', err);
                      } finally {
                        setIsConvertingDeal(false);
                      }
                    }}
                    disabled={isConvertingDeal}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isConvertingDeal ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : dealConverted ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-white" />
                        <span>Deal Converted ($4,500)!</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-3 w-3" />
                        <span>Convert to CRM Deal ($4.5k)</span>
                      </>
                    )}
                  </button>

                  <button
                    id="view-inbox-lead-crm-btn"
                    onClick={() => {
                      if (onViewLeadInCRM) {
                        onViewLeadInCRM(activeThread.contactEmail);
                      } else {
                        onNavigateTab('crm');
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
                  >
                    View in CRM
                  </button>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                {activeThread.messages.map((msg, i) => {
                  const isLead = msg.sender === 'lead';
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${isLead ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {isLead ? activeThread.contactName : 'You (Apex Outbound)'}
                        </span>
                        <span className="text-[10px] text-slate-400">• {msg.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          isLead
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs'
                            : 'bg-indigo-600 text-white shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Suggestion Box */}
              {activeThread.suggestedAIReply && (
                <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/40 border-t border-b border-indigo-200 dark:border-indigo-900/50 flex items-start gap-2.5 text-xs">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 text-[11px] uppercase tracking-wider">
                        AI Recommended Response Strategy
                      </span>
                      <button
                        onClick={handleRegenerateAIReply}
                        disabled={isGeneratingAI}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className={`h-3 w-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                        <span>Regenerate</span>
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                      {activeThread.suggestedAIReply.rationale}
                    </p>
                  </div>
                </div>
              )}

              {/* Reply Composer */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <textarea
                  id="smart-reply-textarea"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  placeholder={`Type your reply via ${activeThread.channel.toUpperCase()} or use AI suggestion...`}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold uppercase text-[10px]">
                      {activeThread.channel} Mode
                    </span>
                    <span>1-Click Dispatched directly to lead</span>
                  </div>

                  <button
                    id="send-smart-reply-btn"
                    onClick={handleSendReply}
                    disabled={isSending || !replyContent.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isSending ? (
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Reply</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Inbox className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Select a lead thread from the left to view messages and generate AI replies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
