/**
 * UI configuration for scoring tiers, risk levels, and budget status.
 *
 * Extends lib/scoring-labels.ts (shared backend+frontend constants)
 * with Tailwind CSS classes for rendering. This is the ONLY place
 * where visual styling meets scoring domain logic.
 *
 * Usage:
 *   import { TIER_UI } from '@/lib/tier-config';
 *   const config = TIER_UI[analysis.tier];
 *   <span className={config.text}>{config.label}</span>
 */

import {
  TIER_LABELS,
  RECOMMENDATION_LABELS,
  RISK_LEVEL_LABELS,
  BUDGET_STATUS_LABELS,
  RENOVATION_NEED_LABELS,
  CONDITION_LABELS,
  SCORE_THRESHOLDS,
  type Tier,
  type Recommendation,
  type RiskLevel,
  type BudgetStatus,
  type RenovationNeed,
  type Condition,
} from '@/lib/scoring-labels';

// ---------------------------------------------------------------------------
// Tier UI Config
// ---------------------------------------------------------------------------

interface TierUIConfig {
  readonly label: string;
  readonly emoji: string;
  readonly text: string; // Tailwind text color class
  readonly bg: string; // Tailwind background class
  readonly ring: string; // Tailwind ring class (for focus/selection)
  readonly border: string; // Tailwind border color class
  readonly badgeBg: string; // Solid background for score circle
  readonly sort: number; // Sort order (0 = best)
}

export const TIER_UI: Record<Tier, TierUIConfig> = {
  excellent: {
    ...TIER_LABELS.excellent,
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-600',
    sort: 0,
  },
  strong: {
    ...TIER_LABELS.strong,
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    ring: 'ring-blue-200',
    border: 'border-blue-200',
    badgeBg: 'bg-blue-600',
    sort: 1,
  },
  moderate: {
    ...TIER_LABELS.moderate,
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-600',
    sort: 2,
  },
  weak: {
    ...TIER_LABELS.weak,
    text: 'text-red-700',
    bg: 'bg-red-50',
    ring: 'ring-red-200',
    border: 'border-red-200',
    badgeBg: 'bg-red-600',
    sort: 3,
  },
  not_recommended: {
    ...TIER_LABELS.not_recommended,
    text: 'text-gray-600',
    bg: 'bg-gray-100',
    ring: 'ring-gray-300',
    border: 'border-gray-300',
    badgeBg: 'bg-gray-500',
    sort: 4,
  },
} as const;

// ---------------------------------------------------------------------------
// Recommendation UI Config
// ---------------------------------------------------------------------------

interface RecommendationUIConfig {
  readonly label: string;
  readonly emoji: string;
  readonly text: string;
  readonly bg: string;
}

export const RECOMMENDATION_UI: Record<Recommendation, RecommendationUIConfig> =
  {
    visit_immediately: {
      ...RECOMMENDATION_LABELS.visit_immediately,
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    worth_visiting: {
      ...RECOMMENDATION_LABELS.worth_visiting,
      text: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    needs_research: {
      ...RECOMMENDATION_LABELS.needs_research,
      text: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    skip: {
      ...RECOMMENDATION_LABELS.skip,
      text: 'text-gray-600',
      bg: 'bg-gray-100',
    },
  } as const;

// ---------------------------------------------------------------------------
// Risk Level UI Config
// ---------------------------------------------------------------------------

interface RiskUIConfig {
  readonly label: string;
  readonly text: string;
  readonly bg: string;
  readonly dot: string; // Solid dot color for risk indicators
}

export const RISK_UI: Record<RiskLevel, RiskUIConfig> = {
  low: {
    label: RISK_LEVEL_LABELS.low,
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-600',
  },
  medium: {
    label: RISK_LEVEL_LABELS.medium,
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
  high: {
    label: RISK_LEVEL_LABELS.high,
    text: 'text-red-700',
    bg: 'bg-red-50',
    dot: 'bg-red-600',
  },
} as const;

// ---------------------------------------------------------------------------
// Budget Status UI Config
// ---------------------------------------------------------------------------

interface BudgetUIConfig {
  readonly label: string;
  readonly text: string;
  readonly bg: string;
  readonly icon: string;
}

export const BUDGET_UI: Record<BudgetStatus, BudgetUIConfig> = {
  safe: {
    label: BUDGET_STATUS_LABELS.safe,
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    icon: '✅',
  },
  stretch: {
    label: BUDGET_STATUS_LABELS.stretch,
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    icon: '⚠️',
  },
  over_budget: {
    label: BUDGET_STATUS_LABELS.over_budget,
    text: 'text-red-700',
    bg: 'bg-red-50',
    icon: '🚫',
  },
} as const;

// ---------------------------------------------------------------------------
// Renovation Need UI Config
// ---------------------------------------------------------------------------

interface RenovationNeedUIConfig {
  readonly label: string;
  readonly text: string;
  readonly bg: string;
}

export const RENOVATION_NEED_UI: Record<RenovationNeed, RenovationNeedUIConfig> =
  {
    not_needed: {
      label: RENOVATION_NEED_LABELS.not_needed,
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    optional: {
      label: RENOVATION_NEED_LABELS.optional,
      text: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    recommended: {
      label: RENOVATION_NEED_LABELS.recommended,
      text: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    required: {
      label: RENOVATION_NEED_LABELS.required,
      text: 'text-red-700',
      bg: 'bg-red-50',
    },
  } as const;

// ---------------------------------------------------------------------------
// Condition UI Config
// ---------------------------------------------------------------------------

interface ConditionUIConfig {
  readonly label: string;
  readonly text: string;
  readonly bg: string;
}

export const CONDITION_UI: Record<Condition, ConditionUIConfig> = {
  excellent: {
    label: CONDITION_LABELS.excellent,
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
  },
  good: {
    label: CONDITION_LABELS.good,
    text: 'text-blue-700',
    bg: 'bg-blue-50',
  },
  fair: {
    label: CONDITION_LABELS.fair,
    text: 'text-amber-700',
    bg: 'bg-amber-50',
  },
  poor: {
    label: CONDITION_LABELS.poor,
    text: 'text-red-700',
    bg: 'bg-red-50',
  },
  bad: {
    label: CONDITION_LABELS.bad,
    text: 'text-red-800',
    bg: 'bg-red-100',
  },
} as const;

// ---------------------------------------------------------------------------
// Confidence UI Config
// ---------------------------------------------------------------------------
// Pattern: high = no indicator (default = trustworthy),
// medium = subtle ⓘ tooltip, low = yellow banner disclaimer.
// Avoids "confidence fatigue" — only deviations are marked.

export type Confidence = 'high' | 'medium' | 'low';

interface ConfidenceUIConfig {
  readonly showIndicator: boolean;
  readonly showBanner: boolean;
  readonly bannerText: string;
  readonly tooltipText: string;
  readonly text: string;
  readonly bg: string;
}

export const CONFIDENCE_UI: Record<Confidence, ConfidenceUIConfig> = {
  high: {
    showIndicator: false,
    showBanner: false,
    bannerText: '',
    tooltipText: '',
    text: '',
    bg: '',
  },
  medium: {
    showIndicator: true,
    showBanner: false,
    bannerText: '',
    tooltipText: 'Schatting op basis van vergelijkbare woningen',
    text: 'text-gray-400',
    bg: '',
  },
  low: {
    showIndicator: true,
    showBanner: true,
    bannerText:
      '⚠️ Beperkte data beschikbaar — deze schatting is indicatief',
    tooltipText: 'Onvoldoende data voor betrouwbare schatting',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
  },
} as const;

// ---------------------------------------------------------------------------
// Energy Label UI Config
// ---------------------------------------------------------------------------

export function getEnergyLabelColor(label: string): {
  text: string;
  bg: string;
} {
  const upper = label.toUpperCase();
  if (upper.startsWith('A'))
    return { text: 'text-white', bg: 'bg-emerald-600' };
  if (upper === 'B') return { text: 'text-white', bg: 'bg-emerald-500' };
  if (upper === 'C') return { text: 'text-white', bg: 'bg-amber-500' };
  if (upper === 'D') return { text: 'text-white', bg: 'bg-amber-600' };
  if (upper === 'E') return { text: 'text-white', bg: 'bg-orange-600' };
  if (upper === 'F') return { text: 'text-white', bg: 'bg-red-500' };
  if (upper === 'G') return { text: 'text-white', bg: 'bg-red-700' };
  return { text: 'text-gray-600', bg: 'bg-gray-200' };
}

// ---------------------------------------------------------------------------
// Score → Tier helper
// ---------------------------------------------------------------------------

export function scoreToTier(score: number): Tier {
  if (score >= SCORE_THRESHOLDS.excellent) return 'excellent';
  if (score >= SCORE_THRESHOLDS.strong) return 'strong';
  if (score >= SCORE_THRESHOLDS.moderate) return 'moderate';
  if (score >= SCORE_THRESHOLDS.weak) return 'weak';
  return 'not_recommended';
}

// ---------------------------------------------------------------------------
// Bar color helper (for soft criteria, budget utilization)
// ---------------------------------------------------------------------------

export function getBarColor(percentage: number): string {
  if (percentage >= 70) return 'bg-emerald-500';
  if (percentage >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}
