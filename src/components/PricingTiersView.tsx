import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Clock, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Users,
  Layers,
  Radio,
  MailCheck,
  Building2,
  Lock
} from 'lucide-react';
import { CurrencyCode, Organization, User as UserType } from '../types.js';
import { isPlatformOwner } from '../lib/firebase.js';

interface PricingTiersViewProps {
  currentOrg: Organization;
  currentUser: UserType;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onSelectPlan: (planId: string) => void;
  onOpenAuthModal: () => void;
  onOpenBYOK: () => void;
}

export const PricingTiersView: React.FC<PricingTiersViewProps> = ({
  currentOrg,
  currentUser,
  currency,
  onChangeCurrency,
  onSelectPlan,
  onOpenAuthModal,
  onOpenBYOK,
}) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const isOwner = isPlatformOwner(currentUser.email);

  // Exchange rate multipliers from USD base
  const currencyRates: Record<CurrencyCode, { symbol: string; rate: number; suffix?: string }> = {
    USD: { symbol: '$', rate: 1 },
    NGN: { symbol: '₦', rate: 1000 },
    GBP: { symbol: '£', rate: 0.8 },
    EUR: { symbol: '€', rate: 0.92 },
  };

  const getPrice = (usdMonthly: number) => {
    if (usdMonthly === 0) return 'Free';
    const rateInfo = currencyRates[currency];
    const discountedMonthly = billingCycle === 'ANNUAL' ? usdMonthly * 0.8 : usdMonthly;
    const converted = Math.round(discountedMonthly * rateInfo.rate);
    return `${rateInfo.symbol}${converted.toLocaleString()}`;
  };

  const tiers = [
    {
      id: 'TRIAL_SANDBOX',
      name: '14-Day Free Trial',
      subtitle: 'Zero Cost • Zero Owner Tokens',
      usdPrice: 0,
      period: '14 days full access',
      badge: 'Free Sandbox',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      description: 'Explore the full operating system with 14-day zero-risk access. No credit card required.',
      highlight: false,
      leadQuota: '500 Leads trial',
      verificationQuota: '1,000 Verifications',
      aiQuota: 'Fair-Use Sandbox AI + BYOK Direct',
      features: [
        '14 Days Full Access without paying',
        '30-Day Cloud Workspace Preservation',
        'Global Lead Finder (500 Leads)',
        'Zero-Bounce Verification Lab (1,000 Units)',
        '4D AI Intent Scoring & Signal Radar',
        'AI Spam Auditor & Inbox Previews',
        'BYOK (Bring Your Own Key) Direct Engine',
        'Zero token drain on platform owner',
      ],
      ctaLabel: isOwner ? 'Included in Owner VIP' : 'Start 14-Day Free Trial',
    },
    {
      id: 'STARTER',
      name: 'Starter',
      subtitle: 'For Solo Founders & Creators',
      usdPrice: 19,
      period: billingCycle === 'ANNUAL' ? '/mo (billed annually)' : '/month',
      badge: undefined,
      description: 'The essential toolkit to automate your personal client acquisition and lead research.',
      highlight: false,
      leadQuota: '1,000 Verified Leads/mo',
      verificationQuota: '2,500 Verifications/mo',
      aiQuota: '50,000 AI Tokens/mo',
      features: [
        '1,000 Verified Decision Maker Leads/mo',
        '2,500 Zero-Bounce Verifications/mo',
        'Multi-Variate AI Email Copywriter',
        '1 Sender Mailbox + DNS Warmup Health',
        'Contact 360 CRM & Interaction Timeline',
        'CSV/Excel Lead Export & Enrichment',
        'Community Support & Strategy Hub',
      ],
      ctaLabel: isOwner ? 'Switch to Starter' : 'Choose Starter',
    },
    {
      id: 'PRO',
      name: 'Growth / Pro',
      subtitle: 'Most Popular for High Growth',
      usdPrice: 49,
      period: billingCycle === 'ANNUAL' ? '/mo (billed annually)' : '/month',
      badge: 'Most Popular',
      badgeColor: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30',
      description: 'Powerhouse engine for sales teams executing mass outreach and automated deal closing.',
      highlight: true,
      leadQuota: '5,000 Verified Leads/mo',
      verificationQuota: '15,000 Verifications/mo',
      aiQuota: '250,000 AI Tokens/mo',
      features: [
        '5,000 Verified Global Leads/mo',
        '15,000 Zero-Bounce Verifications/mo',
        '2,000–5,000 Mass Pitch Blast Dispatcher',
        '4D AI Intent Scoring & Real-Time Radar',
        'AI Smart Inbox Auto-Replies & Triage',
        'Multi-Channel Sequences & Fallback Logic',
        'Closed-Loop Revenue Attribution Funnel',
        'Live Deliverability & Spam Trap Shield',
      ],
      ctaLabel: isOwner ? 'Current Active Tier' : 'Upgrade to Pro',
    },
    {
      id: 'BUSINESS',
      name: 'Business / Scale',
      subtitle: 'Omnichannel & Team Automation',
      usdPrice: 99,
      period: billingCycle === 'ANNUAL' ? '/mo (billed annually)' : '/month',
      badge: 'Best Value',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      description: 'Scale inbound/outbound across email, WhatsApp Cloud API, and live webhooks.',
      highlight: false,
      leadQuota: '15,000 Verified Leads/mo',
      verificationQuota: '50,000 Verifications/mo',
      aiQuota: '1,000,000 AI Tokens/mo',
      features: [
        '15,000 Verified Global Leads/mo',
        '50,000 Zero-Bounce Verifications/mo',
        'WhatsApp Business Cloud API Integration',
        'Inbound Webhook Sync (Gmail, CRM, Stripe)',
        'Visual Automation Canvas (Unlimited Flows)',
        '5 Team Member Seats with RBAC Roles',
        'High-Converting Landing Pages & Lead Magnets',
        'Priority Technical & Outbound SLA Support',
      ],
      ctaLabel: isOwner ? 'Switch to Business' : 'Choose Business',
    },
    {
      id: 'AGENCY',
      name: 'Agency / Enterprise',
      subtitle: 'White-Label & Unlimited Scale',
      usdPrice: 249,
      period: billingCycle === 'ANNUAL' ? '/mo (billed annually)' : '/month',
      badge: 'Enterprise',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      description: 'Dedicated infrastructure, unlimited client workspaces, white-label, and custom API routing.',
      highlight: false,
      leadQuota: '50,000+ Verified Leads/mo',
      verificationQuota: 'Unlimited Verifications',
      aiQuota: 'Unlimited BYOK + Dedicated Engine',
      features: [
        '50,000+ Verified Leads/mo',
        'Unlimited Zero-Bounce Verifications',
        'Unlimited Client Workspaces & Sub-Orgs',
        'White-Label Portal & Custom Domains',
        'BYOK Zero-Platform-Markup Unlimited Routing',
        'Dedicated Custom Sending IP Pools',
        '1-on-1 Dedicated Revenue Strategist',
        'Custom Webhooks & Spanner/Firestore API',
      ],
      ctaLabel: isOwner ? 'Platform Owner Tier' : 'Contact Enterprise',
    }
  ];

  const faqs = [
    {
      q: 'How does the 14-Day Free Trial work?',
      a: 'When you sign in with your Google account, you receive instant access to all features for 14 days without paying anything upfront. No credit card is required. You can scout leads, verify emails, audit deliverability, and test AI pitches.'
    },
    {
      q: 'Does the 14-Day Free Trial use the platform owner’s tokens?',
      a: 'No! The trial engine utilizes client-side zero-cost heuristic algorithms and fair-use sandboxing so it operates at zero expense to the platform owner. Furthermore, users can connect their own Gemini/OpenAI API key (BYOK) for direct personal execution without token consumption on the owner’s account.'
    },
    {
      q: 'What special privileges does the Platform Owner have?',
      a: 'The Platform Owner account (timbest0612@gmail.com) enjoys permanent, 100% free lifetime VIP access across all tiers, tools, and enterprise capabilities with no token caps, trial expirations, or billing charges.'
    },
    {
      q: 'What happens to my work after the 14-day trial?',
      a: 'All your discovered leads, verified email lists, campaigns, and AI copy templates are preserved in cloud storage for 30 days under our Preservation Guarantee. You can unlock your work whenever you upgrade to any paid tier.'
    },
    {
      q: 'Can I pay in Nigerian Naira (₦ NGN), British Pounds (£ GBP), or Euros (€ EUR)?',
      a: 'Yes! We support global multi-currency checkout including USD ($), Nigerian Naira (₦ via Paystack/Flutterwave), British Pounds (£), and Euros (€).'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Banner for Platform Owner */}
      {isOwner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-2 border-amber-500/40 text-slate-900 dark:text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Crown className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-amber-300">
                  Platform Owner Access Active
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  100% Free Lifetime VIP
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You are logged in as <strong>{currentUser.email}</strong>. All features, quotas, and enterprise tools are fully unlocked without charge.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All Features Unlocked
            </span>
          </div>
        </div>
      )}

      {/* Header & Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Flexible Pricing For Modern Growth Teams</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Transparent, High-ROI Revenue Acceleration Tiers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Try free for 14 days with zero commitment and zero credit card. Choose the plan that fits your growth velocity when ready.
        </p>

        {/* Currency & Billing Cycle Switchers */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          {/* Billing Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'MONTHLY'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'ANNUAL'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] uppercase font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                Save 20%
              </span>
            </button>
          </div>

          {/* Currency Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['USD', 'NGN', 'GBP', 'EUR'] as CurrencyCode[]).map((curr) => (
              <button
                key={curr}
                onClick={() => onChangeCurrency(curr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currency === curr
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {curr === 'USD' ? '$ USD' : curr === 'NGN' ? '₦ NGN' : curr === 'GBP' ? '£ GBP' : '€ EUR'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
        {tiers.map((tier) => {
          const isCurrentPlan = currentOrg.plan === tier.id || (isOwner && tier.id === 'AGENCY');
          const isTrial = tier.id === 'TRIAL_SANDBOX';

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl flex flex-col justify-between p-5 transition-all ${
                tier.highlight
                  ? 'bg-gradient-to-b from-indigo-500/10 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02] z-10'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 hover:shadow-md'
              }`}
            >
              {/* Badge if present */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${tier.badgeColor || ''}`}>
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Title and Subtitle */}
                <div className="mb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{tier.subtitle}</p>
                </div>

                {/* Price Display */}
                <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {getPrice(tier.usdPrice)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{tier.period}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                    {tier.description}
                  </p>
                </div>

                {/* Key Quotas */}
                <div className="space-y-1.5 mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                    <span className="text-[11px] text-slate-400">Leads:</span>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{tier.leadQuota}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                    <span className="text-[11px] text-slate-400">Verification:</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{tier.verificationQuota}</span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2 mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Features</p>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="pt-2">
                <button
                  id={`select-plan-${tier.id.toLowerCase()}`}
                  onClick={() => {
                    if (isTrial && !currentUser.email) {
                      onOpenAuthModal();
                    } else {
                      onSelectPlan(tier.id);
                    }
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrentPlan
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                      : tier.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:scale-[1.02]'
                      : 'bg-slate-900 dark:bg-slate-100 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white dark:text-slate-900 hover:text-white dark:hover:text-white'
                  }`}
                >
                  <span>{isCurrentPlan ? 'Current Plan' : tier.ctaLabel}</span>
                  {!isCurrentPlan && <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BYOK Guarantee & Zero Cost Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Bring Your Own Key (BYOK) Engine</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Zero Platform Markup
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Connect your personal Google Gemini or OpenAI API key to execute billions of tokens directly. No token drain on platform owner, no extra platform surcharges, and unlimited scalability.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBYOK}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Key className="h-3.5 w-3.5 text-indigo-600" />
            <span>Configure BYOK Keys</span>
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto space-y-4 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Everything you need to know about trials, billing, and access</p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{isExpanded ? '−' : '+'}</span>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
