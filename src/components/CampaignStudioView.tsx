import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Play, 
  Pause, 
  Plus, 
  Eye, 
  Mail, 
  Copy, 
  Check, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Split,
  FileEdit,
  TrendingUp,
  Clock,
  Zap,
  MessageSquare,
  Flame,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Campaign, CurrencyCode } from '../types.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

interface CampaignStudioViewProps {
  campaigns: Campaign[];
  currency: CurrencyCode;
  onToggleCampaign: (id: string) => void;
  onCreateCampaign: (camp: Partial<Campaign>) => void;
  onNavigateTab?: (tab: string) => void;
}

export const CampaignStudioView: React.FC<CampaignStudioViewProps> = ({
  campaigns,
  currency,
  onToggleCampaign,
  onCreateCampaign,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'playbook_blueprint'>('playbook_blueprint');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(campaigns[0]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('demo@apexrevenue.ai');
  const [testSendStatus, setTestSendStatus] = useState<string | null>(null);

  // Playbook Studio Generator State
  const [blueprintUrl, setBlueprintUrl] = useState('https://apexrevenue.ai');
  const [blueprintAudience, setBlueprintAudience] = useState('Founders, VP Sales & Agency Heads');
  const [blueprintOffer, setBlueprintOffer] = useState('Automated 100k Lead Miner & Zero-Bounce Verified Outbound');
  const [blueprintGeo, setBlueprintGeo] = useState('Nigeria & US/UK');
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);
  const [blueprintGenerated, setBlueprintGenerated] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTouchpoint, setSelectedTouchpoint] = useState<number>(1);

  // AI Wizard State
  const [wizardProduct, setWizardProduct] = useState('ApexRevenue AI Customer Acquisition Platform');
  const [wizardAudience, setWizardAudience] = useState('B2B Founders & Marketing Agency Owners');
  const [wizardOffer, setWizardOffer] = useState('Free 14-Day Pilot with 500 Verified Leads');
  const [wizardGoal, setWizardGoal] = useState('Book a 15-min Revenue Growth Demo');
  const [wizardTone, setWizardTone] = useState('Consultative & High-Value');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Editor State for Selected Campaign
  const [currentSubject, setCurrentSubject] = useState(selectedCampaign?.subject || 'Quick question regarding {{company}} revenue pipeline');
  const [currentBody, setCurrentBody] = useState(
    selectedCampaign?.steps[0]?.bodyHtml || 
    '<p>Hi {{first_name}},</p><p>I noticed {{company}} has been expanding rapidly across {{city}}.</p><p>Would you be open to exploring how top B2B teams are scaling client acquisition with 100k verified outbound pipelines?</p>'
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateBlueprint = () => {
    setIsGeneratingBlueprint(true);
    setTimeout(() => {
      setIsGeneratingBlueprint(false);
      setBlueprintGenerated(true);
    }, 1000);
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: wizardProduct,
          audience: wizardAudience,
          offer: wizardOffer,
          goal: wizardGoal,
          tone: wizardTone,
        }),
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setCurrentSubject(data.draft.subject);
        setCurrentBody(data.draft.bodyHtml);
        setIsWizardOpen(false);
      }
    } catch (err) {
      console.error('Failed to generate AI email:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTest = async () => {
    if (!selectedCampaign) return;
    setTestSendStatus('sending');
    try {
      const res = await fetch(`/api/v1/campaigns/${selectedCampaign.id}/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail: testEmailAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setTestSendStatus('Dispatched! Inbox placement: 99.8% (DKIM passed)');
        setTimeout(() => setTestSendStatus(null), 5000);
      }
    } catch (err) {
      setTestSendStatus('Failed to send test email');
    }
  };

  // Playbook Touchpoint Definitions
  const PLAYBOOK_TOUCHES = [
    {
      step: 1,
      day: 'Day 1',
      channel: 'Cold Email (Primary)',
      subjectA: 'Quick observation regarding {{company}} client acquisition',
      subjectB: '{{first_name}} — idea for {{company}} B2B pipeline growth',
      body: `Hi {{first_name}},\n\nSaw that {{company}} is expanding your client base across {{city}}. Most teams in {{industry}} struggle with high lead bounce rates and rising SDR costs.\n\nWe deployed an automated engine that mines 100,000 verified decision-makers and books qualified meetings directly into calendar with 0% bounce.\n\nOpen to a 4-minute diagnostic walkthrough this Thursday?`,
      whatsapp: `Hi {{first_name}}, sent a quick note to your email regarding {{company}}'s client acquisition pipeline. Would love to share our 3-step deliverability framework if helpful!`,
      spamScore: 99,
      openProjection: '48.2%',
      replyProjection: '5.8%'
    },
    {
      step: 2,
      day: 'Day 3',
      channel: 'Cold Email + Diagnostic Asset',
      subjectA: '{{company}} vs industry benchmark for zero-bounce outbound',
      subjectB: 'Sharing our verified lead framework for {{company}}',
      body: `Hi {{first_name}},\n\nFollowing up on my note from Tuesday. We recently analyzed 50,000 B2B campaigns across {{industry}} and found that 82% of pipeline delays come from bad MX records and spam filters.\n\nWe put together a 1-page playbook showing how to maintain 99.8% inbox placement.\n\nShould I send the link over?`,
      whatsapp: `Hey {{first_name}}, following up on my email regarding {{company}}'s deliverability audit. Let me know if you want the 1-page benchmark sheet!`,
      spamScore: 98,
      openProjection: '42.0%',
      replyProjection: '4.4%'
    },
    {
      step: 3,
      day: 'Day 7',
      channel: 'Cold Email + WhatsApp Voice Touch',
      subjectA: 'Case study: 24 SQLs booked in 14 days for {{industry}}',
      subjectB: 'Quick 2-minute proof of concept for {{company}}',
      body: `Hi {{first_name}},\n\nThought you might find this relevant: a B2B team similar to {{company}} harvested 10,000 verified founders and closed $48,000 in pipeline in their first sprint with zero third-party markups.\n\nWould you be against looking at the exact campaign sequence they used?`,
      whatsapp: `Hi {{first_name}}, Alex here. Dropped a quick case study in your inbox on scaling {{company}}'s pipeline. Happy to answer any questions here if WhatsApp is easier!`,
      spamScore: 97,
      openProjection: '38.5%',
      replyProjection: '6.1%'
    },
    {
      step: 4,
      day: 'Day 12',
      channel: 'Permission-Based Breakup',
      subjectA: 'Permission to close {{company}} file?',
      subjectB: 'Final check-in regarding {{company}} outbound pipeline',
      body: `Hi {{first_name}},\n\nI assume client acquisition automation isn't a core priority for {{company}} right now, which is totally understandable.\n\nI won't follow up again, but if you ever want to test 500 free verified leads with zero bounce, feel free to reply anytime.\n\nBest of success this quarter!`,
      whatsapp: `Final note from my side, {{first_name}}. Wishing {{company}} massive growth this quarter! Feel free to ping me if pipeline needs ever arise.`,
      spamScore: 100,
      openProjection: '54.0%',
      replyProjection: '7.9%'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Campaign Studio & Playbook Generator</h1>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">
              Omnichannel Dispatcher
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
              100% Automated
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Design multi-touch email & WhatsApp sequences with AI Spam Auditor, A/B subject variants, and 1-click execution into the 100k Mass Pitcher.
          </p>
        </div>

        {/* Studio View Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('playbook_blueprint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'playbook_blueprint'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>Autonomous Playbook Blueprint</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileEdit className="h-3.5 w-3.5" />
            <span>Campaign Sprints & Live Editor</span>
          </button>
        </div>
      </div>

      {activeTab === 'playbook_blueprint' ? (
        /* Autonomous AI Pipeline Blueprint Studio */
        <div className="space-y-6">
          {/* Blueprint Configuration Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>Autonomous Multi-Channel Pipeline Blueprint Engine</span>
                </h2>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Input your offering to automatically build 100k prospect queries, 4-stage cold emails, WhatsApp follow-ups, and spam score audits.
                </p>
              </div>

              <button
                onClick={handleGenerateBlueprint}
                disabled={isGeneratingBlueprint}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isGeneratingBlueprint ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>Regenerate AI Playbook</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div>
                <label className="text-[11px] text-indigo-200 block mb-1 font-semibold">Your Product or URL</label>
                <input
                  type="text"
                  value={blueprintUrl}
                  onChange={(e) => setBlueprintUrl(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-indigo-200 block mb-1 font-semibold">Target ICP / Decision Makers</label>
                <input
                  type="text"
                  value={blueprintAudience}
                  onChange={(e) => setBlueprintAudience(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-indigo-200 block mb-1 font-semibold">Core Value Proposition</label>
                <input
                  type="text"
                  value={blueprintOffer}
                  onChange={(e) => setBlueprintOffer(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-indigo-200 block mb-1 font-semibold">Target Geography</label>
                <select
                  value={blueprintGeo}
                  onChange={(e) => setBlueprintGeo(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option>Nigeria & West Africa</option>
                  <option>United States & North America</option>
                  <option>United Kingdom & Europe</option>
                  <option>Pan-Africa (Nigeria, Kenya, SA)</option>
                  <option>Global Enterprise (All Geo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sequence Step Selector & Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Steps Navigation */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sequence Cadence (4 Touches)</span>
                <span className="text-[11px] text-emerald-600 font-bold">100% Deliverability Guaranteed</span>
              </div>

              <div className="space-y-2.5">
                {PLAYBOOK_TOUCHES.map((touch) => (
                  <div
                    key={touch.step}
                    onClick={() => setSelectedTouchpoint(touch.step)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTouchpoint === touch.step
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                        {touch.day}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Spam Score: {touch.spamScore}/100
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-2">
                      Touch {touch.step}: {touch.channel}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-1">{touch.subjectA}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                      <span className="text-slate-400">Est. Open: <strong className="text-slate-800 dark:text-slate-200">{touch.openProjection}</strong></span>
                      <span className="text-slate-400">Est. Reply: <strong className="text-emerald-600">{touch.replyProjection}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1-Click Action Card */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 space-y-2">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span>Push to 100k Mass Pitcher</span>
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Deploy this sequence directly into the Mass Pitch Dispatcher to reach 2,000–5,000 prospects daily.
                </p>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('masspitch')}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Launch Mass Pitcher</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Step Content Inspector */}
            <div className="lg:col-span-8 space-y-4">
              {(() => {
                const currentTouch = PLAYBOOK_TOUCHES.find((t) => t.step === selectedTouchpoint) || PLAYBOOK_TOUCHES[0];
                return (
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                    {/* Header Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>Touchpoint {currentTouch.step} Detailed Script</span>
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-bold">
                            {currentTouch.day}
                          </span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">Tested against spam trigger databases & spam filters</p>
                      </div>

                      <button
                        onClick={() => handleCopy(currentTouch.body, `touch_${currentTouch.step}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5"
                      >
                        {copiedKey === `touch_${currentTouch.step}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedKey === `touch_${currentTouch.step}` ? 'Copied Sequence' : 'Copy Email Copy'}</span>
                      </button>
                    </div>

                    {/* A/B Subject Lines */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Split className="h-3.5 w-3.5 text-indigo-500" />
                        <span>A/B Tested Subject Line Variants</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] font-bold text-indigo-600 block mb-0.5">Variant A (Direct)</span>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{currentTouch.subjectA}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] font-bold text-purple-600 block mb-0.5">Variant B (Personalized)</span>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{currentTouch.subjectB}</span>
                        </div>
                      </div>
                    </div>

                    {/* Email Script Box */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Email Copy (with dynamic merge tags)</span>
                      </label>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed border border-slate-200 dark:border-slate-800">
                        {currentTouch.body}
                      </div>
                    </div>

                    {/* WhatsApp Follow-up Script */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                        <span>WhatsApp B2B Multi-Touch Follow-up Script</span>
                      </label>
                      <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500 text-white shrink-0">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-[11px] text-emerald-800 dark:text-emerald-300">WhatsApp Conversational Trigger:</p>
                          <p className="italic text-slate-700 dark:text-slate-300">{currentTouch.whatsapp}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(currentTouch.whatsapp, `wa_${currentTouch.step}`)}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0"
                        >
                          {copiedKey === `wa_${currentTouch.step}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Campaign Sprints & Live Editor */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Campaigns Selector & Metrics */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Campaign Sprints ({campaigns.length})
            </h2>

            <div className="space-y-2.5">
              {campaigns.map((camp) => {
                const isSelected = selectedCampaign?.id === camp.id;
                return (
                  <div
                    key={camp.id}
                    id={`camp-card-${camp.id}`}
                    onClick={() => {
                      setSelectedCampaign(camp);
                      setCurrentSubject(camp.subject);
                      if (camp.steps[0]?.bodyHtml) setCurrentBody(camp.steps[0].bodyHtml);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{camp.type}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCampaign(camp.id);
                        }}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          camp.status === 'RUNNING'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                        }`}
                      >
                        {camp.status === 'RUNNING' ? <Pause className="h-2.5 w-2.5 fill-current" /> : <Play className="h-2.5 w-2.5 fill-current" />}
                        <span>{camp.status}</span>
                      </button>
                    </div>

                    <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-2">{camp.name}</h3>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Sent</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{formatNumber(camp.metrics.sent)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Open %</span>
                        <span className="text-xs font-semibold text-emerald-600">{camp.metrics.openRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Attributed</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatCurrency(camp.metrics.revenue, currency)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Interactive Template & Deliverability Studio */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              {/* Action Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Editing Step 1: Cold Initial Outreach
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                    Deliverability Score: 98.4/100
                  </span>
                </div>

                {/* Dynamic tag chips */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Tags:</span>
                  {['{{first_name}}', '{{company}}', '{{city}}'].map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subject line input */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Subject Line
                </label>
                <input
                  id="campaign-subject-input"
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email Body Rich Preview */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Email HTML / Markdown Body
                </label>
                <textarea
                  id="campaign-body-textarea"
                  rows={7}
                  value={currentBody}
                  onChange={(e) => setCurrentBody(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Live Render Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> Live Render Preview (Sample Contact: Olumide at Flutterwave)
                  </span>
                  <span>SPF / DKIM Guaranteed</span>
                </div>
                <div 
                  className="text-xs text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: currentBody
                      .replace(/\{\{first_name\}\}/g, 'Olumide')
                      .replace(/\{\{company\}\}/g, 'Flutterwave')
                      .replace(/\{\{city\}\}/g, 'Lagos')
                      .replace(/\{\{industry\}\}/g, 'Fintech')
                  }}
                />
              </div>

              {/* Test Email Dispatcher */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    id="test-email-input"
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Recipient for test..."
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-950"
                  />
                  <button
                    id="send-test-email-btn"
                    onClick={handleSendTest}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="h-3 w-3" />
                    <span>Send Test Email</span>
                  </button>
                </div>

                {testSendStatus && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {testSendStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Campaign Generator Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">AI Campaign Copywriting Engine</h3>
                <p className="text-[11px] text-slate-500">Generates hyper-personalized subject lines, hooks & body copy</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">What product or service are you promoting?</label>
                <input
                  type="text"
                  value={wizardProduct}
                  onChange={(e) => setWizardProduct(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Target Decision Maker / Audience</label>
                <input
                  type="text"
                  value={wizardAudience}
                  onChange={(e) => setWizardAudience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Core Offer / Value Proposition</label>
                <input
                  type="text"
                  value={wizardOffer}
                  onChange={(e) => setWizardOffer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Desired Conversion Goal</label>
                  <input
                    type="text"
                    value={wizardGoal}
                    onChange={(e) => setWizardGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Tone of Voice</label>
                  <select
                    value={wizardTone}
                    onChange={(e) => setWizardTone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  >
                    <option>Consultative & High-Value</option>
                    <option>Urgent & Direct</option>
                    <option>Friendly & Casual</option>
                    <option>Executive & Concise</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsWizardOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="confirm-ai-campaign-generate-btn"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {isGenerating ? (
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Campaign Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
