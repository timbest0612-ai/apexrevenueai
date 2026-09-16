import React, { useState } from 'react';
import { 
  GitFork, 
  Play, 
  Pause, 
  Plus, 
  Sparkles, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ArrowDown, 
  Split, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { Workflow, CurrencyCode } from '../types.js';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

interface AutomationCanvasViewProps {
  automations: Workflow[];
  currency: CurrencyCode;
  onToggleAutomation: (id: string) => void;
}

export const AutomationCanvasView: React.FC<AutomationCanvasViewProps> = ({
  automations,
  currency,
  onToggleAutomation,
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow>(automations[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sequences & Flow Engine</h1>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
              Omnichannel Automation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automate multi-touch customer acquisition across Email, WhatsApp Business API, and SMS with smart conditional branching.
          </p>
        </div>

        <button
          id="create-new-sequence-btn"
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Sequence Flow</span>
        </button>
      </div>

      {/* Grid: Left Flow Selector, Right Visual Flow Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sequences List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Active Flows ({automations.length})
          </h2>

          <div className="space-y-2.5">
            {automations.map((flow) => {
              const isSelected = selectedWorkflow?.id === flow.id;
              return (
                <div
                  key={flow.id}
                  id={`flow-card-${flow.id}`}
                  onClick={() => setSelectedWorkflow(flow)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Trigger: {flow.trigger.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAutomation(flow.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        flow.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {flow.isActive ? <Pause className="h-2.5 w-2.5 fill-current" /> : <Play className="h-2.5 w-2.5 fill-current" />}
                      <span>{flow.isActive ? 'ACTIVE' : 'PAUSED'}</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-2">{flow.name}</h3>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Enrolled</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{formatNumber(flow.metrics.enrolled)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Converted</span>
                      <span className="text-xs font-semibold text-emerald-600">{formatNumber(flow.metrics.converted)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Attributed</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatCurrency(flow.metrics.revenue, currency)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Visual Interactive Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedWorkflow.name}</h3>
                <p className="text-xs text-slate-500">Autonomous multi-stage execution pipeline</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                  {formatCurrency(selectedWorkflow.metrics.revenue, currency)} Attributed
                </span>
              </div>
            </div>

            {/* Visual Node Chain */}
            <div className="space-y-4 max-w-lg mx-auto py-2">
              {/* Trigger Node */}
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-1 text-center relative">
                <div className="inline-flex p-2 rounded-lg bg-indigo-600 text-white mb-1">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Trigger Event</div>
                <div className="font-semibold text-xs text-white">
                  Contact triggers: <span className="text-amber-300 font-bold">{selectedWorkflow.trigger.type}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-indigo-500" />
              </div>

              {/* Step 1 Node */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1: Automated Email</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">99.8% Delivered</span>
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Send: Personalized Introduction & Pain-Point Breakdown</span>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-indigo-500" />
              </div>

              {/* Delay Node */}
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Wait 24 Hours (Smart Timezone Optimization)</span>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-indigo-500" />
              </div>

              {/* Split / Branch Node */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Split className="h-4 w-4 text-purple-500" />
                  <span>Condition: Link Clicked or Checkout Visited?</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-600">IF YES (Hot Intent)</span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-emerald-500" />
                      <span>Send WhatsApp VIP Demo Offer</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-200/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">IF NO (Nurture)</span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-500" />
                      <span>Send Free Industry Playbook</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
