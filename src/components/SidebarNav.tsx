import React, { useState } from 'react';
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
  Webhook,
  Plus,
  Compass,
  Check
} from 'lucide-react';
import { Organization, UserRole } from '../types.js';

interface SidebarNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  organization: Organization;
  userRole: UserRole;
  hotLeadsCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeClass?: string;
  count?: string;
  countClass?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  organization,
  userRole,
  hotLeadsCount,
}) => {
  const [navSearch, setNavSearch] = useState('');

  const sections: NavSection[] = [
    {
      title: 'DISCOVER & RADAR',
      items: [
        { id: 'dashboard', label: 'Command & Radar', icon: Sparkles, badge: 'Live' },
        { id: 'signals', label: 'Signal Intent Radar', icon: Radio, badge: 'Triggers', badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold' },
        { id: 'discover', label: 'Global Lead Finder', icon: Search, badge: '50k Max', badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold' },
        { id: 'masspitch', label: 'Mass Pitch (2k–100k)', icon: Zap, badge: 'Blast', badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' },
      ],
    },
    {
      title: 'DELIVERABILITY & SHIELD',
      items: [
        { id: 'verify', label: 'Verification Lab', icon: ShieldCheck, badge: '0 Bounce', badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
        { id: 'spamaudit', label: 'AI Spam Auditor', icon: FileCheck, badge: 'Deliver', badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
        { id: 'deliverability', label: 'DNS & Domain Warmup', icon: MailCheck },
      ],
    },
    {
      title: 'ENGAGE & PIPELINE',
      items: [
        { id: 'crm', label: 'CRM & Contact 360', icon: Users, count: hotLeadsCount > 0 ? `${hotLeadsCount} Hot` : undefined, countClass: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold' },
        { id: 'inbox', label: 'AI Smart Inbox', icon: Inbox, badge: '3 Unread', badgeClass: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold' },
        { id: 'webhooks', label: 'Webhooks & Cloud Sync', icon: Webhook, badge: 'Firestore', badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
      ],
    },
    {
      title: 'OUTREACH & ROI',
      items: [
        { id: 'campaigns', label: 'Campaign Studio', icon: Send },
        { id: 'automations', label: 'Sequences & Flows', icon: GitFork },
        { id: 'landing_pages', label: 'Landing Pages & Forms', icon: Layers },
        { id: 'attribution', label: 'Revenue Attribution', icon: TrendingUp, badge: 'ROI', badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold' },
      ],
    },
  ];

  const bottomItems: NavItem[] = [
    { id: 'pricing', label: 'Pricing & Tiers', icon: CreditCard, badge: '14d Trial', badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' },
    { id: 'billing', label: 'Plans & Credits', icon: CreditCard },
    { id: 'settings', label: 'Workspace Settings', icon: Settings },
  ];

  const filterItem = (item: NavItem) => {
    if (!navSearch.trim()) return true;
    return item.label.toLowerCase().includes(navSearch.toLowerCase());
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 select-none z-20">
      {/* Figma Workspace Top Banner */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs font-bold">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">ApexRevenue</span>
                <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">OS</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[135px]">Revenue Intelligence</p>
            </div>
          </div>
          
          <button
            onClick={() => onSelectTab('settings')}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Nav Filter Input */}
        <div className="mt-2.5 relative">
          <Search className="h-3 w-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Jump to feature..."
            className="w-full pl-7 pr-2 py-1 text-[11px] rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grouped Figma Feature Sections */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4 scrollbar-thin">
        {sections.map((section, sIdx) => {
          const visibleItems = section.items.filter(filterItem);
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-0.5">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </div>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : item.badgeClass || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.count && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : item.countClass || 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Credit Meters & Top Up */}
      <div className="p-2.5 mx-2 mb-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Search className="h-3 w-3 text-indigo-500" /> Lead Credits
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{organization.credits.leadDiscovery.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (organization.credits.leadDiscovery / 3000) * 100)}%` }} />
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium pt-0.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verifications
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{organization.credits.emailVerification.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (organization.credits.emailVerification / 5000) * 100)}%` }} />
        </div>

        <div className="pt-1 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{organization.plan} Plan</span>
          <button
            onClick={() => onSelectTab('billing')}
            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold flex items-center gap-0.5"
          >
            <Plus className="h-2.5 w-2.5" /> Top Up
          </button>
        </div>
      </div>

      {/* Bottom Settings & Account Navigation */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : item.badgeClass || 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
