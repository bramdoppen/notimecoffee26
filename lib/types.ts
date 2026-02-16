/**
 * Frontend-specific types derived from the data contract.
 *
 * These are lightweight projections optimized for rendering,
 * NOT the full Sanity document types. The GROQ queries in
 * sanity/lib/queries.ts project into these shapes.
 */

import type {
  Tier,
  Recommendation,
  RiskLevel,
  BudgetStatus,
  RenovationNeed,
  Condition,
  RenovationCategory,
} from '@/lib/scoring-labels';

// ---------------------------------------------------------------------------
// Property Card (dashboard grid)
// ---------------------------------------------------------------------------

/** Lightweight projection for PropertyCard rendering.
 *  Maps to TOP_ANALYSES_QUERY result shape. */
export interface PropertySummary {
  id: string;
  slug: string;
  address: string;
  city: string;
  neighborhood: string | null;
  askingPrice: number;
  livingArea: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  energyLabel: string | null;
  imageUrl: string | null;
  imageLqip: string | null;
  matchScore: number;
  matchTier: Tier;
  recommendation: Recommendation;
  totalInvestmentMid: number;
  budgetStatus: BudgetStatus;
  budgetUtilization: number;
  overallRisk: RiskLevel;
  dealbreakers: string[];
  topRiskFlags: RiskFlag[];
  renovationCondition: string | null;
  renovationEstimateLow: number;
  renovationEstimateHigh: number;
  negotiationSignalCount: number;
  starred: boolean;
  fundaUrl: string | null;
  daysOnMarket: number | null;
}

export interface RiskFlag {
  label: string;
  severity: RiskLevel;
}

// ---------------------------------------------------------------------------
// Property Detail (full analysis)
// ---------------------------------------------------------------------------

export interface HardCriterionResult {
  criterion: string;
  pass: boolean;
  actualValue: string;
  requiredValue: string;
  reasoning: string;
}

export interface SoftCriterionResult {
  criterion: string;
  score: number;
  weight: number;
  weightedScore: number;
  reasoning: string;
}

export interface RenovationItem {
  category: RenovationCategory;
  needed: RenovationNeed;
  costLow: number;
  costMid: number;
  costHigh: number;
  reasoning: string;
}

export interface RiskResult {
  category: string;
  level: RiskLevel;
  description: string;
  mitigation: string | null;
}

export interface NegotiationSignal {
  signal: string;
  detail: string;
  implication: string;
}

export interface VveData {
  monthlyContribution: number | null;
  hasReserveFund: boolean | null;
  hasMaintenancePlan: boolean | null;
  kvkRegistered: boolean | null;
  hasBuildingInsurance: boolean | null;
}

export interface PropertyAnalysis {
  id: string;
  matchScore: number;
  tier: Tier;
  recommendation: Recommendation;
  summary: string | null;
  hardCriteriaPass: boolean;
  hardCriteriaResults: HardCriterionResult[];
  softCriteriaScore: number;
  softCriteriaResults: SoftCriterionResult[];
  overallCondition: Condition;
  totalRenovationCostLow: number;
  totalRenovationCostMid: number;
  totalRenovationCostHigh: number;
  renovationBreakdown: RenovationItem[];
  totalInvestment: number;
  kostenKoper: number;
  monthlyMortgage: number | null;
  monthlyTotal: number | null;
  erfpachtNpv: number | null;
  withinBudget: boolean;
  budgetRemaining: number;
  overallRiskLevel: RiskLevel;
  risks: RiskResult[];
  vveData: VveData | null;
  dealbreakers: string[];
  suggestedQuestions: string[];
  inspectionFocus: string[];
  negotiationSignals: NegotiationSignal[];
  analyzedAt: string;
  modelVersion: string | null;
}
