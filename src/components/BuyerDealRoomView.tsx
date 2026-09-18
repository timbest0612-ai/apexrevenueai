import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Calculator, 
  FileText, 
  Share2, 
  Check, 
  Download, 
  ExternalLink, 
  ArrowRight, 
  Building2, 
  User, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  AlertTriangle,
  Send,
  Lock
} from 'lucide-react';
import { BuyerDealRoom, DealMilestone } from '../types.js';

interface BuyerDealRoomViewProps {
  initialProductName?: string;
  onNavigateToCRM?: () => void;
}

export function BuyerDealRoomView({ initialProductName, onNavigateToCRM }: BuyerDealRoomViewProps) {
  // Deal Room State
  const [dealName, setDealName] = useState('Acme Corp × Apex Revenue AI Deal Room');
  const [clientCompany, setClientCompany] = useState('Acme Global Enterprises');
  const [clientDecisionMaker, setClientDecisionMaker] = useState('Sarah Jenkins (VP of Revenue Operations)');
  const [clientEmail, setClientEmail] = useState('sarah.jenkins@acmeglobal.com');
  const [productName, setProductName] = useState(initialProductName || 'Apex Enterprise AI Revenue Acceleration System');
  const [contractValue, setContractValue] = useState(4997);
  const [dealStatus, setDealStatus] = useState<BuyerDealRoom['status']>('SHARED_WITH_BUYER');

  // Buyer Cost of Inaction (COI) & ROI Modeler parameters
  const [teamSize, setTeamSize] = useState(4); // 4 SDRs or sales reps
  const [hoursWastedPerRepPerWeek, setHoursWastedPerRepPerWeek] = useState(14); // 14 hrs manual data scrubbing
  const [avgRepHourlyCost, setAvgRepHourlyCost] = useState(45); // $45/hr
  const [averageDealSize, setAverageDealSize] = useState(3500); // $3,500 ACV

  // Computed COI & Payback
  const monthlyWastedHours = teamSize * hoursWastedPerRepPerWeek * 4.3;
  const monthlyCostOfInaction = Math.round(monthlyWastedHours * avgRepHourlyCost);
  const projectedMonthlyNewDeals = Math.max(2, Math.round(teamSize * 1.5));
  const projectedMonthlyRevenueGain = projectedMonthlyNewDeals * averageDealSize;
  const netMonthlyGain = Math.max(1000, projectedMonthlyRevenueGain + (monthlyCostOfInaction * 0.65) - contractValue);
  const paybackDays = Math.max(7, Math.round((contractValue / (netMonthlyGain / 30))));
  const annualRoiMultiple = ((netMonthlyGain * 12) / contractValue).toFixed(1);

  // Mutual Action Plan (MAP) Milestones
  const [milestones, setMilestones] = useState<DealMilestone[]>([
    {
      id: 'm-1',
      stepNumber: 1,
      title: 'Strategic Alignment & ICP Verification Call',
      targetTimeline: 'Day 1 (Completed)',
      owner: 'JOINT',
      status: 'COMPLETED',
      verificationDeliverable: 'Signed Pain & Target Audience Specification document',
    },
    {
      id: 'm-2',
      stepNumber: 2,
      title: 'Digital Sales Room & ROI Business Case Signoff',
      targetTimeline: 'Day 3 (Current Stage)',
      owner: 'BUYER',
      status: 'IN_PROGRESS',
      verificationDeliverable: 'Executive sponsor approval & agreement confirmation',
    },
    {
      id: 'm-3',
      stepNumber: 3,
      title: 'DNS Infrastructure, Domain Warmup & Dedicated IP Binding',
      targetTimeline: 'Day 5',
      owner: 'SELLER',
      status: 'PENDING',
      verificationDeliverable: '100% 10/10 Mail-tester score and active DMARC validation',
    },
    {
      id: 'm-4',
      stepNumber: 4,
      title: 'Initial 25,000 High-Intent Prospect Batch Scrape & Enrichment',
      targetTimeline: 'Day 8',
      owner: 'SELLER',
      status: 'PENDING',
      verificationDeliverable: 'Zero-bounce scrubbed lead table delivered into CRM workspace',
    },
    {
      id: 'm-5',
      stepNumber: 5,
      title: 'Omnichannel Mass Dispatch & Live Warm Lead Ingestion',
      targetTimeline: 'Day 12',
      owner: 'JOINT',
      status: 'PENDING',
      verificationDeliverable: 'First 15+ live sales conversation handoffs booked directly on calendar',
    },
    {
      id: 'm-6',
      stepNumber: 6,
      title: 'Day-30 Positive ROI Review & Milestone Guarantee Verification',
      targetTimeline: 'Day 30',
      owner: 'JOINT',
      status: 'PENDING',
      verificationDeliverable: 'Milestone verified: contract paid for itself or free extension triggers',
    }
  ]);

  // Selected add-ons in deal room
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['addon-warmup']);

  // Shared Link copy state
  const [copiedLink, setCopiedLink] = useState(false);
  const [showExecutiveMemo, setShowExecutiveMemo] = useState(false);
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);

  const toggleMilestoneStatus = (id: string) => {
    setMilestones(milestones.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'PENDING' ? 'IN_PROGRESS' : m.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleCopyDealRoomLink = () => {
    navigator.clipboard.writeText(`https://dealroom.apexrevenue.ai/hub/${encodeURIComponent(clientCompany.toLowerCase().replace(/\s+/g, '-'))}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDigitalSignoff = () => {
    setApprovalConfirmed(true);
    setDealStatus('ACCEPTED');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              Digital Sales Room & Mutual Action Plan (MAP)
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              {clientCompany}
              <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {dealStatus === 'ACCEPTED' ? 'Locked & Signed' : 'Active Buyer Deal Room'}
              </span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              B2B buyers drop off when sales cycles are opaque and chaotic. The <span className="text-white font-semibold">Mutual Action Plan (MAP)</span> gives the buyer and their executive team complete transparency into ROI, milestones, deliverables, and guarantees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowExecutiveMemo(!showExecutiveMemo)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              {showExecutiveMemo ? 'Hide CFO One-Pager' : '1-Click CFO Memo'}
            </button>
            <button
              onClick={handleCopyDealRoomLink}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied!' : 'Share Room with Buyer'}
            </button>
          </div>
        </div>

        {/* Live Deal Vitals Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block">Proposed Contract Value</span>
            <span className="text-xl font-bold text-white mt-1 block font-mono">
              ${contractValue.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Buyer Cost of Inaction (COI)</span>
            <span className="text-xl font-bold text-rose-400 mt-1 block font-mono">
              -${monthlyCostOfInaction.toLocaleString()}/mo
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Payback Horizon</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {paybackDays} Days
              </span>
              <span className="text-[10px] text-slate-300 font-medium bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded">
                Break-even
              </span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block">Projected 12-Mo ROI</span>
            <span className="text-xl font-bold text-indigo-400 mt-1 block font-mono">
              {annualRoiMultiple}x Return
            </span>
          </div>
        </div>
      </div>

      {/* 1-Click Executive CFO Memo Drawer / Preview Modal */}
      {showExecutiveMemo && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 text-slate-100 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Internal Business Case & CFO Justification Memo
              </h3>
            </div>
            <span className="text-xs text-indigo-400 font-medium">Ready to forward to CFO / Leadership</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-3 leading-relaxed text-slate-300">
            <p className="text-white font-bold">MEMORANDUM</p>
            <p><strong className="text-slate-200">TO:</strong> Chief Financial Officer / Executive Leadership Team</p>
            <p><strong className="text-slate-200">FROM:</strong> {clientDecisionMaker}</p>
            <p><strong className="text-slate-200">SUBJECT:</strong> Business Case & Approval for {productName}</p>
            <div className="h-px bg-slate-800 my-2" />
            <p><strong className="text-slate-200">1. Current Problem & Cost of Inaction:</strong> Our outbound sales reps currently lose ~{monthlyWastedHours} hours per month on manual data prospecting. This costs our organization approximately <span className="text-rose-400 font-bold">${monthlyCostOfInaction.toLocaleString()}/month</span> in unproductive payroll.</p>
            <p><strong className="text-slate-200">2. Proposed Solution:</strong> Implementation of {productName} to automate lead identification, zero-bounce email verification, and omnichannel sales conversations.</p>
            <p><strong className="text-slate-200">3. Financial Impact & Payback:</strong> Total initial investment is ${contractValue.toLocaleString()}. At our current deal size (${averageDealSize.toLocaleString()}), the system pays for itself in <span className="text-emerald-400 font-bold">{paybackDays} days</span>, with a modeled annual net return of <span className="text-emerald-400 font-bold">{annualRoiMultiple}x</span>.</p>
            <p><strong className="text-slate-200">4. Risk-Reversal Protection:</strong> The vendor has committed to a 30-Day Milestone Performance Guarantee: if target milestones are not met, their team continues working without additional fees until deliverables are completed.</p>
            <p className="text-indigo-300 font-bold">RECOMMENDATION: Approve and lock implementation slot.</p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`MEMORANDUM\nTO: CFO\nSUBJECT: Approval for ${productName}\nINVESTMENT: $${contractValue}\nPAYBACK: ${paybackDays} days (${annualRoiMultiple}x ROI)`);
                alert('Executive Memo copied to clipboard!');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              Copy Executive Memo Text
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left = Interactive Buyer ROI & Payback Modeler; Right = Mutual Action Plan (MAP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (5 cols): Interactive Buyer ROI Modeler */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Interactive Buyer ROI & Payback Engine
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Live Numbers
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Show the buyer exactly what they lose every single day by delaying this decision. Real numbers dissolve buyer hesitation.
            </p>

            {/* Slider 1: Team Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Sales Reps / Outbound Team Size</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{teamSize} Reps</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="25" 
                value={teamSize} 
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Hours Wasted Per Week */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Manual Hours Wasted per Rep / Week</span>
                <span className="font-bold text-rose-500">{hoursWastedPerRepPerWeek} hrs/wk</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="30" 
                value={hoursWastedPerRepPerWeek} 
                onChange={e => setHoursWastedPerRepPerWeek(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Average Deal Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Average Customer Contract Value (ACV)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${averageDealSize.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="25000" 
                step="500"
                value={averageDealSize} 
                onChange={e => setAverageDealSize(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Financial Contrast Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Monthly Burn on Inefficient Prospecting:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">-${monthlyCostOfInaction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Projected Monthly Gross Lift:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+${projectedMonthlyRevenueGain.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex justify-between text-xs font-extrabold text-slate-900 dark:text-slate-100">
                <span>Net Monthly Economic Advantage:</span>
                <span className="text-emerald-600 dark:text-emerald-400">+${netMonthlyGain.toLocaleString()}/mo</span>
              </div>
            </div>

            {/* Guarantee Callout */}
            <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 block">Performance Escrow Protected</span>
                <span className="text-indigo-700 dark:text-indigo-300">
                  If this deployment does not achieve positive ROI milestones by Day 30, the seller continues optimization support without recurring invoice.
                </span>
              </div>
            </div>
          </div>

          {/* Account Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Client Stakeholder Profile
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Contact</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{clientDecisionMaker}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Work Email</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{clientEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Collaborative Mutual Action Plan (MAP) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Mutual Action Plan (MAP) — 30-Day Onboarding Roadmap
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-400">Click any step to toggle status</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear mutual accountability removes fear of adoption. Both buyer and seller see exactly who owns each milestone and what constitutes completion.
            </p>

            {/* Timeline Steps */}
            <div className="space-y-3">
              {milestones.map((m) => {
                const isDone = m.status === 'COMPLETED';
                const isProgress = m.status === 'IN_PROGRESS';

                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestoneStatus(m.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isDone 
                        ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20' 
                        : isProgress 
                        ? 'border-indigo-500/50 bg-indigo-500/5 dark:bg-indigo-950/20 shadow-xs ring-1 ring-indigo-500/30' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isProgress ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
                          {m.stepNumber}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                          Step {m.stepNumber}: {m.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            m.owner === 'BUYER' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                            m.owner === 'SELLER' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            Owner: {m.owner}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {m.targetTimeline}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Deliverable:</span> {m.verificationDeliverable}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 1-Click Digital Signoff Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Digital Proposal Acceptance & Slot Lock
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                  Guaranteed Terms
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                By approving this Mutual Action Plan, Acme Corp reserves an active implementation slot under the 30-Day Milestone Guarantee.
              </p>

              {approvalConfirmed ? (
                <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  Proposal Accepted & Implementation Slot Confirmed!
                </div>
              ) : (
                <button
                  onClick={handleDigitalSignoff}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Approve Proposal & Initiate Day 1 Setup ($4,997)
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
