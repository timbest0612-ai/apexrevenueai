import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Swords, 
  DollarSign, 
  Clock, 
  Layers, 
  Award, 
  Check, 
  Copy, 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Flame, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { ObjectionCard, CompetitorBattlecard } from '../types.js';

interface ObjectionBattlecardViewProps {
  onCopyScript?: (scriptText: string) => void;
  onNavigateToSmartInbox?: () => void;
}

export function ObjectionBattlecardView({ onCopyScript, onNavigateToSmartInbox }: ObjectionBattlecardViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeObjectionId, setActiveObjectionId] = useState<string>('obj-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Battle-tested objection arsenal
  const [objections] = useState<ObjectionCard[]>([
    {
      id: 'obj-1',
      category: 'PRICE_BUDGET',
      buyerObjectionText: '"Your solution is too expensive / We don\'t have the budget right now."',
      psychologicalFear: 'Fear of losing capital on an unproven tool and being blamed if ROI doesn\'t materialize.',
      theReframeStrategy: 'Pivot from Price to Cost of Inaction (COI). Show that doing nothing costs 3x more per month in wasted salaries than the software itself.',
      battleTestedScript: 'I completely respect that budget discipline is paramount right now. Can I share what our other clients found? Before joining us, they were paying SDRs $7,000/mo to manually scrub outdated lists with an 8% bounce rate. The real budget leak was the $84,000/yr in unworked pipeline. Because our system guarantees zero bounces and delivers verified prospect leads, it typically pays for itself within 18 days. If I could mathematically demonstrate how this saves $4,200/mo in direct overhead starting in week two, would it be worth a brief look?',
      proofAssetSnippet: 'Case Study: TrendFlow reduced customer acquisition cost from $420 to $68 within 24 days while cutting 3 SDR software subscriptions.',
      winRateImpact: '+42% Objection Save Rate',
    },
    {
      id: 'obj-2',
      category: 'COMPETITOR',
      buyerObjectionText: '"We already use Apollo / ZoomInfo / Clay / Instantly."',
      psychologicalFear: 'Reluctance to switch tools and disrupt an existing setup; fear of redundancy.',
      theReframeStrategy: 'Do not attack the competitor. Compliment them for baseline data, but highlight their fatal flaw: stale databases and 15–20% bounce rates that burn company domain reputations.',
      battleTestedScript: 'Apollo and ZoomInfo are solid foundational databases! However, their biggest vulnerability is stale cached records—sending to 15% outdated emails silently burns your primary Google/Outlook domain reputation until you land in spam permanently. We don\'t replace your existing stack; our zero-bounce verification engine and live signal radar sit on top to pre-clean and automate mass pitches so you get 3x higher inbox delivery. Most clients keep their current tools and use us as their high-yield conversion layer.',
      proofAssetSnippet: 'Benchmark: Apex users maintain 99.4% domain inbox placement compared to the 81.2% industry average on scraped databases.',
      winRateImpact: '+56% Competitor Defense Rate',
    },
    {
      id: 'obj-3',
      category: 'TIMING',
      buyerObjectionText: '"Now isn\'t a good time. Let\'s revisit next quarter / Q4."',
      psychologicalFear: 'Procrastination and fear of immediate disruption; priority competition.',
      theReframeStrategy: 'Reframe timing around compounding pipeline lag. Deals won in Q4 must be planted in Q3. Waiting 90 days creates an empty revenue cliff in the future.',
      battleTestedScript: 'I completely understand that timing is critical. The one pattern we notice with high-growth teams is that the pipeline you need next quarter has to be built today. If you wait 90 days to initiate prospecting, you face a 60-day revenue lag where your reps have empty calendars in Q4. Setting up our system takes under 4 hours, and our 30-day milestone guarantee ensures your pipeline is already filled before your next board review.',
      proofAssetSnippet: 'Stat: Outbound pipelines started in late quarters experience a 4.2x higher pipeline deficit at year-end.',
      winRateImpact: '+38% Timing Objection Reversal',
    },
    {
      id: 'obj-4',
      category: 'COMPLEXITY',
      buyerObjectionText: '"Our team doesn\'t have the bandwidth or technical capacity to learn another platform."',
      psychologicalFear: 'Fear of long onboarding cycles, complicated training sessions, and shelfware guilt.',
      theReframeStrategy: 'Demonstrate Turnkey Concierge Setup. Highlight that the seller handles 90% of the heavy lifting (DNS, warmup, initial lead batches).',
      battleTestedScript: 'That is exactly why we engineered this as a done-with-you concierge system rather than a complex enterprise suite. Our engineers configure all SPF, DKIM, DMARC, and custom tracking domains for you within 4 hours. Your team doesn\'t need to learn complicated setup scripts—we deliver ready-to-contact verified prospect lists directly into your CRM. Your reps only do what they love: talking to qualified buyers.',
      proofAssetSnippet: 'Average customer onboarding duration: 3.5 hours from sign-off to first active campaign dispatch.',
      winRateImpact: '+61% Complexity Defusal Rate',
    },
    {
      id: 'obj-5',
      category: 'TRUST_PROOF',
      buyerObjectionText: '"How do I know this will actually work for OUR specific niche and buyers?"',
      psychologicalFear: 'Fear of being a guinea pig in an unproven market; skepticism towards generic AI tools.',
      theReframeStrategy: 'Leverage hyper-niche targeting filters and the 30-Day Milestone Guarantee. Let them see actual live prospects from their exact niche before committing.',
      battleTestedScript: 'That is the single smartest question you could ask, because generic outreach completely fails in specialized markets. That\'s why our Discovery engine filters by your exact niche, target audience pain points, and specific product offerings. Even better: we don\'t ask you to take our word for it. We back our deployment with a 30-Day Milestone Guarantee—if you don\'t generate at least 15 qualified sales conversations in your specific niche, we work for free until you do.',
      proofAssetSnippet: 'Deployed across 48 distinct B2B industries with over 2.4 million verified prospects delivered.',
      winRateImpact: '+73% Trust Conversion Rate',
    }
  ]);

  // Competitor Flanking Battlecards
  const [battlecards] = useState<CompetitorBattlecard[]>([
    {
      id: 'comp-1',
      competitorName: 'Apollo.io / ZoomInfo',
      competitorCategory: 'Legacy Static Databases',
      theirWeakness: 'Static scraped records that become outdated within 90 days, leading to high bounce rates and domain burnout.',
      ourUnfairAdvantage: 'Real-time multi-stage verification (SMTP handshake, Catch-All detection, disposable filters) with 0-bounce guarantee and custom AI pitch generation.',
      switchingEaseScore: '1-Click Migration (Under 10 mins)',
      landmineToPlant: '"What is your contractual refund or replacement policy when 15% of your scraped leads bounce and black-list our domain?"',
    },
    {
      id: 'comp-2',
      competitorName: 'Traditional Outbound SDR Agency',
      competitorCategory: 'Human SDR Retainers ($6k–$10k/mo)',
      theirWeakness: 'High turnover, 2-3 months to hire/ramp, erratic consistency, and massive monthly payroll overhead.',
      ourUnfairAdvantage: '1/5th the cost, zero ramp time, 24/7 automated mass pitch dispatching, and full ownership of your data and infrastructure.',
      switchingEaseScore: 'Instant Day-1 Activation',
      landmineToPlant: '"How many months of ramp salary do we pay before seeing our first guaranteed sales conversation?"',
    },
    {
      id: 'comp-3',
      competitorName: 'Clay / Make / Custom Zapier Stacks',
      competitorCategory: 'DIY Workflow Builders',
      theirWeakness: 'Fragile API connectors, requires advanced prompt engineers, expensive multi-tier credit subscriptions across 5 tools.',
      ourUnfairAdvantage: 'Unified all-in-one OS: Discovery + Verification + Spam Audit + Mass Pitch + CRM + Deal Room without maintaining complex webhooks.',
      switchingEaseScore: 'Consolidates 4 tools into 1',
      landmineToPlant: '"Who maintains the Zapier workflow when an API webhook breaks mid-campaign?"',
    }
  ]);

  const filteredObjections = objections.filter(obj => {
    const matchesCategory = selectedCategory === 'ALL' || obj.category === selectedCategory;
    const matchesSearch = obj.buyerObjectionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          obj.battleTestedScript.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeObjection = objections.find(o => o.id === activeObjectionId) || objections[0];

  const handleCopyScript = (script: string, id: string) => {
    navigator.clipboard.writeText(script);
    setCopiedId(id);
    if (onCopyScript) onCopyScript(script);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-900/50 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              Objection Decimator & Competitor Matrix
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Turn Buyer Skepticism Into High-Margin Closes
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              When buyers say "Too expensive" or "We already use someone else", inexperienced sellers give discounts or give up. 
              Use battle-tested psychological reframes and competitor flanking scripts that dismantle buyer objections in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToSmartInbox && (
              <button
                onClick={onNavigateToSmartInbox}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-600/30"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Reply to Leads in Smart Inbox
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
          {[
            { id: 'ALL', label: 'All Objections' },
            { id: 'PRICE_BUDGET', label: '💰 Price & Budget' },
            { id: 'COMPETITOR', label: '⚔️ Competitor & Switching' },
            { id: 'TIMING', label: '⏳ Timing & Procrastination' },
            { id: 'COMPLEXITY', label: '⚙️ Complexity & Bandwidth' },
            { id: 'TRUST_PROOF', label: '🛡️ Trust & Specific Niche' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left = Objection List; Right = Selected Reframe & Word-for-Word Script */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (5 cols): Objections Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search objections (e.g. price, timing, competitor)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-hidden shadow-xs"
            />
          </div>

          <div className="space-y-2.5">
            {filteredObjections.map(obj => {
              const isSelected = activeObjectionId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => setActiveObjectionId(obj.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500/60 bg-amber-500/5 dark:bg-amber-950/20 shadow-xs ring-1 ring-amber-500/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {obj.buyerObjectionText}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0">
                      {obj.winRateImpact}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {obj.theReframeStrategy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Deep Reframe Breakdown & Word-for-Word Script */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Active Reframe Framework
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeObjection.buyerObjectionText}
                </h3>
              </div>
              <button
                onClick={() => handleCopyScript(activeObjection.battleTestedScript, activeObjection.id)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                {copiedId === activeObjection.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === activeObjection.id ? 'Script Copied!' : 'Copy Script'}
              </button>
            </div>

            {/* 1. Psychological Fear */}
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs">
              <span className="font-bold text-rose-800 dark:text-rose-300 block mb-0.5">
                🧠 The Hidden Psychological Fear (What They Really Mean):
              </span>
              <p className="text-rose-700 dark:text-rose-300/90 leading-relaxed">
                {activeObjection.psychologicalFear}
              </p>
            </div>

            {/* 2. Reframe Strategy */}
            <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-xs">
              <span className="font-bold text-indigo-800 dark:text-indigo-300 block mb-0.5">
                🎯 The Reframe Strategy:
              </span>
              <p className="text-indigo-700 dark:text-indigo-300/90 leading-relaxed">
                {activeObjection.theReframeStrategy}
              </p>
            </div>

            {/* 3. Word-for-Word Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Word-For-Word Counter Script (Email / Phone / WhatsApp)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Ready to send</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed relative">
                {activeObjection.battleTestedScript}
              </div>
            </div>

            {/* 4. Matched Proof Snippet */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                📊 Irrefutable Proof Asset to Attach:
              </span>
              <p className="text-emerald-700 dark:text-emerald-300/90 font-medium">
                {activeObjection.proofAssetSnippet}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Competitor Flanking Battlecards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Competitor Flanking Battlecards & "Landmine" Question Generator
            </h3>
          </div>
          <span className="text-xs text-slate-400">Position against incumbent alternatives</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Plant strategic questions in the buyer's mind that expose competitors' fatal flaws without you needing to talk negatively about them.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {battlecards.map(card => (
            <div key={card.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  {card.competitorCategory}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{card.competitorName}</h4>
              </div>

              <div className="text-[11px] space-y-2">
                <div>
                  <span className="font-semibold text-rose-500 block">Their Fatal Weakness:</span>
                  <p className="text-slate-600 dark:text-slate-400">{card.theirWeakness}</p>
                </div>
                <div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Our Unfair Advantage:</span>
                  <p className="text-slate-600 dark:text-slate-400">{card.ourUnfairAdvantage}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block text-[10px] uppercase">
                    💣 Landmine Question to Prompt the Buyer:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 italic text-[11px] mt-0.5">{card.landmineToPlant}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
