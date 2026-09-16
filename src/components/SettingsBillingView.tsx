import React, { useState } from 'react';
import { 
  CreditCard, 
  Settings, 
  ShieldCheck, 
  Users, 
  Key, 
  Webhook, 
  Check, 
  Sparkles, 
  Globe, 
  Building2,
  Copy,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Crown
} from 'lucide-react';
import { Organization, UserRole, CurrencyCode, BYOKConfig, CostControlMetrics, User as UserType } from '../types.js';
import { formatCurrency } from '../utils/formatters.js';
import { isPlatformOwner } from '../lib/firebase.js';

interface SettingsBillingViewProps {
  organization: Organization;
  userRole: UserRole;
  currency: CurrencyCode;
  currentUser?: UserType;
  onUpdateOrg: (updates: Partial<Organization>) => void;
  byokConfig?: BYOKConfig;
  costMetrics?: CostControlMetrics;
  onUpdateBYOK?: (config: Partial<BYOKConfig>) => void;
  onOpenPreservationModal?: () => void;
}

export const SettingsBillingView: React.FC<SettingsBillingViewProps> = ({
  organization,
  userRole,
  currency,
  currentUser,
  onUpdateOrg,
  byokConfig,
  costMetrics,
  onUpdateBYOK,
  onOpenPreservationModal,
}) => {
  const [activeTab, setActiveTab] = useState<'billing' | 'byok' | 'workspace' | 'team' | 'api'>('billing');
  const [orgName, setOrgName] = useState(organization.name);
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isOwner = isPlatformOwner(currentUser?.email);

  // Local BYOK Form State
  const [geminiKey, setGeminiKey] = useState(byokConfig?.geminiApiKey || '');
  const [openaiKey, setOpenaiKey] = useState(byokConfig?.openaiApiKey || '');
  const [elevenLabsKey, setElevenLabsKey] = useState(byokConfig?.elevenLabsApiKey || '');
  const [sendgridKey, setSendgridKey] = useState(byokConfig?.sendgridApiKey || '');
  const [whatsappToken, setWhatsappToken] = useState(byokConfig?.whatsappApiToken || '');
  const [byokMode, setByokMode] = useState<'PLATFORM_FAIR_USE' | 'BYOK_DIRECT'>(byokConfig?.activeMode || 'PLATFORM_FAIR_USE');
  const [byokSaved, setByokSaved] = useState(false);

  const plans = [
    {
      id: 'TRIAL_SANDBOX',
      name: '14-Day Free Sandbox',
      priceUsd: 0,
      period: '14 days free',
      leads: '500 leads trial',
      verifications: '1,000 verifications',
      description: 'Full feature access with 30-day cloud workspace preservation and fair-use cost controls.',
      features: [
        '14 Days Full Access • No Credit Card',
        '30-Day Workspace Preservation',
        'Lead Discovery & 4D Scoring',
        'Zero-Bounce Verification Lab',
        'Sample Mode Pitch Media Studio',
      ],
      popular: false,
    },
    {
      id: 'STARTER',
      name: 'Starter',
      priceUsd: 19,
      period: 'per month',
      leads: '1,000 leads/mo',
      verifications: '2,500 verifications',
      description: 'Ideal for solo founders & creators launching their first automated outbound engine.',
      features: [
        '1,000 Verified Leads / month',
        '2,500 Zero-Bounce Verifications',
        'AI Multi-Variate Pitch Generator',
        'Single Mailbox & Deliverability Shield',
        'Standard CRM & Contact 360',
      ],
      popular: false,
    },
    {
      id: 'PRO',
      name: 'Professional',
      priceUsd: 49,
      period: 'per month',
      leads: '5,000 leads/mo',
      verifications: '15,000 verifications',
      description: 'For serious marketers & high-growth sales teams running multi-channel outbound.',
      features: [
        '5,000 Verified Leads / month',
        '15,000 Zero-Bounce Verifications',
        '2k–5k Mass Pitch Dispatcher',
        '4D AI Intent Scoring & Signals Radar',
        'AI Smart Inbox Auto-Replies',
        'Full Revenue Attribution Funnels',
      ],
      popular: true,
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      priceUsd: 99,
      period: 'per month',
      leads: '15,000 leads/mo',
      verifications: '50,000 verifications',
      description: 'For scaling companies automating email, WhatsApp Cloud API & CRM pipelines.',
      features: [
        '15,000 Verified Leads / month',
        '50,000 Zero-Bounce Verifications',
        'Live WhatsApp Business Cloud API',
        'Automated Inbound Webhooks',
        'Visual Automation Workflow Canvas',
        'Team RBAC & Multi-Seat Access',
      ],
      popular: false,
    },
    {
      id: 'AGENCY',
      name: 'Agency / Enterprise',
      priceUsd: 249,
      period: 'per month',
      leads: '50,000+ leads/mo',
      verifications: 'Unlimited verifications',
      description: 'For marketing agencies managing multiple clients with custom branding & BYOK.',
      features: [
        '50,000+ Verified Leads / month',
        'Unlimited Zero-Bounce Verifications',
        'Unlimited Client Workspaces',
        'White-Label Portals & Custom Domains',
        'BYOK Zero-Markup Unlimited Routing',
        'Dedicated Revenue Strategist Support',
      ],
      popular: false,
    }
  ];

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('apex_live_99f8a37b12d94827c8e7629b3a0c');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOrg({ name: orgName });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveBYOK = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateBYOK) {
      onUpdateBYOK({
        enabled: Boolean(geminiKey || openaiKey),
        activeMode: byokMode,
        geminiApiKey: geminiKey,
        openaiApiKey: openaiKey,
        elevenLabsApiKey: elevenLabsKey,
        sendgridApiKey: sendgridKey,
        whatsappApiToken: whatsappToken,
      });
    }
    setByokSaved(true);
    setTimeout(() => setByokSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Workspace Settings & Billing</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage 14-day sandbox access, Bring-Your-Own-Key (BYOK), fair-use cost controls, subscriptions, and team permissions.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'billing', label: 'Subscription & Plans', icon: CreditCard },
          { id: 'byok', label: 'Bring Your Own Key (BYOK)', icon: Key },
          { id: 'workspace', label: 'Workspace & Currency', icon: Building2 },
          { id: 'team', label: 'Team & RBAC', icon: Users },
          { id: 'api', label: 'API Keys & Webhooks', icon: Webhook },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Platform Owner VIP Notice */}
          {isOwner && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-sm">
                  <Crown className="h-5 w-5 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200">
                      Platform Owner (VIP Lifetime Access)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      Free Forever
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Logged in as <strong>{currentUser?.email}</strong>. You have unrestricted access to all features, unlimited quotas, and zero billing restrictions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Balance & 14-Day Sandbox Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-white via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-500">Active Workspace Experience</span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {costMetrics?.tier === 'TRIAL_SANDBOX' ? '14-Day Full Access Sandbox' : `${organization.plan} Plan`}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                  {costMetrics?.isTrialActive ? `Day ${14 - (costMetrics.trialDaysRemaining || 11)} of 14 Active` : 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your workspace & 17+ assets are preserved for 30 days. No credit card required.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {onOpenPreservationModal && (
                <button
                  onClick={onOpenPreservationModal}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-xs hover:scale-[1.02] transition-transform flex items-center gap-1.5"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>My Work Is Waiting</span>
                </button>
              )}
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plans.map((p) => {
              const isCurrent = organization.plan === p.id || (p.id === 'TRIAL_SANDBOX' && costMetrics?.tier === 'TRIAL_SANDBOX');
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 transition-all ${
                    p.popular
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md relative'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{p.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {p.priceUsd === 0 ? 'Free' : formatCurrency(p.priceUsd, currency)}
                      </span>
                      <span className="text-[11px] text-slate-400">/{p.period}</span>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="font-semibold text-indigo-600 dark:text-indigo-400">{p.leads}</div>
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400">{p.verifications}</div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={isCurrent}
                    onClick={() => onUpdateOrg({ plan: p.id as any })}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bring Your Own Key (BYOK) Tab */}
      {activeTab === 'byok' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Key className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Bring Your Own API (BYOK) — Zero Platform Markup
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  For heavy volume production: connect your personal Gemini, OpenAI, or ElevenLabs API keys. We charge only for software access while all API usage bills directly to your provider accounts.
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                byokConfig?.enabled 
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}>
                {byokConfig?.enabled ? 'BYOK Active' : 'Platform Fair-Use Active'}
              </span>
            </div>

            {byokSaved && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>BYOK configuration saved and tested successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveBYOK} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Used for 4D scoring, pitch generation & Smart Inbox</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    OpenAI API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Used for fallback copy & custom GPT embeddings</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ElevenLabs Audio / Voice API Key
                  </label>
                  <input
                    type="password"
                    value={elevenLabsKey}
                    onChange={(e) => setElevenLabsKey(e.target.value)}
                    placeholder="el_live_..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Used for personalized voice pitch previews</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    SendGrid / Resend API Key
                  </label>
                  <input
                    type="password"
                    value={sendgridKey}
                    onChange={(e) => setSendgridKey(e.target.value)}
                    placeholder="SG.xxxxx / re_12345"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Used for high-throughput mass email dispatch</span>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Routing Mode</span>
                  <span className="text-[11px] text-slate-500">
                    {byokMode === 'BYOK_DIRECT' ? 'Direct API: Bypasses platform quotas using your custom keys.' : 'Platform Managed: Enforces fair-use daily caps.'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setByokMode('PLATFORM_FAIR_USE')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      byokMode === 'PLATFORM_FAIR_USE' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Fair-Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setByokMode('BYOK_DIRECT')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      byokMode === 'BYOK_DIRECT' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    BYOK Direct
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>Save & Test BYOK Keys</span>
                </button>
              </div>
            </form>
          </div>

          {/* Model Routing Architecture Inspector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Automated Model Routing & Cost-Control Architecture
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Fast & Cheap Model</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">gemini-2.5-flash-lite</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Used for spam audits, lead tagging & short summaries</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">Mid-Tier Copywriting</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">gemini-2.5-flash</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Used for multi-channel pitches & email sequence variants</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase block">High-Reasoning Model</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">gemini-3.7-flash</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Used for 4D predictive revenue scoring & next-best-actions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Tab */}
      {activeTab === 'workspace' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-xl space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Workspace Configuration</h2>

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium">
              Workspace settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveWorkspace} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Default Base Currency</label>
              <select
                value={organization.currency}
                onChange={(e) => onUpdateOrg({ currency: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              >
                <option value="USD">USD ($ United States Dollar)</option>
                <option value="NGN">NGN (₦ Nigerian Naira - Paystack Integrated)</option>
                <option value="GBP">GBP (£ British Pound)</option>
                <option value="EUR">EUR (€ Euro)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Timezone</label>
              <input
                type="text"
                value={organization.timezone}
                onChange={(e) => onUpdateOrg({ timezone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Team Members & Role-Based Access Control (RBAC)</h2>
            <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
              + Invite Team Member
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Alex Rivers</p>
                <p className="text-[11px] text-slate-500 font-mono">alex@apexrevenue.ai</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 font-bold text-[10px]">
                ORGANIZATION OWNER
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Chidi Okafor</p>
                <p className="text-[11px] text-slate-500 font-mono">chidi@apexrevenue.ai</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                REVENUE SDR
              </span>
            </div>
          </div>
        </div>
      )}

      {/* API Tab */}
      {activeTab === 'api' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 max-w-xl">
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">REST API & Webhooks</h2>
          <p className="text-xs text-slate-500">Programmatically trigger lead discovery, email verification, or sync CRM events.</p>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-600 block">Production API Secret Key</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                readOnly
                value="apex_live_99f8a37b12d94827c8e7629b3a0c"
                className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs"
              />
              <button
                onClick={handleCopyApiKey}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
