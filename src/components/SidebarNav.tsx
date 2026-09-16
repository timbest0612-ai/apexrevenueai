import React from 'react';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Users, 
  Send, 
  GitFork, 
  TrendingUp, 
  MailCheck, 
  Layers, 
  Settings, 
  CreditCard,
  Building2,
  ChevronRight,
  Flame,
  Zap,
  Radio,
  Inbox,
  FileCheck,
  Webhook
} from 'lucide-react';
import { Organization, UserRole } from '../types.js';

interface SidebarNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  organization: Organization;
  userRole: UserRole;
  hotLeadsCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  organization,
  userRole,
  hotLeadsCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Command & Radar', icon: Sparkles, badge: 'Live' },
    { id: 'signals', label: 'Signal Intent Radar', icon: Radio, badge: 'Hot Triggers', badgeClass: 'bg-rose-500/20 text-rose-600 dark:text-rose-400' },
    { id: 'discover', label: 'Global Lead Finder', icon: Search, badge: 'AI' },
    { id: 'masspitch', label: 'Mass Pitch (2k–5k)', icon: Zap, badge: '1-Click Blast', badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' },
    { id: 'verify', label: 'Verification Lab', icon: ShieldCheck, count: undefined },
    { id: 'spamaudit', label: 'AI Spam Auditor', icon: FileCheck, badge: 'Deliver' },
    { id: 'crm', label: 'CRM & Contact 360', icon: Users, count: hotLeadsCount > 0 ? `${hotLeadsCount} Hot` : undefined, countClass: 'bg-amber-500/20 text-amber-600 dark:text-amber-300' },
    { id: 'campaigns', label: 'Campaign Studio', icon: Send, badge: undefined },
    { id: 'inbox', label: 'AI Smart Inbox', icon: Inbox, badge: '3 Unread', badgeClass: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
    { id: 'webhooks', label: 'Webhooks & Cloud Sync', icon: Webhook, badge: 'Live Firestore', badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' },
    { id: 'automations', label: 'Sequences & Flows', icon: GitFork, badge: undefined },
    { id: 'attribution', label: 'Revenue Attribution', icon: TrendingUp, badge: 'ROI' },
    { id: 'deliverability', label: 'DNS & Warmup', icon: MailCheck, badge: undefined },
    { id: 'landing_pages', label: 'Landing Pages & Forms', icon: Layers, badge: undefined },
  ];

  const bottomItems = [
    { id: 'pricing', label: 'Pricing & Tiers', icon: CreditCard, badge: '14d Trial', badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' },
    { id: 'billing', label: 'Plans & Credits', icon: CreditCard },
    { id: 'settings', label: 'Workspace Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 font-bold">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-slate-100">ApexRevenue</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">Customer Acq. OS</p>
          </div>
        </div>

        {/* Organization Switcher Card */}
        <div className="mt-3.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{organization.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="font-semibold text-indigo-500">{organization.plan}</span>
                <span>•</span>
                <span>{userRole}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Operating System
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : item.badgeClass || 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  isActive ? 'bg-white/20 text-white border-white/30' : item.countClass || 'bg-slate-200 text-slate-700'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Credit Meters */}
      <div className="p-3 mx-2 mb-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Search className="h-3 w-3" /> Lead Credits
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{organization.credits.leadDiscovery.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, (organization.credits.leadDiscovery / 3000) * 100)}%` }} />
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium pt-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Verifications
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{organization.credits.emailVerification.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (organization.credits.emailVerification / 5000) * 100)}%` }} />
        </div>
      </div>

      {/* Bottom Settings */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
