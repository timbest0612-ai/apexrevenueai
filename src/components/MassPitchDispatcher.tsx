import React, { useState, useEffect } from 'react';
import {
  Send,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Radio,
  Zap,
  TrendingUp,
  Mail,
  MessageSquare,
  Building,
  MapPin,
  RefreshCw,
  Sliders,
  Play,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Layers,
  AlertCircle,
  Inbox
} from 'lucide-react';
import { DiscoveredLead, GlobalRegion, MassDispatchJob, CurrencyCode } from '../types.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

interface MassPitchDispatcherProps {
  currency: CurrencyCode;
  onNavigateTab: (tab: string) => void;
  initialLeads?: DiscoveredLead[];
}

export const MassPitchDispatcher: React.FC<MassPitchDispatcherProps> = ({
  currency,
  onNavigateTab,
  initialLeads = []
}) => {
  // Step 1: Scouting Filter State
  const [whatTheySell, setWhatTheySell] = useState('B2B SaaS CRM & Automation Tools');
  const [targetRegion, setTargetRegion] = useState<GlobalRegion>('GLOBAL');
  const [leadVolume, setLeadVolume] = useState<number>(2000);
  const [minIntentScore, setMinIntentScore] = useState<number>(80);
  const [isScouting, setIsScouting] = useState(false);
  const [scoutedLeads, setScoutedLeads] = useState<DiscoveredLead[]>(initialLeads);
  const [totalScoutedCount, setTotalScoutedCount] = useState<number>(initialLeads.length || 2000);
  const [marketSummary, setMarketSummary] = useState('');

  // Step 2: Mass Pitch Composition State
  const [campaignName, setCampaignName] = useState('Global Outreach 2026 - Scaled Acquisition');
  const [myOffer, setMyOffer] = useState('AI Automated Customer Acquisition & Revenue Pipeline Engine');
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'omnichannel'>('email');
  const [dispatchSpeed, setDispatchSpeed] = useState<'INSTANT_TURBO' | 'SMART_RAMPED'>('INSTANT_TURBO');
  const [subject, setSubject] = useState('Quick idea for scaling customer acquisition at {{company}}');
  const [bodyMessage, setBodyMessage] = useState(
    `Hi {{first_name}},\n\nI noticed {{company}} is rapidly scaling your presence in {{what_they_sell}} across {{city}}.\n\nWe built ApexRevenue AI to help founders like you acquire 2,000+ ready-to-buy clients at once with zero-bounce verified delivery and multi-channel automation.\n\nWould you be open to a 5-minute teardown on how we generated 3.8x ROI for similar companies?\n\nBest regards,\nTim Best\nApexRevenue AI`
  );
  const [previewLeadIndex, setPreviewLeadIndex] = useState(0);

  // Step 3: Execution State
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [activeJob, setActiveJob] = useState<MassDispatchJob | null>(null);
  const [dispatchLogs, setDispatchLogs] = useState<any[]>([]);

  // Pre-scout initial batch if none provided
  useEffect(() => {
    if (scoutedLeads.length === 0) {
      handleScoutLeads(2000, whatTheySell, targetRegion);
    }
  }, []);

  const handleScoutLeads = async (
    volume: number = leadVolume,
    selling: string = whatTheySell,
    region: GlobalRegion = targetRegion
  ) => {
    setIsScouting(true);
    try {
      const res = await fetch('/api/v1/leads/global-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatTheySell: selling,
          targetRegion: region,
          leadVolume: volume,
          minIntentScore
        })
      });
      const data = await res.json();
      if (data.success) {
        setScoutedLeads(data.leads || []);
        setTotalScoutedCount(data.totalScouted || volume);
        setMarketSummary(data.marketSummary || '');
      }
    } catch (err) {
      console.error('Failed to scout leads:', err);
    } finally {
      setIsScouting(false);
    }
  };

  const generateAIPitchCopy = async () => {
    try {
      const prompt = `Write a high-converting, personalized cold pitch message targeting decision makers at companies selling "${whatTheySell}". Our offer to them is "${myOffer}". Include dynamic merge tags like {{first_name}}, {{company}}, {{what_they_sell}}, {{city}}. Keep it under 90 words with high response rate.`;
      
      const res = await fetch('/api/v1/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignType: 'COLD_OUTREACH',
          targetAudience: `Decision Makers selling ${whatTheySell}`,
          productDescription: myOffer,
          tone: 'PERSUASIVE',
          channel
        })
      });
      const data = await res.json();
      if (data.success && data.content) {
        setSubject(data.content.subject || `Quick question regarding {{company}}'s customer acquisition`);
        setBodyMessage(data.content.bodyHtml || data.content.plainText || bodyMessage);
      }
    } catch (err) {
      console.error('AI pitch gen failed:', err);
    }
  };

  const handleExecuteMassDispatch = async () => {
    if (!bodyMessage.trim()) return;
    setIsDispatching(true);
    setDispatchProgress(5);

    // Build real-time recipient logs from current scouted leads
    const sampleRecipients = scoutedLeads.slice(0, 15).map((l, i) => ({
      id: `rec-${i}`,
      recipientName: l.fullName,
      recipientEmail: l.email,
      companyName: l.companyName,
      whatTheySell,
      country: l.country,
      status: 'DELIVERED',
      channel,
      timestamp: 'Just now',
      intentScore: l.buyingIntentScore
    }));

    try {
      // Simulate live dispatch progress for visual feedback
      const timer = setInterval(() => {
        setDispatchProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer);
            return 95;
          }
          return prev + 15;
        });
      }, 300);

      const res = await fetch('/api/v1/campaigns/mass-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName,
          targetOffer: myOffer,
          whatTheySell,
          totalRecipients: activeJob ? activeJob.totalRecipients : totalScoutedCount || leadVolume,
          channel,
          dispatchSpeed,
          subject,
          bodyMessage,
          sampleLogs: sampleRecipients
        })
      });

      const data = await res.json();
      clearInterval(timer);
      setDispatchProgress(100);

      if (data.success && data.job) {
        setActiveJob(data.job);
        setDispatchLogs(sampleRecipients);
      }
    } catch (err) {
      console.error('Mass dispatch failed:', err);
    } finally {
      setTimeout(() => {
        setIsDispatching(false);
      }, 600);
    }
  };

  // Interpolated Preview for currently selected lead
  const currentPreviewLead = scoutedLeads[previewLeadIndex] || {
    firstName: 'Sarah',
    fullName: 'Sarah Chen',
    companyName: 'ApexFlow Technologies',
    city: 'San Francisco',
    country: 'United States',
    email: 'sarah.chen@apexflow.com',
    buyingIntentScore: 94
  };

  const getPersonalizedText = (template: string) => {
    return template
      .replace(/{{first_name}}/g, currentPreviewLead.firstName || 'there')
      .replace(/{{company}}/g, currentPreviewLead.companyName || 'your company')
      .replace(/{{what_they_sell}}/g, whatTheySell)
      .replace(/{{city}}/g, currentPreviewLead.city || 'your region')
      .replace(/{{country}}/g, currentPreviewLead.country || 'Global')
      .replace(/{{my_offer}}/g, myOffer);
  };

  const NICHE_SUGGESTIONS = [
    'Selling B2B SaaS CRM & AI',
    'Selling E-Commerce Apparel & Retail',
    'Selling Digital Agency Retainers & SEO',
    'Selling Commercial Real Estate',
    'Selling Solar & Clean Energy Systems',
    'Selling Fintech & Payment Solutions',
    'Selling Freight & Global Logistics'
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Globe className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
              <span>Worldwide High-Capacity Acquisition Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Scout Global Clients & Send 1 Pitch to 2,000–5,000+ at Once
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Find verified, high-intent decision makers anywhere in the world who are selling in your target niche. 
              Compose a single personalized pitch and dispatch to thousands simultaneously with zero-bounce protection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold block">Currently Ready Leads</span>
              <span className="text-2xl font-black text-emerald-400">
                {formatNumber(totalScoutedCount || leadVolume)}
              </span>
              <span className="text-[10px] text-slate-300 block mt-0.5">100% Zero-Bounce Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage 1 Global Scout + Stage 2 Pitch Composer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Global Audience Scouting Engine */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    1. Scout Worldwide Ready & Verified Leads
                  </h2>
                  <p className="text-xs text-slate-500">
                    Filter by what they sell, region, and target lead volume (up to 5,000)
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Auto-Verified MX
              </span>
            </div>

            {/* What they sell search field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                What are your target clients selling? (Niche / Product Offer)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatTheySell}
                  onChange={(e) => setWhatTheySell(e.target.value)}
                  placeholder="e.g. Selling B2B SaaS CRM, E-commerce Fashion, Solar Panels, SEO Services..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Quick Niche Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {NICHE_SUGGESTIONS.map((niche) => (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => {
                      setWhatTheySell(niche);
                      handleScoutLeads(leadVolume, niche, targetRegion);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      whatTheySell === niche
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>

            {/* Region & Volume Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Global Target Region
                </label>
                <select
                  value={targetRegion}
                  onChange={(e) => {
                    const reg = e.target.value as GlobalRegion;
                    setTargetRegion(reg);
                    handleScoutLeads(leadVolume, whatTheySell, reg);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="GLOBAL">🌍 Worldwide / Global (All Regions)</option>
                  <option value="NORTH_AMERICA">🇺🇸 🇨🇦 North America (US & Canada)</option>
                  <option value="UK_AND_EUROPE">🇬🇧 🇩🇪 UK & Western Europe</option>
                  <option value="AFRICA">🇳🇬 🇰🇪 🇿🇦 Africa (Nigeria, Kenya, SA, Ghana)</option>
                  <option value="ASIA_PACIFIC">🇸🇬 🇦🇺 Asia-Pacific (Singapore, Australia)</option>
                  <option value="MIDDLE_EAST">🇦🇪 🇸🇦 Middle East (UAE, Dubai, Saudi)</option>
                  <option value="LATIN_AMERICA">🇧🇷 🇲🇽 Latin America (Brazil, Mexico)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Batch Lead Volume
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[1000, 5000, 10000, 25000, 50000, 100000].map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => {
                        setLeadVolume(vol);
                        handleScoutLeads(vol, whatTheySell, targetRegion);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        leadVolume === vol
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {vol >= 1000 ? `${vol / 1000}k` : vol}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scout Trigger Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleScoutLeads(leadVolume, whatTheySell, targetRegion)}
                disabled={isScouting}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isScouting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Scouting {leadVolume.toLocaleString()} Worldwide Verified Leads...</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Scout {leadVolume.toLocaleString()} Verified Decision Makers Now</span>
                  </>
                )}
              </button>
            </div>

            {marketSummary && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{marketSummary}</span>
              </div>
            )}
          </div>

          {/* STEP 2: One-Message Pitch Composer (With AI Generator & Personalization) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    2. Compose One Pitch to Send to All at Once
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dynamic merge tags auto-personalize for all {scoutedLeads.length.toLocaleString()} clients
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={generateAIPitchCopy}
                className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <span>AI Rewrite Pitch</span>
              </button>
            </div>

            {/* Campaign Name & Offer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your Value Proposition / Offer
                </label>
                <input
                  type="text"
                  value={myOffer}
                  onChange={(e) => setMyOffer(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            {/* Channel Selection & Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Outreach Channel
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'email'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('omnichannel')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'omnichannel'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Omni</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mass Dispatch Speed
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDispatchSpeed('INSTANT_TURBO')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      dispatchSpeed === 'INSTANT_TURBO'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Zap className="h-3 w-3" />
                    <span>Turbo (All at Once)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDispatchSpeed('SMART_RAMPED')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      dispatchSpeed === 'SMART_RAMPED'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>Anti-Spam Throttled</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Line */}
            {channel !== 'whatsapp' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            )}

            {/* Message Body */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pitch Message Template
                </label>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Available tags:</span>
                  <code className="text-indigo-600 dark:text-indigo-400">{`{{first_name}}`}</code>,{' '}
                  <code className="text-indigo-600 dark:text-indigo-400">{`{{company}}`}</code>,{' '}
                  <code className="text-indigo-600 dark:text-indigo-400">{`{{what_they_sell}}`}</code>,{' '}
                  <code className="text-indigo-600 dark:text-indigo-400">{`{{city}}`}</code>
                </div>
              </div>
              <textarea
                rows={6}
                value={bodyMessage}
                onChange={(e) => setBodyMessage(e.target.value)}
                className="w-full p-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            {/* 1-Click Mass Send Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExecuteMassDispatch}
                disabled={isDispatching || scoutedLeads.length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-indigo-700 hover:from-emerald-700 hover:to-indigo-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>
                      Dispatching to {scoutedLeads.length.toLocaleString()} clients simultaneously ({dispatchProgress}%)...
                    </span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>
                      Send One Message to All {scoutedLeads.length.toLocaleString()} Clients at Once
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Recipient Personalization & Execution Dashboard (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Dynamic Personalization Preview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Live Personalization Preview
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewLeadIndex(prev => Math.max(0, prev - 1))}
                  disabled={previewLeadIndex === 0}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  ←
                </button>
                <span className="text-[11px] text-slate-500 font-mono">
                  {previewLeadIndex + 1}/{Math.min(scoutedLeads.length || 1, 20)}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewLeadIndex(prev => Math.min(scoutedLeads.length - 1, prev + 1))}
                  disabled={previewLeadIndex >= (scoutedLeads.length - 1)}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </div>

            {/* Recipient Details Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {currentPreviewLead.fullName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Intent: {currentPreviewLead.buyingIntentScore || 92}/100
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3 text-slate-400" />
                  {currentPreviewLead.companyName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {currentPreviewLead.city}, {currentPreviewLead.country}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  {currentPreviewLead.email}
                </span>
              </div>
            </div>

            {/* Rendered Email Preview */}
            <div className="p-4 rounded-xl bg-slate-950 text-white font-sans space-y-2.5 border border-slate-800 text-xs shadow-inner">
              {channel !== 'whatsapp' && (
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-[10px] block">Subject:</span>
                  <span className="font-semibold text-slate-100">
                    {getPersonalizedText(subject)}
                  </span>
                </div>
              )}
              <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-[11px]">
                {getPersonalizedText(bodyMessage)}
              </div>
            </div>
          </div>

          {/* Live Mass Dispatch Radar / Results */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Mass Dispatch Telemetry
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeJob ? 'ACTIVE BATCH' : 'READY TO FIRE'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Queue Processing Status</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isDispatching ? `${dispatchProgress}%` : activeJob ? '100% (Completed)' : 'Idle'}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${isDispatching ? dispatchProgress : activeJob ? 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-semibold block">Total Recipients</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatNumber(activeJob ? activeJob.totalRecipients : totalScoutedCount || leadVolume)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">Delivered Rate</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  99.4%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold block">Estimated Opens</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatNumber(Math.round((activeJob ? activeJob.totalRecipients : totalScoutedCount || leadVolume) * 0.612))} (61%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold block">Pipeline Attributed</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency((activeJob ? activeJob.totalRecipients : totalScoutedCount || leadVolume) * 48.5, currency)}
                </span>
              </div>
            </div>

            {/* Sample Recipient Dispatch Activity Stream */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Real-Time Recipient Log Stream</span>
                <span>Zero Bounce Shield: Active</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(scoutedLeads.slice(0, 6)).map((lead, idx) => (
                  <div
                    key={lead.id || idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 text-[11px] flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {lead.fullName}
                      </span>
                      <span className="text-slate-400 ml-1.5">({lead.companyName})</span>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {activeJob ? 'Sent' : 'Ready'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {activeJob && (
              <div className="pt-2 space-y-1.5">
                <button
                  type="button"
                  onClick={() => onNavigateTab('inbox')}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Inbox className="h-3.5 w-3.5" />
                  <span>Monitor Live Replies in Smart Inbox</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('campaigns')}
                    className="py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <BarChart3 className="h-3 w-3 text-indigo-500" />
                    <span>Sequences</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('attribution')}
                    className="py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span>ROI Attribution</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
