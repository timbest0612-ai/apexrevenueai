import React from 'react';
import { 
  Sparkles, 
  Search, 
  Globe, 
  Bell, 
  User, 
  RefreshCw, 
  Zap, 
  CheckCircle2,
  Crown,
  CreditCard,
  LogIn,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { CurrencyCode, Organization, User as UserType, UserRole } from '../types.js';
import { isPlatformOwner } from '../lib/firebase.js';

interface TopHeaderProps {
  organization: Organization;
  user: UserType;
  userRole: UserRole;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onOpenAICommand: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenDemoTutorial?: () => void;
  onOpenPricing?: () => void;
  onOpenAuthModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  organization,
  user,
  userRole,
  currency,
  onChangeCurrency,
  onOpenAICommand,
  onRefresh,
  isRefreshing,
  onOpenDemoTutorial,
  onOpenPricing,
  onOpenAuthModal,
}) => {
  const isOwner = isPlatformOwner(user.email);

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-10 sticky top-0">
      {/* Search & AI Command Trigger */}
      <div className="flex items-center gap-3 w-1/3 min-w-[200px]">
        <button
          id="top-ai-command-trigger"
          onClick={onOpenAICommand}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950 text-xs text-slate-500 hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 group-hover:rotate-12 transition-transform" />
            <span className="text-slate-600 dark:text-slate-300 truncate">Ask Apex AI or search...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Pricing Tiers Button */}
        {onOpenPricing && (
          <button
            id="header-pricing-btn"
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-xs"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pricing & Tiers</span>
          </button>
        )}

        {/* Currency Switcher */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          {(['USD', 'NGN', 'GBP', 'EUR'] as CurrencyCode[]).map((curr) => (
            <button
              key={curr}
              id={`currency-btn-${curr}`}
              onClick={() => onChangeCurrency(curr)}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currency === curr
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {curr === 'USD' ? '$ USD' : curr === 'NGN' ? '₦ NGN' : curr === 'GBP' ? '£ GBP' : '€ EUR'}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          id="header-refresh-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
          className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
        </button>

        {/* Deliverability Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Deliverability: 99.6%</span>
        </div>

        {onOpenDemoTutorial && (
          <button
            onClick={onOpenDemoTutorial}
            className="hidden md:flex px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            <span>Tutorial</span>
          </button>
        )}

        {/* User Pill / Account Switcher Button */}
        <button
          id="header-user-account-btn"
          onClick={onOpenAuthModal}
          className={`flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-xl border transition-all ${
            isOwner
              ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700'
          }`}
          title="Click to Switch Account or Sign In with Google"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="h-6 w-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs ${
              isOwner ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-extrabold' : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
            }`}>
              {isOwner ? <Crown className="h-3.5 w-3.5 text-slate-950" /> : user.fullName.charAt(0)}
            </div>
          )}

          <div className="hidden md:block text-left max-w-[150px]">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                {user.fullName}
              </p>
              {isOwner && (
                <Crown className="h-3 w-3 text-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {isOwner ? 'Platform Owner (VIP)' : '14-Day Free Trial'}
            </p>
          </div>

          <LogIn className="h-3.5 w-3.5 text-slate-400 ml-1" />
        </button>
      </div>
    </header>
  );
};
