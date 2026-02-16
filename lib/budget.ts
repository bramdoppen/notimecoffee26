/**
 * Budget derivation helpers.
 *
 * TODO: Remove when scoring engine produces budgetStatus and
 * budgetUtilization directly in PropertyAnalysis documents.
 * These are temporary client-side calculations until the
 * scoring engine is live.
 *
 * @see /scoring-spec/data-contract-scoring section 6
 */

import type { BudgetStatus } from '@/lib/scoring-labels';

interface BudgetInput {
  totalInvestment: number;
  withinBudget: boolean | null;
  budgetRemaining: number | null;
}

/** Stretch threshold: within budget but <5% remaining */
const STRETCH_THRESHOLD = 0.05;

/**
 * Derive budget status from analysis fields.
 * safe: within budget, >5% remaining
 * stretch: within budget, <5% remaining
 * over_budget: not within budget
 */
export function deriveBudgetStatus(input: BudgetInput | null): BudgetStatus {
  if (!input) return 'safe';
  if (!input.withinBudget) return 'over_budget';

  const remaining = input.budgetRemaining ?? 0;
  if (input.totalInvestment > 0 && remaining / input.totalInvestment < STRETCH_THRESHOLD) {
    return 'stretch';
  }
  return 'safe';
}

/**
 * Derive budget utilization percentage.
 * Returns 0-100+ (can exceed 100 if over budget).
 */
export function deriveBudgetUtilization(input: BudgetInput | null): number {
  if (!input || input.totalInvestment <= 0) return 0;

  const remaining = input.budgetRemaining ?? 0;
  const maxBudget = input.totalInvestment + remaining;
  if (maxBudget <= 0) return 0;

  return Math.round((input.totalInvestment / maxBudget) * 100);
}

/**
 * Derive investment range from total + renovation spread.
 */
export function deriveInvestmentRange(
  totalMid: number,
  renoLow: number,
  renoMid: number,
  renoHigh: number,
): { low: number; mid: number; high: number } {
  const spreadLow = renoMid - renoLow;
  const spreadHigh = renoHigh - renoMid;
  return {
    low: totalMid - spreadLow,
    mid: totalMid,
    high: totalMid + spreadHigh,
  };
}
