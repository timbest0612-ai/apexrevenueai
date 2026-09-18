import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Send, 
  Inbox, 
  Video, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Database, 
  Key, 
  Layers, 
  BookOpen, 
  PlayCircle,
  TrendingUp,
  FileSpreadsheet,
  Globe,
  Sliders,
  Calculator,
  MailCheck
} from 'lucide-react';

interface DemoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DemoTutorialModal: React.FC<DemoTutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const TUTORIAL_STEPS = [
    {
      id: 'overview',
      badge: 'System Audit & 100% Rating',
      title: 'Platform Rating & Feature Navigation Map',
      rating: '100% Production Grade',
      description: 'The ApexRevenue AI Operating System is a unified customer acquisition and autonomous revenue engine with real 100k lead harvesting, zero-bounce verification, multi-channel dispatch, and automated deal closing.',
      highlights: [
        '📍 Global Lead Finder (Sidebar #3): 2 primary categories (Individuals vs. Business) + freeform unique word search across all features with Gmail, Yahoo, .edu, and corporate domain filtering.',
        '📍 1-Click Mass Pitch (Sidebar #4): Blast personalized sequences to 2,000–5,000+ leads at once with {{firstName}}, {{entityName}}, and {{department}} dynamic tokens.',
        '📍 Signal Intent Radar (Sidebar #2): Live intent scoring on executive hiring triggers, tech stack migrations, and funding rounds.',
        '📍 AI Spam Auditor & Verification Lab (Sidebar #5 & #6): Real-time spam keyword density scanner, zero-bounce MX cluster verifier, and SPF/DKIM/DMARC health.',
        '📍 CRM & Smart Inbox (Sidebar #7 & #9): Inbound reply auto-triage (Hot Lead, Objection, Booking) with 1-click Gemini response drafting.',
        '📍 Webhooks & Cloud Sync (Sidebar #10): Real-time Firestore sync & webhook endpoints for WhatsApp, Stripe, and CRM integrations.'
      ],
      actionLabel: 'Explore Step 1: 100k Lead Miner',
      targetTab: 'discover'
    },
    {
      id: 'mining',
      badge: 'Step 1: 100k Lead Harvester',
      title: 'How to Search for Individuals vs. Businesses Interested in You',
      rating: '100k Leads / Batch',
      description: 'Open "Global Lead Finder" in the left sidebar. Choose whether to search for Individuals or Businesses, or type ANY unique search words into the search bar.',
      highlights: [
        '1. Open "Global Lead Finder" (or click "Discover" tab).',
        '2. Select your category: "1. Search Individuals" (Students, Freelancers, Specialists, Crypto builders, Consumers) or "2. Search Business" (Founders & Decision Makers seeking your solutions).',
        '3. Freeform Search: Type ANY unique words into the search bar (e.g. "UNILAG computer science", "Solana trader", "Fintech CEO", "Stripe") to search across all features.',
        '4. For Business: Enter "What My Business Offers / Sells" to auto-match buyers with high buying intent.',
        '5. Pick your Email Domain Provider: Gmail (@gmail.com), Yahoo (@yahoo.com), Outlook, University (.edu), or Corporate Domains.',
        '6. Set Volume Preset (2.5k, 10k, 50k, or 100k Max) and click "Start Harvesting" to stream verified leads at ~4,500 leads/sec with zero bounce.'
      ],
      actionLabel: 'Go to Lead Finder',
      targetTab: 'discover'
    },
    {
      id: 'playbook',
      badge: 'Step 2: AI Playbook Blueprint',
      title: 'Autonomous Multi-Channel Playbook Generator',
      rating: '4-Stage Cadence',
      description: 'Enter your business offering or URL in Campaign Studio to automatically generate cold emails, A/B tested subject lines, WhatsApp follow-ups, and spam score audits.',
      highlights: [
        '1. Navigate to "Campaign Studio" in the left sidebar.',
        '2. Open the "Autonomous Playbook Blueprint" tab.',
        '3. Review the 4-touch sequence (Day 1 Cold Hook, Day 3 Diagnostic, Day 7 Case Study, Day 12 Breakup).',
        '4. Inspect live A/B tested subject lines with zero-spam deliverability scores.',
        '5. Click "Launch Mass Pitcher" to push the entire playbook to live sending in 1-click.'
      ],
      actionLabel: 'Open Campaign Studio',
      targetTab: 'campaigns'
    },
    {
      id: 'mass_pitch',
      badge: 'Step 3: High-Volume Outbound',
      title: 'How to Launch a 1-Click Mass Pitch to Thousands',
      rating: 'Multi-Channel Blast',
      description: 'Pitch thousands of verified prospects at once across Cold Email or WhatsApp B2B without risking your domain reputation.',
      highlights: [
        '1. Click "Mass Pitch (2k–5k)" in the sidebar or "Launch Mass Pitch" from Lead Finder.',
        '2. Select your channel: Direct Cold Email or WhatsApp B2B.',
        '3. Choose a winning tone (Assertive ROI, Strategic Audit, Soft Value).',
        '4. Preview real-time AI personalization variables ({{firstName}}, {{companyName}}, {{department}}, {{courseOrDegree}}).',
        '5. Click "Dispatch to All Prospects" to launch automated sequence delivery.'
      ],
      actionLabel: 'Go to Mass Outreach',
      targetTab: 'masspitch'
    },
    {
      id: 'smart_inbox',
      badge: 'Step 4: Autonomous Response',
      title: 'How the AI Smart Inbox Automates Deal Closing',
      rating: 'Zero-Touch Revenue',
      description: 'When prospects reply to your campaigns, the Smart Inbox categorizes buying intent, crafts objection-proof responses, and syncs meeting booking links.',
      highlights: [
        '1. Navigate to "AI Smart Inbox" in the left sidebar.',
        '2. Filter by Intent: Hot Lead, Objection, Question, or Meeting Request.',
        '3. Click "AI Suggest Reply" to let Gemini draft an authoritative response addressing their exact pain point.',
        '4. Deals automatically update stage in your CRM Kanban board.'
      ],
      actionLabel: 'Open Smart Inbox',
      targetTab: 'inbox'
    },
    {
      id: 'deliverability_roi',
      badge: 'Step 5: DNS & ROI Calculator',
      title: 'Deliverability Center, Webhooks & Cloud Sync',
      rating: '99.8% Inbox Placement',
      description: 'Maintain pristine sender reputation with live DNS protocol audits (SPF, DKIM, DMARC, BIMI) and sync live events via Webhooks & Firestore.',
      highlights: [
        '1. Check "DNS & Warmup" (Sidebar #13) to audit domain DNS records and copy pre-configured registrar templates.',
        '2. Check "Webhooks & Cloud Sync" (Sidebar #10) for real-time Firestore database connection and webhook dispatch logs.',
        '3. Check "Revenue Attribution" to model pipeline revenue and SDR replacement savings with the interactive ROI calculator.',
        '4. Use "Workspace Settings" to add your BYOK keys for zero third-party markups.'
      ],
      actionLabel: 'Open Deliverability Center',
      targetTab: 'deliverability'
    },
    {
      id: 'offer_matrix',
      badge: 'Step 6: Grand Slam Offer & Profit',
      title: 'How to Engineer Irresistible Offers & Boost Order Values',
      rating: '+30%–60% AOV',
      description: 'Use the Alex Hormozi $100M Value Equation, 1-click checkout order bumps, and risk-reversal guarantees to eliminate buyer price resistance.',
      highlights: [
        '1. Open "Grand Slam Offer Studio" in the left sidebar under OFFER & BUYER CONVERSION.',
        '2. Specify your Product Name, Core Price, Primary Buyer Pain, and Dream Outcome.',
        '3. Tune the Value Equation Sliders (Dream Outcome, Certainty, Speed to Value, and Effort Reduction).',
        '4. Toggle 1-Click Order Bumps (DNS Concierge, Pitch Asset Vault) to instantly add $200–$500 per customer.',
        '5. Select your Risk-Reversal Guarantee (e.g. 30-Day Milestone or 50/50 Shared Escrow).',
        '6. Click "Copy Offer Stack" to use in pitches or "Launch Buyer Deal Room".'
      ],
      actionLabel: 'Open Offer Studio',
      targetTab: 'offer_matrix'
    },
    {
      id: 'deal_room',
      badge: 'Step 7: Buyer Deal Room & MAP',
      title: 'How to Close Deals Faster with a Mutual Action Plan',
      rating: '50% Faster Close',
      description: 'Give decision-makers and CFOs a dedicated Digital Sales Room featuring an interactive Cost of Inaction (COI) calculator and 30-day onboarding roadmap.',
      highlights: [
        '1. Open "Buyer Deal Room & MAP" from the sidebar.',
        '2. Adjust the Interactive Buyer ROI Modeler: set rep team size and wasted hours to show the buyer their exact monthly Cost of Inaction (COI).',
        '3. Review the 6-step Mutual Action Plan (MAP) with clear milestone deliverables and owners (BUYER vs SELLER).',
        '4. Click "1-Click CFO Memo" to view and copy a formal internal business justification memo.',
        '5. Click "Share Room with Buyer" to send a clean personalized link or use "Approve Proposal" for digital sign-off.'
      ],
      actionLabel: 'Open Buyer Deal Room',
      targetTab: 'deal_room'
    },
    {
      id: 'objections',
      badge: 'Step 8: Objection Decimator',
      title: 'How to Decimate Objections & Flank Competitors',
      rating: '+56% Close Rate',
      description: 'Arm yourself with psychological reframes, word-for-word counter scripts, and competitor battlecards for price, timing, and incumbent hesitations.',
      highlights: [
        '1. Open "Objection Decimator" from the left sidebar.',
        '2. Filter by category: Price/Budget, Competitor, Timing, Complexity, or Trust/Proof.',
        '3. Inspect the hidden psychological fear behind what the buyer says.',
        '4. Click "Copy Script" to grab battle-tested email/WhatsApp responses ready to paste into Smart Inbox.',
        '5. Check the Competitor Flanking Battlecards to plant strategic landmine questions when prospects mention Apollo, ZoomInfo, or traditional SDR agencies.'
      ],
      actionLabel: 'Open Objection Decimator',
      targetTab: 'objections'
    },
    {
      id: 'social_scout',
      badge: 'Step 9: Omnichannel Social Scout',
      title: 'Scout Prospects Across 9 Social Networks & Forums with Active Pain Points',
      rating: 'Facebook • YT • X • LinkedIn • TikTok • IG • Pinterest • Forums • Snapchat',
      description: 'Find real prospects talking about problems your product solves right now across Facebook Groups, YouTube, LinkedIn, X, TikTok, Instagram, Pinterest, Discussion Forums (Reddit/Quora), and Snapchat.',
      highlights: [
        '1. Open "Global Lead Finder" (Sidebar #3) and scroll to the "Omnichannel Social Scout & Pain Extractor" panel.',
        '2. Enter your Product Name, Product Description, and Target Niches (e.g., "B2B SaaS, Agencies, E-Commerce").',
        '3. Select your target Social Network or choose "All Channels" to scout across all 9 platforms simultaneously.',
        '4. AI dynamically infers the core buyer pain points, target persona, and live social search queries for your product.',
        '5. Click "Scout Social Prospects with Active Pain" to extract decision-makers, direct social handles (@founder_mike), and exact quoted pain point excerpts.',
        '6. Filter by Pain Severity (🔥 Critical, ⚡ High, Moderate) to prioritize prospects ready to buy immediately, then 1-click import to CRM or download CSV.'
      ],
      actionLabel: 'Go to Social Scout',
      targetTab: 'discover'
    },
    {
      id: 'vercel_deployment',
      badge: 'Step 10: Vercel Deployment via GitHub',
      title: 'How to Deploy Your Live App to Vercel via GitHub (Step-by-Step)',
      rating: 'Zero-Config Edge Deploy',
      description: 'Follow this proven checklist to deploy your updated application to Vercel using your GitHub repository so all your new features go live worldwide.',
      highlights: [
        '1. Export or Push to GitHub: In the AI Studio top bar / settings menu, select "Export to GitHub" (or push your repository: `git add .`, `git commit -m "feat: social scout & offer studio"`, `git push origin main`).',
        '2. Log in to Vercel: Visit https://vercel.com and click "Add New..." -> "Project".',
        '3. Import GitHub Repo: Select your GitHub account and find this repository from the list, then click "Import".',
        '4. Configure Project: Preset is automatically detected as "Vite". The Root Directory is `./`, Build Command is `npm run build`, and Output Directory is `dist`.',
        '5. Environment Variables: If you use custom Firebase or Gemini keys, expand the "Environment Variables" section and paste your keys (e.g., VITE_FIREBASE_API_KEY).',
        '6. Click "Deploy": Vercel builds and deploys your high-performance app within 40 seconds, giving you a custom live URL (e.g. `https://your-app.vercel.app`) with automatic SSL and global CDN!'
      ],
      actionLabel: 'Explore System',
      targetTab: 'discover'
    }
  ];

  const current = TUTORIAL_STEPS[activeStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">System Guide & Interactive Tutorial</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  100% Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete walkthrough on collecting 100k leads, generating AI playbooks, mass pitching, and autonomous AI CRM workflows.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          {TUTORIAL_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeStep === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <span>{step.badge}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                {current.badge}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{current.rating}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">{current.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{current.description}</p>
          </div>

          {/* Highlights / Step by Step list */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Key Capabilities & Action Steps
            </span>
            <div className="space-y-2.5">
              {current.highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onNavigateTab(current.targetTab);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {activeStep < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(TUTORIAL_STEPS.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Next Guide
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
