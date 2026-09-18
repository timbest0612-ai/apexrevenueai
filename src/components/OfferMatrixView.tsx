import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Plus, 
  Check, 
  ArrowUpRight, 
  HelpCircle, 
  Layers, 
  Percent, 
  Sliders, 
  Copy, 
  Download, 
  Zap, 
  Award,
  AlertCircle,
  Repeat,
  ShoppingBag
} from 'lucide-react';
import { GrandSlamOffer, OrderBump, UpsellPath, DownsellOption, GuaranteeOption } from '../types.js';

interface OfferMatrixViewProps {
  initialProduct?: string;
  onNavigateToDealRoom?: (productName: string) => void;
  onNavigateToPitch?: (pitchContext: string) => void;
}

export function OfferMatrixView({ initialProduct, onNavigateToDealRoom, onNavigateToPitch }: OfferMatrixViewProps) {
  // Active product offer state
  const [productName, setProductName] = useState(initialProduct || 'Apex AI Revenue System');
  const [targetBuyerRole, setTargetBuyerRole] = useState('Founders, VP of Sales & Agency Owners');
  const [primaryBuyerPain, setPrimaryBuyerPain] = useState('High SDR burn rate ($8,000/mo) with low email deliverability and empty sales pipelines');
  const [dreamOutcome, setDreamOutcome] = useState('Consistent $50k-$200k/mo predictable pipeline with zero SDR overhead and 100% verified inbox placement');
  const [corePrice, setCorePrice] = useState(1997);
  const [deliveryFormat, setDeliveryFormat] = useState<GrandSlamOffer['deliveryFormat']>('HYBRID_CONSULTING');

  // Alex Hormozi $100M Value Equation Variables (1 to 10 scale)
  const [dreamOutcomeScore, setDreamOutcomeScore] = useState(9); // Top: Dream Outcome
  const [perceivedLikelihood, setPerceivedLikelihood] = useState(9); // Top: Perceived Likelihood
  const [timeDelayReduction, setTimeDelayReduction] = useState(8); // Bottom: Time Delay (higher = faster turnaround)
  const [effortSacrificeReduction, setEffortSacrificeReduction] = useState(9); // Bottom: Effort & Sacrifice (higher = lower effort for buyer)

  // Order Bumps
  const [orderBumps, setOrderBumps] = useState<OrderBump[]>([
    {
      id: 'bump-1',
      title: 'VIP 1-on-1 DNS & Inbox Warmup Concierge',
      price: 297,
      tagline: 'Engineers configure all SPF, DKIM, DMARC, and custom tracking domains within 4 hours',
      perceivedValue: 997,
      takeRatePercentage: 42,
      active: true,
    },
    {
      id: 'bump-2',
      title: 'Done-For-You High-Converting Pitch Asset Vault',
      price: 197,
      tagline: '500+ battle-tested cold pitch templates across 25 B2B niches with 38% reply rates',
      perceivedValue: 697,
      takeRatePercentage: 58,
      active: true,
    },
    {
      id: 'bump-3',
      title: 'Emergency Priority Deliverability SLA & Dedicated IP',
      price: 497,
      tagline: 'Guaranteed 15-minute response time & dedicated rotation IP pool for critical outreach',
      perceivedValue: 1497,
      takeRatePercentage: 24,
      active: false,
    }
  ]);

  // Upsell Paths (Ascension)
  const [upsells, setUpsells] = useState<UpsellPath[]>([
    {
      id: 'up-1',
      title: 'Fractional AI Revenue Operations Team',
      price: 2497,
      recurringMonthly: true,
      valueProposition: 'Dedicated outbound copywriter & prompt engineer managing continuous campaigns weekly',
      profitMargin: 82,
      active: true,
    },
    {
      id: 'up-2',
      title: 'Private Custom Lead Scraping Cluster (500k/mo)',
      price: 1497,
      recurringMonthly: true,
      valueProposition: 'Direct dedicated worker threads with zero rate limits for massive enterprise campaigns',
      profitMargin: 90,
      active: true,
    }
  ]);

  // Downsell Options (Catch price-sensitive buyers instead of losing them)
  const [downsells] = useState<DownsellOption[]>([
    {
      id: 'down-1',
      title: 'Apex Self-Serve Fast-Track License',
      price: 697,
      paymentSplit: '3 monthly payments of $249',
      preservesMargin: 78,
      idealFor: 'Bootstrapped founders who have time to configure campaigns themselves',
    },
    {
      id: 'down-2',
      title: 'Lead Discovery & Verification Only Pass',
      price: 397,
      paymentSplit: '1-time payment for 25,000 verified leads',
      preservesMargin: 88,
      idealFor: 'Teams that already have an existing sending infrastructure but lack high-intent leads',
    }
  ]);

  // Guarantees
  const [guarantees] = useState<GuaranteeOption[]>([
    {
      id: 'guar-1',
      type: 'MILESTONE_PERFORMANCE',
      title: 'The 30-Day Pipeline or 100% Free Guarantee',
      description: 'If you do not generate at least 15 qualified sales conversations in your first 30 days using our verified playbook, our team works with you for free until you do.',
      buyerRiskReduction: 'Eliminates 95% of buyer fear regarding non-performance',
      conversionMultiplier: '+64% Close Rate',
    },
    {
      id: 'guar-2',
      type: 'SHARED_ESCROW',
      title: '50/50 Milestone Escrow Release',
      description: 'Pay 50% upfront to initiate infrastructure setup; remaining 50% is only released upon delivery of your first 10,000 verified prospects.',
      buyerRiskReduction: 'Protects buyer cash flow and aligns seller incentives strictly with execution',
      conversionMultiplier: '+48% Close Rate',
    },
    {
      id: 'guar-3',
      type: 'UNCONDITIONAL',
      title: '14-Day Zero-Questions Full Refund',
      description: 'Inspect everything, launch test batches, and if you are not blown away by data accuracy and speed, get an instant 100% refund.',
      buyerRiskReduction: 'Completely zero-friction trial for first-time buyers',
      conversionMultiplier: '+35% Close Rate',
    }
  ]);
  const [selectedGuaranteeId, setSelectedGuaranteeId] = useState<string>('guar-1');

  // Copied feedback toast
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Hormozi Value Equation calculation:
  // Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort & Sacrifice)
  // We normalize so 10/10/10/10 = 100 Score
  const numerator = dreamOutcomeScore * perceivedLikelihood; // max 100
  // Lower time delay and lower effort is better, so our sliders represent "Reduction of delay / Effortlessness"
  const denominatorFactor = ((11 - timeDelayReduction) * (11 - effortSacrificeReduction)) / 10;
  const rawScore = Math.min(100, Math.round((numerator / Math.max(1, denominatorFactor)) * 10));
  const hormoziScore = Math.max(12, Math.min(100, rawScore));

  // Financial Modeling & Average Order Value (AOV) Boost
  const activeBumps = orderBumps.filter(b => b.active);
  const bumpAddedRevenuePerCustomer = activeBumps.reduce((acc, b) => acc + (b.price * (b.takeRatePercentage / 100)), 0);
  const modeledAOV = Math.round(corePrice + bumpAddedRevenuePerCustomer);
  const aovIncreasePct = Math.round(((modeledAOV - corePrice) / corePrice) * 100);

  const activeUpsells = upsells.filter(u => u.active);
  const upsellAnnualizedLift = activeUpsells.reduce((acc, u) => acc + (u.price * (u.recurringMonthly ? 12 : 1) * 0.18), 0); // assuming 18% take rate

  const toggleBump = (id: string) => {
    setOrderBumps(orderBumps.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const toggleUpsell = (id: string) => {
    setUpsells(upsells.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const handleCopyPitchOffer = () => {
    const activeG = guarantees.find(g => g.id === selectedGuaranteeId);
    const text = `🎯 THE OFFER SUMMARY:
Product: ${productName}
Target: ${targetBuyerRole}
Problem Solved: ${primaryBuyerPain}
Dream Outcome: ${dreamOutcome}
Core Investment: $${corePrice.toLocaleString()}
Recommended Add-ons: ${activeBumps.map(b => `${b.title} (+$${b.price})`).join(', ') || 'None'}
Risk Reversal Guarantee: ${activeG ? `${activeG.title} - ${activeG.description}` : 'Standard Warranty'}
Average Projected Buyer Payback: Under 21 Days`;

    navigator.clipboard.writeText(text);
    setCopyToast('Offer Stack copied to clipboard!');
    setTimeout(() => setCopyToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Sellers Profit Multiplier & Buyer Pain Eraser
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Grand Slam Offer & Value Architecture Studio
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Why buyers hesitate: <span className="text-amber-300 font-medium">high perceived risk, unclear ROI, and decision fatigue</span>. 
              Engineer an irresistible offer stack with risk-reversal guarantees, order bumps, and downsell safety nets that multiply your average order value (AOV) by 30%–60%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyPitchOffer}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Offer Stack
            </button>
            {onNavigateToDealRoom && (
              <button
                onClick={() => onNavigateToDealRoom(productName)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Launch Buyer Deal Room
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block">Offer Attractiveness Score</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xl font-bold ${hormoziScore >= 80 ? 'text-emerald-400' : hormoziScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {hormoziScore}/100
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-medium">
                {hormoziScore >= 80 ? 'No-Brainer Tier' : 'Needs Higher Proof'}
              </span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block">Base Price vs Modeled AOV</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono">
              <span className="text-slate-300 line-through text-xs">${corePrice.toLocaleString()}</span>
              <span className="text-xl font-bold text-emerald-400">${modeledAOV.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block">Immediate Revenue Boost</span>
            <span className="text-xl font-bold text-indigo-400 mt-1 block">
              +{aovIncreasePct}% per Sale
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Active Risk Reversal</span>
            <span className="text-xs font-semibold text-amber-300 mt-1 block truncate">
              {guarantees.find(g => g.id === selectedGuaranteeId)?.title}
            </span>
          </div>
        </div>
      </div>

      {copyToast && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{copyToast}</span>
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Grid: Left Column = Product Profile & The Value Equation; Right Column = Bumps, Upsells & Guarantees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Core Product & Value Equation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Core Product Parameters Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">1. Product Core Specification</h3>
              </div>
              <span className="text-[11px] text-slate-400">Foundation</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product or Solution Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Buyer Title / Industry
              </label>
              <input
                type="text"
                value={targetBuyerRole}
                onChange={e => setTargetBuyerRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Buyer Pain / Cost of Inaction (COI)
              </label>
              <textarea
                rows={2}
                value={primaryBuyerPain}
                onChange={e => setPrimaryBuyerPain(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Buyer Dream Outcome
              </label>
              <textarea
                rows={2}
                value={dreamOutcome}
                onChange={e => setDreamOutcome(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Core Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={corePrice}
                    onChange={e => setCorePrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Model
                </label>
                <select
                  value={deliveryFormat}
                  onChange={e => setDeliveryFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                >
                  <option value="SaaS">SaaS Platform</option>
                  <option value="DONE_FOR_YOU">Done-For-You (Agency)</option>
                  <option value="HYBRID_CONSULTING">Hybrid (Software + Service)</option>
                  <option value="DIGITAL_PRODUCT">Digital Asset / License</option>
                  <option value="PHYSICAL_GOODS">Physical Product</option>
                </select>
              </div>
            </div>
          </div>

          {/* The $100M Value Equation Diagnostic */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2. The $100M Value Equation</h3>
              </div>
              <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
                Score: {hormoziScore}/100
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Price resistance dissolves when <span className="font-semibold text-slate-700 dark:text-slate-200">Value &gt;&gt; Price</span>. 
              Increase top multipliers (Dream Outcome, Certainty) and minimize bottom friction (Time Delay, Effort).
            </p>

            {/* Slider 1: Dream Outcome */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">Dream Outcome Clarity & Status</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{dreamOutcomeScore}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={dreamOutcomeScore} 
                onChange={e => setDreamOutcomeScore(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">How vividly does the buyer see themselves achieving their dream goal?</span>
            </div>

            {/* Slider 2: Perceived Likelihood */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">Perceived Likelihood of Success</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{perceivedLikelihood}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={perceivedLikelihood} 
                onChange={e => setPerceivedLikelihood(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Backed by proof points, live verified data, and zero-bounce guarantees.</span>
            </div>

            {/* Slider 3: Time Delay Reduction */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">Speed to First Aha / Value (Time Delay Elimination)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{timeDelayReduction}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={timeDelayReduction} 
                onChange={e => setTimeDelayReduction(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Higher score = instant results (e.g. leads ready in 60 seconds).</span>
            </div>

            {/* Slider 4: Effort & Sacrifice Reduction */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">Effortlessness for the Buyer (Done-For-You Factor)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{effortSacrificeReduction}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={effortSacrificeReduction} 
                onChange={e => setEffortSacrificeReduction(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Turnkey templates and automated workflows require zero manual coding.</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Order Bumps, Upsells, Downsell Rescue & Guarantees */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order Bumps Card (Immediate Profit Boost) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">3. One-Click Order Bumps (Checkout Maximizer)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                +${Math.round(bumpAddedRevenuePerCustomer)} avg / buyer
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              30%–60% of eager buyers click an impulse order bump if it solves the immediate next problem (e.g. setup, templates, priority speed).
            </p>

            <div className="space-y-3">
              {orderBumps.map(bump => (
                <div 
                  key={bump.id}
                  onClick={() => toggleBump(bump.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    bump.active 
                      ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center ${
                      bump.active ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {bump.active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{bump.title}</span>
                        <span className="text-[10px] line-through text-slate-400">${bump.perceivedValue} value</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{bump.tagline}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Expected Take-Rate: ~{bump.takeRatePercentage}%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                    +${bump.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantees & Risk-Reversal Architecture */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">4. Risk-Reversal & Guarantee Architecture</h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                Kills Buyer Hesitation
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              The #1 reason buyers don't buy is fear of losing money or looking stupid. A bulletproof guarantee puts 100% of the risk on the seller.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {guarantees.map(guar => {
                const isSelected = selectedGuaranteeId === guar.id;
                return (
                  <div
                    key={guar.id}
                    onClick={() => setSelectedGuaranteeId(guar.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500/60 bg-indigo-500/5 dark:bg-indigo-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{guar.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        {guar.conversionMultiplier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 pl-5">
                      {guar.description}
                    </p>
                    <div className="mt-2 pl-5 text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Award className="w-3 h-3" />
                      <span>{guar.buyerRiskReduction}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Downsell Rescue & Upsell Ascension */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Downsell Safety Net */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Downsell Rescue Matrix</h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Never let a price-sensitive lead walk away empty handed. Offer a cash-friendly alternative:
              </p>
              <div className="space-y-2">
                {downsells.map(d => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{d.title}</span>
                      <span className="text-amber-600 dark:text-amber-400">${d.price}</span>
                    </div>
                    <div className="text-slate-400 mt-0.5">{d.paymentSplit}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      Preserves {d.preservesMargin}% Profit Margin
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upsell High-Ticket Ascension */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Backend Ascension Upsell</h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                The top 20% of your buyers want the fastest, highest-touch VIP result possible:
              </p>
              <div className="space-y-2">
                {upsells.map(u => (
                  <div 
                    key={u.id}
                    onClick={() => toggleUpsell(u.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer text-[11px] ${
                      u.active ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{u.title}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">+${u.price}{u.recurringMonthly && '/mo'}</span>
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5">{u.valueProposition}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                      {u.profitMargin}% Net Margin Tier
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Ready to Pitch this Irresistible Offer?</h4>
            <p className="text-[11px] text-slate-400">Inject this grand slam stack directly into Mass Pitch Dispatcher or load it into a dedicated Buyer Deal Room.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToPitch && (
            <button
              onClick={() => onNavigateToPitch(`Offer: ${productName} ($${corePrice}) with Guarantee: ${guarantees.find(g => g.id === selectedGuaranteeId)?.title}`)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
            >
              Transfer to Mass Pitch
            </button>
          )}
          {onNavigateToDealRoom && (
            <button
              onClick={() => onNavigateToDealRoom(productName)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30"
            >
              <ArrowUpRight className="w-4 h-4" />
              Open Buyer Deal Room (MAP)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
