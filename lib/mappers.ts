/**
 * Data mappers: Sanity GROQ results → frontend types.
 *
 * This is the translation layer between raw Sanity data and
 * what components consume. When sanity typegen types are available,
 * the input types will be replaced with generated types.
 *
 * The mapper exists because:
 * 1. GROQ results have Sanity-specific shapes (_id, _ref, nested assets)
 * 2. Components need flat, pre-computed values (budgetStatus, topRiskFlags)
 * 3. Derived fields (investment range, budget utilization) are computed here
 *
 * When backend adds DASHBOARD_ANALYSES_QUERY with richer projections,
 * this mapper gets simpler but doesn't disappear — the translation
 * from Sanity shape to component shape is always needed.
 */

import type { PropertySummary, RiskFlag } from '@/lib/types';
import type { RiskLevel, Condition } from '@/lib/scoring-labels';
import { deriveBudgetStatus, deriveBudgetUtilization, deriveInvestmentRange } from '@/lib/budget';

// ---------------------------------------------------------------------------
// Raw Sanity types (temporary — replace with sanity.types.ts imports)
// ---------------------------------------------------------------------------

interface RawProperty {
  _id: string;
  address: string;
  slug: { current: string };
  city: string;
  askingPrice: number;
  livingArea: number;
  rooms: number;
  bedrooms: number;
  bathrooms?: number;
  energyLabel?: string;
  starred?: boolean;
  fundaUrl?: string;
  daysOnMarket?: number;
  listingStatus: string;
  mainImage?: {
    asset?: {
      url?: string;
      metadata?: { lqip?: string };
    };
    alt?: string;
  };
  neighborhood?: {
    name?: string;
  };
}

interface RawAnalysis {
  _id: string;
  matchScore: number;
  tier: string;
  recommendation: string;
  totalInvestment: number;
  totalRenovationCostLow?: number;
  totalRenovationCostMid?: number;
  totalRenovationCostHigh?: number;
  overallCondition?: string;
  overallRiskLevel: string;
  dealbreakers?: string[];
  withinBudget?: boolean;
  budgetRemaining?: number;
  risks?: Array<{ category: string; level: string }>;
  negotiationSignals?: Array<unknown>;
  property?: {
    _id: string;
    address: string;
    slug: { current: string };
    city: string;
    askingPrice: number;
    livingArea: number;
    rooms: number;
    bedrooms: number;
    energyLabel?: string;
    starred?: boolean;
    listingStatus: string;
    mainImage?: {
      asset?: {
        url?: string;
        metadata?: { lqip?: string };
      };
      alt?: string;
    };
  };
}

// ---------------------------------------------------------------------------
// Mapper: TOP_ANALYSES_QUERY result → PropertySummary[]
// ---------------------------------------------------------------------------

/**
 * Maps raw Sanity data to PropertySummary[].
 *
 * Handles two query shapes:
 * 1. Separate properties + analyses arrays (current: two parallel queries)
 * 2. Analyses with embedded property refs (TOP_ANALYSES_QUERY shape)
 *
 * Properties without analyses are included with default scoring values
 * (score 0, tier 'not_recommended') — graceful degradation.
 */
export function mapToPropertySummary(
  properties: RawProperty[],
  analyses: RawAnalysis[],
): PropertySummary[] {
  // Build analysis lookup by property ID
  const analysisByPropertyId = new Map<string, RawAnalysis>();
  for (const a of analyses) {
    const propId = a.property?._id;
    if (propId) {
      analysisByPropertyId.set(propId, a);
    }
  }

  // Also handle analyses that have embedded property data (TOP_ANALYSES_QUERY)
  const analysesWithEmbeddedProps = analyses.filter((a) => a.property);

  // If we have analyses with embedded properties, use those directly
  if (analysesWithEmbeddedProps.length > 0 && properties.length === 0) {
    return analysesWithEmbeddedProps
      .map((a) => mapAnalysisToSummary(a))
      .filter((s): s is PropertySummary => s !== null);
  }

  // Otherwise, join properties with analyses
  return properties.map((prop) => {
    const analysis = analysisByPropertyId.get(prop._id);
    return mapPropertyToSummary(prop, analysis ?? null);
  });
}

function mapPropertyToSummary(
  prop: RawProperty,
  analysis: RawAnalysis | null,
): PropertySummary {
  const renoLow = analysis?.totalRenovationCostLow ?? 0;
  const renoMid = analysis?.totalRenovationCostMid ?? 0;
  const renoHigh = analysis?.totalRenovationCostHigh ?? 0;
  const totalMid = analysis?.totalInvestment ?? prop.askingPrice;
  const investment = deriveInvestmentRange(totalMid, renoLow, renoMid, renoHigh);

  const budgetInput = analysis
    ? { totalInvestment: analysis.totalInvestment, withinBudget: analysis.withinBudget ?? null, budgetRemaining: analysis.budgetRemaining ?? null }
    : null;

  return {
    id: prop._id,
    slug: prop.slug.current,
    address: prop.address,
    city: prop.city,
    neighborhood: prop.neighborhood?.name ?? null,
    askingPrice: prop.askingPrice,
    livingArea: prop.livingArea,
    rooms: prop.rooms,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms ?? 0,
    energyLabel: prop.energyLabel ?? null,
    imageUrl: prop.mainImage?.asset?.url ?? null,
    imageLqip: prop.mainImage?.asset?.metadata?.lqip ?? null,
    starred: prop.starred ?? false,
    fundaUrl: prop.fundaUrl ?? null,
    daysOnMarket: prop.daysOnMarket ?? null,
    matchScore: analysis?.matchScore ?? 0,
    matchTier: (analysis?.tier as PropertySummary['matchTier']) ?? 'not_recommended',
    recommendation: (analysis?.recommendation as PropertySummary['recommendation']) ?? 'skip',
    totalInvestmentLow: investment.low,
    totalInvestmentMid: investment.mid,
    totalInvestmentHigh: investment.high,
    budgetStatus: deriveBudgetStatus(budgetInput),
    budgetUtilization: deriveBudgetUtilization(budgetInput),
    overallRisk: (analysis?.overallRiskLevel as RiskLevel) ?? 'low',
    dealbreakers: analysis?.dealbreakers ?? [],
    topRiskFlags: deriveTopRiskFlags(analysis?.risks ?? []),
    renovationCondition: (analysis?.overallCondition as Condition) ?? null,
    renovationEstimateLow: renoLow,
    renovationEstimateHigh: renoHigh,
    negotiationSignalCount: analysis?.negotiationSignals?.length ?? 0,
  };
}

function mapAnalysisToSummary(analysis: RawAnalysis): PropertySummary | null {
  const prop = analysis.property;
  if (!prop) return null;

  const renoLow = analysis.totalRenovationCostLow ?? 0;
  const renoMid = analysis.totalRenovationCostMid ?? 0;
  const renoHigh = analysis.totalRenovationCostHigh ?? 0;
  const investment = deriveInvestmentRange(analysis.totalInvestment, renoLow, renoMid, renoHigh);

  const budgetInput = {
    totalInvestment: analysis.totalInvestment,
    withinBudget: analysis.withinBudget ?? null,
    budgetRemaining: analysis.budgetRemaining ?? null,
  };

  return {
    id: prop._id,
    slug: prop.slug.current,
    address: prop.address,
    city: prop.city,
    neighborhood: null, // Not in TOP_ANALYSES_QUERY projection
    askingPrice: prop.askingPrice,
    livingArea: prop.livingArea,
    rooms: prop.rooms,
    bedrooms: prop.bedrooms,
    bathrooms: 0, // Not in TOP_ANALYSES_QUERY projection
    energyLabel: prop.energyLabel ?? null,
    imageUrl: prop.mainImage?.asset?.url ?? null,
    imageLqip: prop.mainImage?.asset?.metadata?.lqip ?? null,
    starred: prop.starred ?? false,
    fundaUrl: null, // Not in TOP_ANALYSES_QUERY projection
    daysOnMarket: null, // Not in TOP_ANALYSES_QUERY projection
    matchScore: analysis.matchScore,
    matchTier: analysis.tier as PropertySummary['matchTier'],
    recommendation: analysis.recommendation as PropertySummary['recommendation'],
    totalInvestmentLow: investment.low,
    totalInvestmentMid: investment.mid,
    totalInvestmentHigh: investment.high,
    budgetStatus: deriveBudgetStatus(budgetInput),
    budgetUtilization: deriveBudgetUtilization(budgetInput),
    overallRisk: analysis.overallRiskLevel as RiskLevel,
    dealbreakers: analysis.dealbreakers ?? [],
    topRiskFlags: deriveTopRiskFlags(analysis.risks ?? []),
    renovationCondition: (analysis.overallCondition as Condition) ?? null,
    renovationEstimateLow: renoLow,
    renovationEstimateHigh: renoHigh,
    negotiationSignalCount: analysis.negotiationSignals?.length ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Derived field helpers
// ---------------------------------------------------------------------------

const RISK_SEVERITY: Record<string, number> = {
  high: 2,
  medium: 1,
  low: 0,
};

function deriveTopRiskFlags(
  risks: Array<{ category: string; level: string }>,
): RiskFlag[] {
  return risks
    .filter((r) => r.level !== 'low')
    .sort((a, b) => (RISK_SEVERITY[b.level] ?? 0) - (RISK_SEVERITY[a.level] ?? 0))
    .slice(0, 2)
    .map((r) => ({
      label: r.category,
      severity: r.level as RiskLevel,
    }));
}

// Budget derivation functions moved to lib/budget.ts (shared with detail page)
