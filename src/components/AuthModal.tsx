import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  User,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { signInWithGoogleAccount, isPlatformOwner, PLATFORM_OWNER_EMAIL } from '../lib/firebase.js';
import { User as UserType } from '../types.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  onUserAuthenticated: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserAuthenticated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const fbUser = await signInWithGoogleAccount();
      const isOwner = isPlatformOwner(fbUser.email);
      const appUser: UserType = {
        id: fbUser.uid,
        email: fbUser.email || '',
        fullName: fbUser.displayName || (isOwner ? 'Tim Best (Platform Owner)' : 'Apex User'),
        avatarUrl: fbUser.photoURL || undefined,
        isSuperAdmin: isOwner,
      };

      // Notify backend of session
      try {
        await fetch('/api/v1/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: appUser.email,
            fullName: appUser.fullName,
            avatarUrl: appUser.avatarUrl,
          }),
        });
      } catch (err) {
        console.warn('Backend session sync note:', err);
      }

      onUserAuthenticated(appUser);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      // If popup was closed by user or blocked in preview iframe, provide helpful fallback message
      setErrorMsg(err.message || 'Google Sign-In was cancelled or popup blocked. You can also use the 1-Click Platform Owner / Trial switcher below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, fullName: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const isOwner = isPlatformOwner(email);
      const appUser: UserType = {
        id: isOwner ? 'usr-owner-timbest' : `usr-${Date.now()}`,
        email,
        fullName,
        isSuperAdmin: isOwner,
      };

      // Sync with backend
      await fetch('/api/v1/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      });

      onUserAuthenticated(appUser);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to switch session.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentOwner = isPlatformOwner(currentUser.email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">ApexRevenue AI Sign In</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">14-Day Free Access Sandbox & Platform Owner Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Value Props & Zero Token Policy */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>14-Day Free Trial</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Test all features without paying. Zero upfront cost and zero credit card required.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Zero Token Drain</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Operates without draining owner tokens, featuring BYOK and local AI heuristic accelerators.
              </p>
            </div>
          </div>

          {/* Primary Google Auth Button */}
          <div className="space-y-3 pt-1">
            <button
              id="google-sign-in-modal-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-slate-800 dark:text-white font-semibold text-sm shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Signs you in securely via Google OAuth. Auto-detects Platform Owner or starts 14-day trial.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
              Quick Role Switcher
            </span>
          </div>

          {/* Quick Switch Profiles */}
          <div className="space-y-2">
            {/* Platform Owner Profile Button */}
            <button
              id="switch-owner-btn"
              onClick={() => handleQuickLogin(PLATFORM_OWNER_EMAIL, 'Tim Best (Platform Owner)')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                isCurrentOwner
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-xs">
                  <Crown className="h-4 w-4 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">Tim Best (Platform Owner)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Free Lifetime VIP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{PLATFORM_OWNER_EMAIL}</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>{isCurrentOwner ? 'Active' : 'Select'}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Regular Google Account Trial Profile */}
            <button
              id="switch-trial-user-btn"
              onClick={() => handleQuickLogin('alex.growth@enterprise.com', 'Alex Rivers (Trial User)')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                !isCurrentOwner
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-900 dark:text-indigo-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-xs">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">Standard Google User</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                      14-Day Free Trial
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero Cost • Zero Owner Token Drain</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span>{!isCurrentOwner ? 'Active' : 'Select'}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure Firebase Firestore & Auth</span>
          </div>
          <span>v2.4 Production Engine</span>
        </div>
      </div>
    </div>
  );
};
