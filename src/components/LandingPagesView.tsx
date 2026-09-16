import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  ExternalLink, 
  Eye, 
  FileText, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  Share2
} from 'lucide-react';
import { LandingPage, CurrencyCode } from '../types.js';
import { formatNumber } from '../utils/formatters.js';

interface LandingPagesViewProps {
  landingPages: LandingPage[];
  currency: CurrencyCode;
}

export const LandingPagesView: React.FC<LandingPagesViewProps> = ({ landingPages }) => {
  const [selectedPage, setSelectedPage] = useState<LandingPage>(landingPages[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://apexrevenue.ai/p/${selectedPage.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Landing Pages & Lead Capture Forms</h1>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">
              Automatic Lead Magnet Delivery
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish high-converting opt-in pages with instant PDF/template delivery, real-time MX verification, and automated CRM sync.
          </p>
        </div>

        <button
          id="create-new-lp-btn"
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Lead Capture Form</span>
        </button>
      </div>

      {/* Grid: Left Pages List, Right Interactive Live Form Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Pages List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Published Pages ({landingPages.length})
          </h2>

          <div className="space-y-2.5">
            {landingPages.map((page) => {
              const isSelected = selectedPage?.id === page.id;
              const convRate = ((page.submissions / page.views) * 100).toFixed(1);
              return (
                <div
                  key={page.id}
                  id={`page-card-${page.id}`}
                  onClick={() => setSelectedPage(page)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {page.leadMagnetAsset}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-500/10">
                      {page.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-2">{page.title}</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">/p/{page.slug}</p>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Views</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{formatNumber(page.views)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Opt-ins</span>
                      <span className="text-xs font-semibold text-emerald-600">{formatNumber(page.submissions)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Conv %</span>
                      <span className="text-xs font-bold text-indigo-600">{convRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live Interactive Opt-In Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-indigo-500" />
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  Live Preview: /{selectedPage.slug}
                </span>
              </div>
              <button
                id="copy-lp-link-btn"
                onClick={handleCopyLink}
                className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied URL!' : 'Share Public Link'}</span>
              </button>
            </div>

            {/* Embedded Opt-in Form Container */}
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Instant Download & Access</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                {selectedPage.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {selectedPage.description}
              </p>

              {/* Sample Interactive Form */}
              <div className="space-y-3 pt-2 max-w-md">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                  />
                  <input
                    type="text"
                    placeholder="Company name"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Work email address (Verified in real-time)"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-mono"
                />
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {selectedPage.leadMagnetAsset} (Free)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>We guarantee zero spam. Instant PDF download sent straight to your verified mailbox.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
