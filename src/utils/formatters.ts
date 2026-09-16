import { CurrencyCode, LeadScoreCategory, EmailVerificationStatus } from '../types.js';

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  if (currency === 'NGN') {
    // 1 USD approx ₦1,450
    const ngnAmount = amount * 1450;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(ngnAmount);
  }

  if (currency === 'GBP') {
    const gbpAmount = amount * 0.78;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(gbpAmount);
  }

  if (currency === 'EUR') {
    const eurAmount = amount * 0.92;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(eurAmount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getScoreBadgeStyles(category: LeadScoreCategory) {
  switch (category) {
    case 'HOT':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    case 'WARM':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
    case 'COLD':
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    case 'INACTIVE':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
}

export function getVerificationBadgeStyles(status: EmailVerificationStatus) {
  switch (status) {
    case 'VALID':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    case 'ACCEPT_ALL':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
    case 'ROLE_ACCOUNT':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
    case 'RISKY':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    case 'DISPOSABLE':
    case 'INVALID':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
}
