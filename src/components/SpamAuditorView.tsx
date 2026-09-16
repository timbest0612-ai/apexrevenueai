import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Send, 
  Copy, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  ArrowRight,
  Flame,
  FileText,
  Check
} from 'lucide-react';
import { SpamAuditResult, CurrencyCode } from '../types.js';

interface SpamAuditorViewProps {
  onNavigateTab: (tab: string) => void;
  onApplyToCampaign?: (subject: string, bodyHtml: string) => void;
  onApplyToMassPitch?: (subject: string, bodyText: string) => void;
}

export const SpamAuditorView: React.FC<SpamAuditorViewProps> = ({
  onNavigateTab,
  onApplyToCampaign,
  onApplyToMassPitch,
}) => {
  const [subject, setSubject] = useState<string>('100% Free Guarantee: Act Now to Make Money with Our B2B Agency Tool!');
  const [bodyText, setBodyText] = useState<string>(
    `Hi {{first_name}},\n\nCongratulations! We are offering a 100% free special promotion with no risk guarantee. Act now to earn extra cash and make money with our unlimited agency package.\n\nClick here to buy direct and claim your free trial before this urgent special expires!\n\nBest,\nThe Sales Team`
  );
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<SpamAuditResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const runAudit = async (subjToAudit?: string, bodyToAudit?: string) => {
    const s = subjToAudit ?? subject;
    const b = bodyToAudit ?? bodyText;
    setIsAuditing(true);
    try {
      const res = await fetch('/api/v1/ai/audit-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: s, bodyHtml: b }),
      });
      const data = await res.json();
      if (data.success && data.audit) {
        setAuditResult(data.audit);
      }
    } catch (err) {
      console.error('Failed to run copy audit:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyOptimized = () => {
    if (!auditResult?.optimizedAlternative) return;
    setSubject(auditResult.optimizedAlternative.subject);
    setBodyText(auditResult.optimizedAlternative.bodyHtml.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').replace(/<br>/g, '\n').trim());
    runAudit(
      auditResult.optimizedAlternative.subject,
      auditResult.optimizedAlternative.bodyHtml
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white border border-indigo-500/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/30 flex items-center justify-center border border-indigo-400/40">
              <ShieldCheck className="h-4 w-4 text-indigo-300 animate-pulse" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              AI Deliverability & Anti-Spam Lab
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Email Spam Word & Readability Auditor</h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Scans cold email copy for high-risk spam words, readability grades, mobile notification truncations, and rewrites copy with 1-click AI optimization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runAudit()}
            disabled={isAuditing}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isAuditing ? 'Auditing Copy...' : 'Run Spam & Deliverability Audit'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Editor & Auditor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subject & Email Copy Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Outbound Email Draft
              </span>
              <span className="text-[11px] text-slate-400">
                Subject Length: <span className="font-semibold text-slate-700 dark:text-slate-300">{subject.length} chars</span>
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Subject line..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Body Text</label>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
                placeholder="Write your email body..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSubject('Quick question regarding GrowthPulse client pipeline');
                  setBodyText('Hi {{first_name}},\n\nSaw you are scaling retainers in Lagos. Are you open to a 2-minute look at how teams book 40+ qualified meetings without landing in spam?\n\nBest,\nAlex');
                }}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Load Clean Example
              </button>

              <button
                onClick={() => runAudit()}
                disabled={isAuditing}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {isAuditing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 text-amber-400" />}
                <span>Analyze Spam Risk</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Audit Score & Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          {auditResult ? (
            <div className="space-y-4">
              {/* Score Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase text-slate-400">Deliverability Safety Score</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      auditResult.riskCategory === 'SAFE'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : auditResult.riskCategory === 'MODERATE'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {auditResult.riskCategory}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                    {auditResult.deliverabilityScore}
                  </span>
                  <span className="text-sm text-slate-400 font-semibold">/ 100</span>
                </div>

                {/* Micro Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Readability</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{auditResult.readingGradeLevel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Est. Read Time</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{auditResult.readingTimeSeconds} seconds</p>
                  </div>
                </div>
              </div>

              {/* Detected Spam Keywords */}
              {auditResult.spamWordsDetected.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{auditResult.spamWordsDetected.length} High-Risk Spam Triggers Detected</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {auditResult.spamWordsDetected.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 text-[11px] font-bold border border-rose-300 dark:border-rose-800 shadow-2xs"
                      >
                        "{item.word}" ({item.category})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[11px]">AI Deliverability Advice</p>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  {auditResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 1-Click AI Optimized Alternative */}
              {auditResult.optimizedAlternative && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>1-Click AI Anti-Spam Rewrite</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={handleApplyOptimized}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Check className="h-3 w-3" />
                        <span>Apply to Editor</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const cleanBody = auditResult.optimizedAlternative.bodyHtml.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').replace(/<br>/g, '\n').trim();
                          if (onApplyToMassPitch) {
                            onApplyToMassPitch(auditResult.optimizedAlternative.subject, cleanBody);
                          } else {
                            onNavigateTab('masspitch');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Zap className="h-3 w-3 text-amber-400" />
                        <span>Send in Mass Pitch</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onApplyToCampaign) {
                            onApplyToCampaign(auditResult.optimizedAlternative.subject, auditResult.optimizedAlternative.bodyHtml);
                          } else {
                            onNavigateTab('campaigns');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Send className="h-3 w-3 text-indigo-500" />
                        <span>Push to Campaign Studio</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">Subject: {auditResult.optimizedAlternative.subject}</p>
                    <div
                      className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-sans"
                      dangerouslySetInnerHTML={{ __html: auditResult.optimizedAlternative.bodyHtml }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    💡 {auditResult.optimizedAlternative.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
              <ShieldCheck className="h-8 w-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Run an audit to see real-time deliverability score</p>
              <p className="text-[11px] text-slate-400 mt-1">Detects spam triggers, reading grade levels, and mobile truncation.</p>
              <button
                onClick={() => runAudit()}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Start Audit Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
