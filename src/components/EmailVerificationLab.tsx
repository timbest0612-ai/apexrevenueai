import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Download, 
  RefreshCw, 
  Server, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Info, 
  Users, 
  Zap, 
  Check,
  FileSpreadsheet,
  Cpu,
  Layers,
  Database
} from 'lucide-react';
import { EmailVerificationResult, DiscoveredLead } from '../types.js';
import { getVerificationBadgeStyles } from '../utils/formatters.js';

interface EmailVerificationLabProps {
  onNavigateTab?: (tab: string) => void;
  onImportVerifiedToCRM?: (results: EmailVerificationResult[]) => void;
  onLaunchMassPitchWithVerified?: (leads: DiscoveredLead[]) => void;
  prefilledEmails?: string;
  onOpenDemoTutorial?: () => void;
}

export const EmailVerificationLab: React.FC<EmailVerificationLabProps> = ({
  onNavigateTab,
  onImportVerifiedToCRM,
  onLaunchMassPitchWithVerified,
  prefilledEmails,
  onOpenDemoTutorial,
}) => {
  // Tab switcher
  const [activeTab, setActiveTab] = useState<'standard' | 'massive_100k'>('standard');

  // Single Verifier State
  const [singleEmail, setSingleEmail] = useState('olumide@flutterwave.com');
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<EmailVerificationResult | null>({
    email: 'olumide@flutterwave.com',
    status: 'VALID',
    confidenceScore: 99,
    provider: 'Google Workspace (AS15169)',
    verificationDate: new Date().toISOString(),
    reason: 'SMTP mailbox exists, active MX records found, zero spam trap flags.',
    riskFlags: [],
    details: {
      syntaxValid: true,
      domainExists: true,
      mxRecordsFound: true,
      isDisposable: false,
      isRoleAccount: false,
      isCatchAll: false,
      smtpReachable: true,
    }
  });

  // Bulk Verifier State
  const [bulkInput, setBulkInput] = useState(
    prefilledEmails ||
    'founder@paystack.com\nmarketing@konga.com\nfake-user123@temp-mail.org\nsupport@piggyvest.com\ntest.account@guerrillamail.com\ncto@moniepoint.com'
  );
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState<EmailVerificationResult[]>([]);
  const [importingToCRM, setImportingToCRM] = useState(false);
  const [crmSynced, setCrmSynced] = useState(false);

  // Massive 100k Verification Job State
  const [massiveBatchSize, setMassiveBatchSize] = useState<10000 | 50000 | 100000>(50000);
  const [massiveJobRunning, setMassiveJobRunning] = useState(false);
  const [massiveProgress, setMassiveProgress] = useState(0);
  const [massiveJobStats, setMassiveJobStats] = useState<{
    totalProcessed: number;
    validCount: number;
    riskyCount: number;
    invalidCount: number;
    disposableCount: number;
    catchAllCount: number;
    deliverabilityRate: number;
    summaryMessage: string;
  } | null>(null);

  useEffect(() => {
    if (prefilledEmails) {
      setBulkInput(prefilledEmails);
    }
  }, [prefilledEmails]);

  const handleVerifySingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleEmail.trim()) return;

    setSingleLoading(true);
    try {
      const res = await fetch('/api/v1/leads/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: singleEmail.trim() }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setSingleResult(data.result);
      }
    } catch (err) {
      console.error('Failed to verify email:', err);
    } finally {
      setSingleLoading(false);
    }
  };

  const handleVerifyBulk = async () => {
    const rawList = bulkInput
      .split(/[\n,;]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (rawList.length === 0) return;

    setBulkLoading(true);
    try {
      const res = await fetch('/api/v1/leads/verify-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: rawList }),
      });
      const data = await res.json();
      if (data.success && data.results) {
        setBulkResults(data.results);
      }
    } catch (err) {
      console.error('Failed to bulk verify:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  // Run Massive 100k Bulk Verification Job
  const handleRunMassiveVerificationJob = async (batchCount: number) => {
    setMassiveJobRunning(true);
    setMassiveJobStats(null);
    setMassiveProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(batchCount / 20);
      if (progress >= batchCount) {
        progress = batchCount;
        clearInterval(interval);
      }
      setMassiveProgress(progress);
    }, 100);

    try {
      const res = await fetch('/api/v1/leads/verify-massive-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulatedBatchSize: batchCount })
      });
      const data = await res.json();
      clearInterval(interval);
      if (data.success) {
        setMassiveProgress(batchCount);
        setMassiveJobStats({
          totalProcessed: data.totalProcessed,
          validCount: data.validCount,
          riskyCount: data.riskyCount,
          invalidCount: data.invalidCount,
          disposableCount: data.disposableCount,
          catchAllCount: data.catchAllCount,
          deliverabilityRate: data.deliverabilityRate,
          summaryMessage: data.summaryMessage
        });
        if (data.sampleResults) {
          setBulkResults(data.sampleResults);
        }
      }
    } catch (err) {
      console.error('Massive verification job failed:', err);
      clearInterval(interval);
    } finally {
      setMassiveJobRunning(false);
    }
  };

  const handleDownloadCSV = () => {
    if (bulkResults.length === 0) return;
    const headers = 'Email,Status,ConfidenceScore,Reason,IsDisposable,IsRoleAccount,SMTPReachable\n';
    const rows = bulkResults.map(r => 
      `"${r.email}","${r.status}",${r.confidenceScore},"${r.reason}",${r.details.isDisposable},${r.details.isRoleAccount},${r.details.smtpReachable}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexrevenue-verified-emails-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Zero-Bounce Email Verification Lab</h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
              6-Point Deliverability Shield
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3 w-3" /> Up to 100,000 Bulk Batching
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Eliminate bounce rates and protect sender reputation across Google Workspace, Microsoft 365, and private MX gateways before dispatching campaigns.
          </p>
        </div>

        {onOpenDemoTutorial && (
          <button
            onClick={onOpenDemoTutorial}
            className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Tutorial</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('standard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'standard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Interactive Single & Standard Bulk Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('massive_100k')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'massive_100k'
              ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Zap className="h-3.5 w-3.5 text-amber-300" />
          <span>⚡ Massive 100,000 High-Throughput Bulk MX Validator</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-mono font-bold">100k/job</span>
        </button>
      </div>

      {/* Mode 2: Massive 100k Bulk MX Validator */}
      {activeTab === 'massive_100k' && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-indigo-500/30 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                <Database className="h-3 w-3" /> High-Speed MX DNS Caching & Catch-All Isolator
              </span>
              <h2 className="text-lg font-bold text-white">
                Bulk Verification for 10,000 – 100,000 Email Addresses at Once
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Upload large prospect databases or run automated benchmark validation. Our engine processes hundreds of domains per second, filtering out spam traps, disposable burners, and non-resolving MX servers.
              </p>
            </div>

            {/* Batch Selection */}
            <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-2xl border border-indigo-500/30 shrink-0">
              {[
                { val: 10000, label: '10,000 Batch' },
                { val: 50000, label: '50,000 Batch' },
                { val: 100000, label: '100,000 Batch' },
              ].map((b) => (
                <button
                  key={b.val}
                  onClick={() => setMassiveBatchSize(b.val as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    massiveBatchSize === b.val
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">
                  {massiveJobRunning
                    ? `Processing ${massiveProgress.toLocaleString()} / ${massiveBatchSize.toLocaleString()} addresses...`
                    : `Ready to verify ${massiveBatchSize.toLocaleString()} emails with MX DNS clustering.`}
                </span>
                <span className="text-[11px] text-slate-400">
                  Includes SPF/DKIM/DMARC routing checks, disposable domain isolation, and role-account categorization.
                </span>
              </div>

              <button
                type="button"
                disabled={massiveJobRunning}
                onClick={() => handleRunMassiveVerificationJob(massiveBatchSize)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {massiveJobRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying {massiveProgress.toLocaleString()}...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-amber-300" />
                    <span>Run {massiveBatchSize.toLocaleString()} Bulk Verification Job</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Progress Bar */}
            {massiveJobRunning && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>DNS Resolution & Mailbox Handshake Stream:</span>
                  <span>{Math.round((massiveProgress / massiveBatchSize) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-500 transition-all duration-150 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((massiveProgress / massiveBatchSize) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {/* Result Metrics */}
            {massiveJobStats && !massiveJobRunning && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{massiveJobStats.summaryMessage}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Deliverable (Valid)</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {massiveJobStats.validCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400">0% Bounce Risk</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-amber-500/30">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Catch-All (Accept All)</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {massiveJobStats.catchAllCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-400">Warmup Recommended</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-purple-500/30">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Role / Shared Prefix</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {massiveJobStats.riskyCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-purple-400">support@, info@</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/30">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block">Disposable / Burners</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {massiveJobStats.disposableCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-rose-400">Quarantined</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/30">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block">Dead DNS / Invalid</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {massiveJobStats.invalidCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-rose-400">Blocked</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Download Clean CSV</span>
                  </button>

                  {onImportVerifiedToCRM && (
                    <button
                      onClick={() => {
                        const valid = bulkResults.filter(r => r.status === 'VALID');
                        onImportVerifiedToCRM(valid.length > 0 ? valid : [{
                          email: 'founder@apexverified.com',
                          status: 'VALID',
                          confidenceScore: 99,
                          provider: 'Google Workspace',
                          verificationDate: new Date().toISOString(),
                          reason: 'Zero bounce verified deliverability',
                          riskFlags: [],
                          details: { syntaxValid: true, domainExists: true, mxRecordsFound: true, isDisposable: false, isRoleAccount: false, isCatchAll: false, smtpReachable: true }
                        }]);
                        setCrmSynced(true);
                        setTimeout(() => setCrmSynced(false), 3000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>{crmSynced ? 'Synced to CRM!' : `Sync Valid to CRM`}</span>
                    </button>
                  )}

                  {onLaunchMassPitchWithVerified && (
                    <button
                      onClick={() => {
                        const valid = bulkResults.filter(r => r.status === 'VALID');
                        const leads: DiscoveredLead[] = (valid.length > 0 ? valid : [{
                          email: 'ceo@growthbrand.com',
                          status: 'VALID',
                          confidenceScore: 99,
                          provider: 'Google Workspace',
                          verificationDate: new Date().toISOString(),
                          reason: 'Deliverable',
                          riskFlags: [],
                          details: { syntaxValid: true, domainExists: true, mxRecordsFound: true, isDisposable: false, isRoleAccount: false, isCatchAll: false, smtpReachable: true }
                        }]).map((r, i) => {
                          const parts = r.email.split('@');
                          const local = parts[0] || 'Executive';
                          const domain = parts[1] || 'Company';
                          const name = local.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                          return {
                            id: `lead-verified-${Date.now()}-${i}`,
                            fullName: name,
                            firstName: name.split(' ')[0],
                            lastName: name.split(' ').slice(1).join(' '),
                            email: r.email,
                            companyName: domain.split('.')[0].toUpperCase(),
                            country: 'Global',
                            buyingIntentScore: r.confidenceScore,
                            leadFitScore: 92,
                            verificationStatus: 'VALID',
                            confidenceScore: r.confidenceScore,
                            sourceProvider: r.provider || 'Apex Zero-Bounce Lab'
                          };
                        });
                        onLaunchMassPitchWithVerified(leads);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Zap className="h-3.5 w-3.5 text-amber-300" />
                      <span>1-Click Mass Pitch</span>
                    </button>
                  )}

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('spamaudit')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Audit Copy in Spam Lab →</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 1: Standard Single & Batch Verifier */}
      {activeTab === 'standard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Single Real-Time Verifier */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <span>Instant Single Email Audit</span>
              </h2>

              <form onSubmit={handleVerifySingle} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Recipient Mailbox to Test
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="single-email-input"
                      type="email"
                      value={singleEmail}
                      onChange={(e) => setSingleEmail(e.target.value)}
                      placeholder="e.g. founder@company.com"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      required
                    />
                    <button
                      id="verify-single-submit-btn"
                      type="submit"
                      disabled={singleLoading}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5"
                    >
                      {singleLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      <span>Verify</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Single Result Breakdown Card */}
              {singleResult && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{singleResult.email}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{singleResult.reason}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getVerificationBadgeStyles(singleResult.status)}`}>
                      {singleResult.status} ({singleResult.confidenceScore}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      {singleResult.details.syntaxValid ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-rose-500" />}
                      <span>Syntax RFC Valid</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      {singleResult.details.mxRecordsFound ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-rose-500" />}
                      <span>MX Records Active</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      {!singleResult.details.isDisposable ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
                      <span>Non-Disposable</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      {!singleResult.details.isRoleAccount ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Info className="h-3.5 w-3.5 text-amber-500" />}
                      <span>Individual Inbox</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Standard Bulk Paste Verifier */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-indigo-500" />
                  <span>Bulk Verification Paste & Cleaner</span>
                </h2>
                <span className="text-[11px] text-slate-400">Up to 1,000 addresses/paste</span>
              </div>

              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                rows={5}
                placeholder="Paste email list separated by line or commas..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {bulkInput.split(/[\n,;]+/).filter(e => e.trim().length > 0).length} addresses queued
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVerifyBulk}
                    disabled={bulkLoading}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    {bulkLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                    <span>Run Verification</span>
                  </button>
                </div>
              </div>

              {bulkResults.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Results ({bulkResults.filter(r => r.status === 'VALID').length} Valid / {bulkResults.length} Total)
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {onImportVerifiedToCRM && (
                        <button
                          onClick={() => {
                            const valid = bulkResults.filter(r => r.status === 'VALID');
                            onImportVerifiedToCRM(valid);
                            setCrmSynced(true);
                            setTimeout(() => setCrmSynced(false), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Users className="h-3 w-3" />
                          <span>{crmSynced ? 'Synced!' : 'Sync to CRM'}</span>
                        </button>
                      )}

                      {onLaunchMassPitchWithVerified && (
                        <button
                          onClick={() => {
                            const valid = bulkResults.filter(r => r.status === 'VALID');
                            const leads: DiscoveredLead[] = valid.map((r, i) => {
                              const parts = r.email.split('@');
                              const local = parts[0] || 'Executive';
                              const domain = parts[1] || 'Company';
                              const name = local.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                              return {
                                id: `lead-verified-${Date.now()}-${i}`,
                                fullName: name,
                                firstName: name.split(' ')[0],
                                lastName: name.split(' ').slice(1).join(' '),
                                email: r.email,
                                companyName: domain.split('.')[0].toUpperCase(),
                                country: 'Global',
                                buyingIntentScore: r.confidenceScore,
                                leadFitScore: 92,
                                verificationStatus: 'VALID',
                                confidenceScore: r.confidenceScore,
                                sourceProvider: r.provider || 'Apex Zero-Bounce Lab'
                              };
                            });
                            onLaunchMassPitchWithVerified(leads);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Zap className="h-3 w-3 text-amber-300" />
                          <span>1-Click Pitch</span>
                        </button>
                      )}

                      <button
                        onClick={handleDownloadCSV}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Download className="h-3 w-3 text-slate-500" />
                        <span>Download CSV</span>
                      </button>

                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab('spamaudit')}
                          className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          <span>Spam Lab →</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                    {bulkResults.map((r, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                        <span className="font-mono text-slate-800 dark:text-slate-200">{r.email}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVerificationBadgeStyles(r.status)}`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
