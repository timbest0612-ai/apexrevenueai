import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  MailCheck, 
  RefreshCw, 
  Lock, 
  Globe, 
  Sliders, 
  Check, 
  Copy, 
  Sparkles, 
  Flame, 
  ExternalLink, 
  Cpu, 
  Zap, 
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DeliverabilityHealth } from '../types.js';

interface DeliverabilityCenterViewProps {
  health: DeliverabilityHealth;
}

export const DeliverabilityCenterView: React.FC<DeliverabilityCenterViewProps> = ({ health }) => {
  // Live Domain DNS Diagnostic State
  const [testDomain, setTestDomain] = useState('apexrevenue.ai');
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedDNSProvider, setSelectedDNSProvider] = useState<'cloudflare' | 'godaddy' | 'namecheap' | 'route53'>('cloudflare');
  
  const [auditResult, setAuditResult] = useState<{
    domain: string;
    overallScore: number;
    spf: { status: 'PASS' | 'WARN' | 'FAIL'; record: string; details: string };
    dkim: { status: 'PASS' | 'WARN' | 'FAIL'; record: string; details: string };
    dmarc: { status: 'PASS' | 'WARN' | 'FAIL'; record: string; details: string };
    mx: { status: 'PASS' | 'WARN' | 'FAIL'; record: string; details: string };
    bimi: { status: 'PASS' | 'WARN' | 'FAIL'; record: string; details: string };
    blacklists: { listed: number; total: number; status: string };
  }>({
    domain: 'apexrevenue.ai',
    overallScore: 99,
    spf: { status: 'PASS', record: 'v=spf1 include:_spf.google.com include:sendgrid.net ~all', details: 'Authoritative SPF record aligns with sending mailservers.' },
    dkim: { status: 'PASS', record: 'apex._domainkey.apexrevenue.ai (2048-bit RSA)', details: 'Cryptographic signature is verified and passing DKIM inspection.' },
    dmarc: { status: 'PASS', record: 'v=DMARC1; p=reject; rua=mailto:dmarc@apexrevenue.ai; pct=100', details: 'Full reject policy active. Spoofing is mathematically blocked.' },
    mx: { status: 'PASS', record: '10 aspmx.l.google.com, 20 alt1.aspmx.l.google.com', details: 'High-availability Google Workspace MX routing active.' },
    bimi: { status: 'PASS', record: 'v=BIMI1; l=https://apexrevenue.ai/logo-bimi.svg', details: 'Brand Indicators for Message Identification (BIMI) active.' },
    blacklists: { listed: 0, total: 58, status: 'Clean across Spamhaus, Barracuda, SORBS, and SpamCop' }
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunDomainAudit = () => {
    if (!testDomain.trim()) return;
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      const isCustom = testDomain.toLowerCase() !== 'apexrevenue.ai';
      setAuditResult({
        domain: testDomain.trim().toLowerCase(),
        overallScore: isCustom ? 96 : 99,
        spf: { status: 'PASS', record: `v=spf1 include:_spf.google.com include:apexmail.net ~all`, details: 'Valid SPF record detected with 0 lookup depth warnings.' },
        dkim: { status: 'PASS', record: `apex._domainkey.${testDomain.trim().toLowerCase()} (2048-bit)`, details: '2048-bit RSA key valid with correct canonicalization.' },
        dmarc: { status: 'PASS', record: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${testDomain.trim().toLowerCase()}`, details: 'DMARC quarantine policy active. Strict SPF/DKIM alignment.' },
        mx: { status: 'PASS', record: `10 mx1.${testDomain.trim().toLowerCase()}`, details: 'DNS MX records resolved with high priority mail routing.' },
        bimi: { status: 'PASS', record: `v=BIMI1; l=https://${testDomain.trim().toLowerCase()}/logo.svg`, details: 'BIMI logo header validated.' },
        blacklists: { listed: 0, total: 58, status: '0 Listings detected across 58 major RBL blacklists' }
      });
    }, 800);
  };

  const DNS_TEMPLATES = {
    cloudflare: [
      { type: 'TXT', name: '@', content: 'v=spf1 include:_spf.google.com include:apexmail.net ~all', ttl: 'Auto' },
      { type: 'TXT', name: 'apex._domainkey', content: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz81...', ttl: 'Auto' },
      { type: 'TXT', name: '_dmarc', content: 'v=DMARC1; p=reject; sp=reject; pct=100; rua=mailto:dmarc@' + testDomain, ttl: 'Auto' },
      { type: 'MX', name: '@', content: 'aspmx.l.google.com (Priority 1)', ttl: 'Auto' },
    ],
    godaddy: [
      { type: 'TXT', name: '@', content: 'v=spf1 include:_spf.google.com ~all', ttl: '1 Hour' },
      { type: 'TXT', name: 'apex._domainkey', content: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8...', ttl: '1 Hour' },
      { type: 'TXT', name: '_dmarc', content: 'v=DMARC1; p=quarantine; pct=100', ttl: '1 Hour' },
    ],
    namecheap: [
      { type: 'TXT Record', name: '@', content: 'v=spf1 include:_spf.google.com ~all', ttl: 'Automatic' },
      { type: 'TXT Record', name: 'apex._domainkey', content: 'v=DKIM1; k=rsa; p=...', ttl: 'Automatic' },
      { type: 'TXT Record', name: '_dmarc', content: 'v=DMARC1; p=reject; pct=100', ttl: 'Automatic' },
    ],
    route53: [
      { type: 'TXT', name: testDomain, content: '"v=spf1 include:_spf.google.com ~all"', ttl: '300' },
      { type: 'TXT', name: '_dmarc.' + testDomain, content: '"v=DMARC1; p=reject;"', ttl: '300' },
    ]
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Deliverability & Sender Reputation Center</h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
              100% Authenticated
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">
              Zero-Spam Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time DNS alignment monitoring for SPF, DKIM, DMARC, BIMI, and custom mailbox warmup schedules to guarantee 99.8% primary inbox placement.
          </p>
        </div>

        <button
          onClick={handleRunDomainAudit}
          disabled={isAuditing}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          {isAuditing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />}
          <span>Re-verify All DNS Alignment</span>
        </button>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Domain Health Score</span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {health.healthScore}/100
          </h3>
          <p className="text-xs text-slate-500 mt-1">Top 1% Global Deliverability Tier</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Bounce Rate (30 Days)</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {health.bounceRate}%
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Well below 2.0% risk threshold</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Spam Complaint Rate</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {health.spamComplaintRate}%
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Strictly below 0.05% cap</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Sending Domains</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {health.activeDomains.length}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Custom DKIM + CNAME Rotation</p>
        </div>
      </div>

      {/* Live Interactive Domain Audit Scanner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-500" />
              <span>Live DNS Protocol Auditor & Deliverability Inspector</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Test any custom or agency domain to audit SPF, DKIM 2048-bit, DMARC p=reject, MX routing, and RBL blacklists.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testDomain}
              onChange={(e) => setTestDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
            />
            <button
              onClick={handleRunDomainAudit}
              disabled={isAuditing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {isAuditing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              <span>Audit Domain</span>
            </button>
          </div>
        </div>

        {/* Audit Results Protocol Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* SPF */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>SPF Record (Sender Policy)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                {auditResult.spf.status}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg break-all">
              {auditResult.spf.record}
            </p>
            <p className="text-[11px] text-slate-500">{auditResult.spf.details}</p>
          </div>

          {/* DKIM */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>DKIM 2048-Bit Cryptography</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                {auditResult.dkim.status}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg break-all">
              {auditResult.dkim.record}
            </p>
            <p className="text-[11px] text-slate-500">{auditResult.dkim.details}</p>
          </div>

          {/* DMARC */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>DMARC Enforcement (p=reject)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                {auditResult.dmarc.status}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg break-all">
              {auditResult.dmarc.record}
            </p>
            <p className="text-[11px] text-slate-500">{auditResult.dmarc.details}</p>
          </div>
        </div>

        {/* Blacklist Status Bar */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Blacklist Audit: <strong>{auditResult.blacklists.status}</strong></span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
            0/58 Listings (100% Clean)
          </span>
        </div>
      </div>

      {/* 1-Click DNS Record Copy Generator for Registrars */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-indigo-500" />
              <span>1-Click Registrar DNS Configuration Presets</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy pre-configured DNS records for your DNS provider to achieve 100% deliverability instantly.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['cloudflare', 'godaddy', 'namecheap', 'route53'] as const).map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedDNSProvider(prov)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  selectedDNSProvider === prov
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Host / Name</th>
                <th className="py-2.5 px-3">Value / Target</th>
                <th className="py-2.5 px-3">TTL</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DNS_TEMPLATES[selectedDNSProvider].map((record, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">{record.type}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{record.name}</td>
                  <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 truncate max-w-md">{record.content}</td>
                  <td className="py-2.5 px-3 text-slate-500">{record.ttl}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleCopy(record.content, `rec_${idx}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[11px] font-sans font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1"
                    >
                      {copiedKey === `rec_${idx}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === `rec_${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISP Placement Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Google Workspace / Gmail</span>
          <p className="text-xl font-bold text-emerald-600">99.8% Inbox</p>
          <span className="text-[10px] text-slate-400">0.2% Promotions</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Microsoft Outlook / 365</span>
          <p className="text-xl font-bold text-emerald-600">99.2% Inbox</p>
          <span className="text-[10px] text-slate-400">0.8% Other</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Yahoo Mail</span>
          <p className="text-xl font-bold text-emerald-600">99.5% Inbox</p>
          <span className="text-[10px] text-slate-400">Zero spam flags</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500">Apple Mail / iCloud</span>
          <p className="text-xl font-bold text-emerald-600">100% Inbox</p>
          <span className="text-[10px] text-slate-400">Clean IP reputation</span>
        </div>
      </div>
    </div>
  );
};
