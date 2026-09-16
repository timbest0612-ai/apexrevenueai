import { GoogleGenAI } from "@google/genai";
import { db } from "../db/store.js";

export type AIComplexityTask = 
  | 'CLASSIFICATION' 
  | 'SPAM_CHECK' 
  | 'SUMMARY' 
  | 'TAGGING' 
  | 'EMAIL_GENERATION' 
  | 'CAMPAIGN_STRATEGY' 
  | 'DEEP_SCORING' 
  | 'AUTONOMOUS_COPILOT' 
  | 'MEDIA_SCRIPT';

export interface ModelRoutingDecision {
  modelName: string;
  tier: 'CHEAP_FAST' | 'MID_TIER' | 'PREMIUM_REASONING';
  reason: string;
  estimatedCostMultiplier: number;
}

/**
 * Intelligent Model Router
 * Automatically routes tasks to the most cost-effective Gemini model.
 * Simple tasks use high-speed flash models; complex strategy and 4D scoring use reasoning models.
 */
export function routeAIModelForTask(task: AIComplexityTask, isBYOKActive: boolean = false): ModelRoutingDecision {
  if (isBYOKActive) {
    return {
      modelName: 'gemini-3.7-flash',
      tier: 'PREMIUM_REASONING',
      reason: 'BYOK Active: Utilizing high-reasoning Gemini model with custom client key.',
      estimatedCostMultiplier: 1.0,
    };
  }

  switch (task) {
    case 'CLASSIFICATION':
    case 'SPAM_CHECK':
    case 'TAGGING':
    case 'SUMMARY':
      return {
        modelName: 'gemini-2.5-flash-lite',
        tier: 'CHEAP_FAST',
        reason: 'Cost-Optimized: Flash-Lite model utilized for classification, tagging & spam check.',
        estimatedCostMultiplier: 0.1,
      };

    case 'EMAIL_GENERATION':
    case 'CAMPAIGN_STRATEGY':
    case 'MEDIA_SCRIPT':
      return {
        modelName: 'gemini-2.5-flash',
        tier: 'MID_TIER',
        reason: 'Balanced: Flash model utilized for multi-variate high-converting copywriting.',
        estimatedCostMultiplier: 0.4,
      };

    case 'DEEP_SCORING':
    case 'AUTONOMOUS_COPILOT':
    default:
      return {
        modelName: 'gemini-3.7-flash',
        tier: 'PREMIUM_REASONING',
        reason: 'High-Precision: Gemini 3.7 Flash utilized for deep 4D revenue scoring & multi-step copilot.',
        estimatedCostMultiplier: 1.0,
      };
  }
}
