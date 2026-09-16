import React, { useState } from 'react';
import { 
  X, 
  PlayCircle, 
  Sparkles, 
  Volume2, 
  Video, 
  Mic, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CostControlMetrics } from '../types.js';

interface SampleMediaStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CostControlMetrics;
  onUpgradeToFull: () => void;
}

export const SampleMediaStudioModal: React.FC<SampleMediaStudioModalProps> = ({
  isOpen,
  onClose,
  metrics,
  onUpgradeToFull,
}) => {
  if (!isOpen) return null;

  const [recipientName, setRecipientName] = useState('Sarah Jenkins');
  const [companyName, setCompanyName] = useState('Apex FinTech Scale');
  const [offerNiche, setOfferNiche] = useState('B2B Pipeline & Cold Outreach Engine');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any>({
    duration: '0:45',
    hookTitle: 'How Apex FinTech Scale Can 3.4x Outbound Reply Rates',
    audioWaveform: [30, 45, 80, 60, 95, 40, 75, 90, 85, 40, 65, 80, 50, 70, 90, 100, 45, 60, 85, 30],
    scriptLines: [
      `[00:00 - 00:10] Hi Sarah, noticed Apex FinTech Scale is rapidly expanding across Enterprise B2B accounts.`,
      `[00:10 - 00:25] Most outbound teams lose 40% of meetings due to unverified mailboxes and spam folder routing.`,
      `[00:25 - 00:40] We built ApexRevenue with zero-bounce deliverability shields and 4D AI intent scoring.`,
      `[00:40 - 00:45] Would love to show your team our 5,000 verified fintech decision-makers.`
    ]
  });

  const handleGenerateSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/sandbox/sample-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName, companyName, offerType: offerNiche }),
      });
      const data = await res.json();
      if (data.success && data.samplePreview) {
        setGeneratedPreview({
          duration: '0:45',
          hookTitle: data.samplePreview.hookTitle,
          audioWaveform: data.samplePreview.audioWaveform,
          scriptLines: data.samplePreview.scriptLines,
        });
      }
    } catch (err) {
      console.error('Failed to generate sample:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <PlayCircle className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Sample Mode: 45s High-Fidelity Pitch Media Studio
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Experience the full voice, script, and personalized pitch engine with cost-controlled 45s preview samples.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Cost Control Policy Badge */}
          <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-purple-500" />
              <span><strong>Sample Mode Active:</strong> Generates 45s high-fidelity personalized pitch demos. Full 4K videos & long-form audio unlock on Pro or BYOK.</span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full whitespace-nowrap">
              Fair-Use Protected
            </span>
          </div>

          {/* Form Parameters */}
          <form onSubmit={handleGenerateSample} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Target Decision Maker</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Company / Account Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Apex FinTech Scale"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Pitch Offer Focus</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={offerNiche}
                  onChange={(e) => setOfferNiche(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Outbound Engine"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </form>

          {/* Media Preview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{generatedPreview.hookTitle}</h4>
                  <span className="text-[10px] text-slate-400">Sample Preview • Duration: 0:45 • Voice: Executive Natural</span>
                </div>
              </div>

              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isPlayingAudio 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <PlayCircle className="h-3.5 w-3.5" />
                <span>{isPlayingAudio ? 'Pause Audio' : 'Play Sample'}</span>
              </button>
            </div>

            {/* Audio Waveform Visualization */}
            <div className="flex items-end gap-1 h-12 bg-slate-800/60 p-2 rounded-xl border border-slate-700">
              {generatedPreview.audioWaveform.map((height: number, i: number) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            {/* Script Lines */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Generated 45s Pitch Script (Sample Mode)
              </span>
              {generatedPreview.scriptLines.map((line: string, idx: number) => (
                <p key={idx} className="text-slate-300 text-[11px] leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">Want full 4K video exports, long-form podcasting & custom voice clones?</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onUpgradeToFull();
                onClose();
              }}
              className="w-1/2 sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Unlock Full Production (Pro / BYOK)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
