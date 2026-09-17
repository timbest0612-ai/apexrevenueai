import React, { useState } from 'react';
import { 
  Cloud, 
  Radio, 
  Webhook, 
  CheckCircle2, 
  RefreshCw, 
  Mail, 
  MessageSquare, 
  Copy, 
  Zap, 
  ShieldCheck, 
  Server, 
  ExternalLink,
  ChevronRight,
  Send,
  Database,
  Users
} from 'lucide-react';
import { WebhookEventLog, CloudSyncStatus } from '../types';

interface WebhookSyncCenterViewProps {
  logs: WebhookEventLog[];
  cloudStatus: CloudSyncStatus;
  onRefreshLogs: () => void;
  onTestWebhookTrigger: (payload: {
    provider: 'GMAIL' | 'OUTLOOK' | 'WHATSAPP' | 'CUSTOM';
    eventType: string;
    senderName: string;
    senderEmail?: string;
    senderPhone?: string;
    companyName: string;
    content: string;
    dealAmount?: number;
  }) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

export const WebhookSyncCenterView: React.FC<WebhookSyncCenterViewProps> = ({
  logs,
  cloudStatus,
  onRefreshLogs,
  onTestWebhookTrigger,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'simulator' | 'logs'>('simulator');
  const [selectedProvider, setSelectedProvider] = useState<'WHATSAPP' | 'GMAIL' | 'OUTLOOK' | 'CUSTOM'>('WHATSAPP');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  // Simulator Form State
  const [simName, setSimName] = useState('Chioma Okonjo');
  const [simEmail, setSimEmail] = useState('chioma.okonjo@fintechflow.africa');
  const [simPhone, setSimPhone] = useState('+2348091122334');
  const [simCompany, setSimCompany] = useState('FintechFlow Pan-Africa');
  const [simContent, setSimContent] = useState('Hi Tim, we received your mass outreach campaign. We are ready to roll out verified lead acquisition for 15 sales directors. Can we schedule a 10-min demo on Thursday?');
  const [simDealAmount, setSimDealAmount] = useState<number>(4500);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePresetSelect = (preset: 'whatsapp_demo' | 'gmail_pricing' | 'outlook_enterprise' | 'stripe_deal') => {
    if (preset === 'whatsapp_demo') {
      setSelectedProvider('WHATSAPP');
      setSimName('Tunde Adeleke');
      setSimPhone('+2348039281140');
      setSimEmail('tunde@growthpulse.ng');
      setSimCompany('GrowthPulse Digital Agency');
      setSimContent('Hi Alex! Yes, we actually struggle with lead data accuracy and deliverability. Can you show me how Apex handles zero-bounce verification next Tuesday?');
      setSimDealAmount(3800);
    } else if (preset === 'gmail_pricing') {
      setSelectedProvider('GMAIL');
      setSimName('Sarah Chen');
      setSimEmail('sarah.chen@apexflow.com');
      setSimPhone('');
      setSimCompany('ApexFlow Technologies');
      setSimContent('Hi Tim, saw your message regarding B2B pipeline growth. Can you share a calendar link for a brief 10-minute demo this Thursday?');
      setSimDealAmount(5200);
    } else if (preset === 'outlook_enterprise') {
      setSelectedProvider('OUTLOOK');
      setSimName('Marcus Sterling');
      setSimEmail('m.sterling@payengine.co.uk');
      setSimPhone('');
      setSimCompany('PayEngine Solutions UK');
      setSimContent('Hello Alex, what does pricing look like for an enterprise team of 8 SDRs with dedicated IP warmup?');
      setSimDealAmount(8500);
    } else if (preset === 'stripe_deal') {
      setSelectedProvider('CUSTOM');
      setSimName('Amara Okafor');
      setSimEmail('amara@vervefintech.ng');
      setSimPhone('+2348123456789');
      setSimCompany('Verve Financial Group');
      setSimContent('Payment webhook received: $2,400 Annual Enterprise Multi-Channel Plan activated.');
      setSimDealAmount(2400);
    }
  };

  const handleExecuteTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTriggering(true);
    setTestSuccessMessage(null);
    try {
      await onTestWebhookTrigger({
        provider: selectedProvider,
        eventType: selectedProvider === 'WHATSAPP' ? 'whatsapp.message.received' : selectedProvider === 'GMAIL' ? 'gmail.message.received' : selectedProvider === 'OUTLOOK' ? 'outlook.notification.received' : 'stripe.checkout.completed',
        senderName: simName,
        senderEmail: simEmail || undefined,
        senderPhone: simPhone || undefined,
        companyName: simCompany,
        content: simContent,
        dealAmount: simDealAmount > 0 ? simDealAmount : undefined
      });
      setTestSuccessMessage(`Successfully ingested live webhook from ${selectedProvider}! Contact created/updated, Smart Inbox thread populated, and Revenue Attribution updated.`);
      setTimeout(() => setTestSuccessMessage(null), 6000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsTriggering(false);
    }
  };

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://api.apexrevenue.ai';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Webhook className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Live Webhooks & Persistent Cloud Engine</h1>
              <p className="text-sm text-slate-400">
                Bidirectional webhook ingestion for WhatsApp Business, Gmail, Outlook, & Firebase Cloud Synchronization.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshLogs}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Stream
          </button>
          <button
            onClick={() => onNavigateTab('inbox')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Open Smart Inbox
          </button>
        </div>
      </div>

      {/* Cloud & Multi-Tenant Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Cloud Storage Active
            </span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">Firebase Firestore</div>
          <div className="text-xs text-slate-400 mt-1 truncate">ID: {cloudStatus.databaseId}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Multi-Tenant Contacts
            </span>
            <span className="text-xs font-semibold text-indigo-400">Live</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{cloudStatus.recordsCount.contacts.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Cross-synced with CRM & Outreach</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              Buying Signal Triggers
            </span>
            <span className="text-xs font-semibold text-amber-400">Active</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{cloudStatus.recordsCount.signals.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Real-time purchase alerts</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Ingested Webhooks
            </span>
            <span className="text-xs font-semibold text-cyan-400">100% Verified</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{logs.length} events</div>
          <div className="text-xs text-slate-400 mt-1">Avg latency: 38ms</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'simulator'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          Interactive Ingestion Simulator & Test Bench
        </button>
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'endpoints'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          Live Webhook URL Endpoints
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'logs'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          Live Ingestion Activity Stream ({logs.length})
        </button>
      </div>

      {/* TAB 1: SIMULATOR & TEST BENCH */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {testSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-200">Webhook Processed Successfully</div>
                  <div>{testSuccessMessage}</div>
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => onNavigateTab('inbox')}
                      className="text-xs font-semibold text-emerald-400 underline hover:text-emerald-300"
                    >
                      View in Smart Inbox →
                    </button>
                    <button
                      onClick={() => onNavigateTab('crm')}
                      className="text-xs font-semibold text-emerald-400 underline hover:text-emerald-300"
                    >
                      View in CRM Contacts →
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-lg font-bold text-slate-100 mb-1">Simulate Incoming External Webhook Event</h2>
              <p className="text-xs text-slate-400 mb-5">
                Trigger a real-time event as if sent from Meta WhatsApp Cloud, Google Gmail push, Microsoft Graph, or Stripe. The platform will atomically update CRM, Smart Inbox, and Revenue Attribution.
              </p>

              {/* Quick Presets */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  1-Click Test Scenarios:
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('whatsapp_demo')}
                    className={`p-3 rounded-xl border text-left transition text-xs ${
                      selectedProvider === 'WHATSAPP'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      WhatsApp Demo
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">Inbound reply for meeting</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSelect('gmail_pricing')}
                    className={`p-3 rounded-xl border text-left transition text-xs ${
                      selectedProvider === 'GMAIL'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-rose-400" />
                      Gmail Inbound
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">Enterprise reply demo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSelect('outlook_enterprise')}
                    className={`p-3 rounded-xl border text-left transition text-xs ${
                      selectedProvider === 'OUTLOOK'
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5 text-blue-400" />
                      Outlook Graph
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">8 SDR Seat Pricing</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSelect('stripe_deal')}
                    className={`p-3 rounded-xl border text-left transition text-xs ${
                      selectedProvider === 'CUSTOM'
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      Stripe Payment
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">$2,400 Won Deal</div>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleExecuteTrigger} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Ingestion Channel Provider
                    </label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="WHATSAPP">WhatsApp Business Cloud API</option>
                      <option value="GMAIL">Google Workspace Gmail Push</option>
                      <option value="OUTLOOK">Microsoft 365 Outlook Graph</option>
                      <option value="CUSTOM">Custom CRM / Stripe Webhook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Prospect / Decision Maker Name
                    </label>
                    <input
                      type="text"
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Tunde Adeleke"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Sender Email
                    </label>
                    <input
                      type="email"
                      value={simEmail}
                      onChange={(e) => setSimEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. tunde@growthpulse.ng"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Sender Phone Number (WhatsApp/SMS)
                    </label>
                    <input
                      type="text"
                      value={simPhone}
                      onChange={(e) => setSimPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. +2348039281140"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={simCompany}
                      onChange={(e) => setSimCompany(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. GrowthPulse Digital"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Associated Deal Value ($ USD)
                    </label>
                    <input
                      type="number"
                      value={simDealAmount}
                      onChange={(e) => setSimDealAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 4500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Payload Message Body / Inquiry Content
                  </label>
                  <textarea
                    rows={3}
                    value={simContent}
                    onChange={(e) => setSimContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-mono text-xs"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isTriggering}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {isTriggering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Ingesting and Syncing Across Platform...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Execute Live Ingestion Webhook & Sync Pipeline
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Sync Architecture */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Atomic Cross-Sync Chain
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a live webhook arrives from WhatsApp, Gmail, or Outlook, the engine synchronously executes:
              </p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span><strong>HMAC Verification:</strong> Validates payload signature against provider secrets.</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span><strong>CRM Contact Match:</strong> Links to existing contact or creates verified prospect.</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span><strong>Smart Inbox Threading:</strong> Generates AI reply draft & sentiment tag.</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                  <span><strong>Revenue Attribution:</strong> Updates conversion funnel & attribution dashboard.</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/20">
              <h3 className="text-sm font-bold text-indigo-200 mb-2">Cloud Persistence Ready</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Firebase Firestore is provisioned to securely store contacts, campaigns, threads, and webhook logs under multi-tenant organization rules.
              </p>
              <div className="text-[11px] font-mono text-indigo-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 truncate">
                Project: {cloudStatus.projectId}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WEBHOOK URL ENDPOINTS */}
      {activeTab === 'endpoints' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">WhatsApp Business Cloud API</h3>
                    <p className="text-xs text-slate-400">Meta Graph Webhook Ingestion</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Webhook Callback URL</label>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="truncate">{currentHost}/api/webhooks/whatsapp</span>
                  <button
                    onClick={() => handleCopy(`${currentHost}/api/webhooks/whatsapp`, 'wa_url')}
                    className="text-indigo-400 hover:text-indigo-300 ml-2 shrink-0"
                  >
                    {copiedKey === 'wa_url' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Verify Token (hub.verify_token)</label>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <span>apex_webhook_secret_key</span>
                  <button
                    onClick={() => handleCopy('apex_webhook_secret_key', 'wa_tok')}
                    className="text-indigo-400 hover:text-indigo-300 ml-2 shrink-0"
                  >
                    {copiedKey === 'wa_tok' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Gmail */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Google Workspace Gmail Push</h3>
                    <p className="text-xs text-slate-400">Cloud Pub/Sub Push Ingestion</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Ready
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Webhook Callback URL</label>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="truncate">{currentHost}/api/webhooks/gmail</span>
                  <button
                    onClick={() => handleCopy(`${currentHost}/api/webhooks/gmail`, 'gm_url')}
                    className="text-indigo-400 hover:text-indigo-300 ml-2 shrink-0"
                  >
                    {copiedKey === 'gm_url' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Supported Formats</label>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Google Pub/Sub Base64 envelope & Direct Inbound JSON format.
                </div>
              </div>
            </div>

            {/* Outlook */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Microsoft Outlook Graph API</h3>
                    <p className="text-xs text-slate-400">Microsoft Graph Change Notifications</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Ready
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Webhook Callback URL</label>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="truncate">{currentHost}/api/webhooks/outlook</span>
                  <button
                    onClick={() => handleCopy(`${currentHost}/api/webhooks/outlook`, 'ms_url')}
                    className="text-indigo-400 hover:text-indigo-300 ml-2 shrink-0"
                  >
                    {copiedKey === 'ms_url' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Custom CRM / Stripe */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Custom Webhooks (Stripe / Zapier)</h3>
                    <p className="text-xs text-slate-400">General Inbound Lead & Payment Pipeline</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Ready
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Webhook Callback URL</label>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="truncate">{currentHost}/api/webhooks/custom</span>
                  <button
                    onClick={() => handleCopy(`${currentHost}/api/webhooks/custom`, 'cs_url')}
                    className="text-indigo-400 hover:text-indigo-300 ml-2 shrink-0"
                  >
                    {copiedKey === 'cs_url' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOGS & STREAM */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Live Ingested Webhook Stream</h3>
            <span className="text-xs text-slate-400">{logs.length} total events processed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Sender / Origin</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium ${
                        log.provider === 'WHATSAPP' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        log.provider === 'GMAIL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        log.provider === 'OUTLOOK' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {log.provider}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.eventType}</td>
                    <td className="py-3 px-4 text-slate-200">
                      <div className="font-sans font-semibold">{log.senderName || log.companyName || 'Inbound Lead'}</div>
                      <div className="text-[11px] text-slate-400">{log.sourceIdentifier}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300 max-w-xs truncate" title={log.actionTaken}>
                      {log.actionTaken}
                    </td>
                    <td className="py-3 px-4 text-emerald-400">{log.latencyMs}ms</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
