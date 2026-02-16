/**
 * Dashboard filter logic — pure functions, no side effects.
 *
 * Filters are URL-driven via searchParams. This module provides:
 * 1. FilterState type definition
 * 2. Parse/serialize functions for URL ↔ FilterState
 * 3. Filter predicate for PropertySummary[]
 * 4. Sort comparators
 */

import type { PropertySummary } from '@/lib/types';
import type { Tier, RiskLevel } from '@/lib/scoring-labels';

// ---------------------------------------------------------------------------
// Filter State
// ---------------------------------------------------------------------------

export interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  minScore: number;
  maxRisk: RiskLevel | null;
  cities: string[];
  tiers: Tier[];
  starredOnly: boolean;
  sortBy: SortOption;
}

export type SortOption =
  | 'score_desc'
  | 'price_asc'
  | 'price_desc'
  | 'investment_asc'
  | 'date_desc';

export const SORT_OPTIONS: Record<SortOption, string> = {
  score_desc: 'Score (hoogste eerst)',
  price_asc: 'Prijs (laagste eerst)',
  price_desc: 'Prijs (hoogste eerst)',
  investment_asc: 'Investering (laagste eerst)',
  date_desc: 'Nieuwste eerst',
} as const;

export const DEFAULT_FILTERS: FilterState = {
  minPrice: null,
  maxPrice: null,
  minScore: 0,
  maxRisk: null,
  cities: [],
  tiers: [],
  starredOnly: false,
  sortBy: 'score_desc',
};

// ---------------------------------------------------------------------------
// URL ↔ FilterState
// ---------------------------------------------------------------------------

export function parseFilters(params: URLSearchParams): FilterState {
  return {
    minPrice: parseIntOrNull(params.get('minPrice')),
    maxPrice: parseIntOrNull(params.get('maxPrice')),
    minScore: parseInt(params.get('minScore') ?? '0', 10) || 0,
    maxRisk: (params.get('maxRisk') as RiskLevel) ?? null,
    cities: params.getAll('city'),
    tiers: params.getAll('tier') as Tier[],
    starredOnly: params.get('starred') === '1',
    sortBy: (params.get('sort') as SortOption) ?? 'score_desc',
  };
}

export function serializeFilters(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minScore > 0) params.set('minScore', String(filters.minScore));
  if (filters.maxRisk) params.set('maxRisk', filters.maxRisk);
  for (const city of filters.cities) params.append('city', city);
  for (const tier of filters.tiers) params.append('tier', tier);
  if (filters.starredOnly) params.set('starred', '1');
  if (filters.sortBy !== 'score_desc') params.set('sort', filters.sortBy);

  return params;
}

/** Count how many non-default filters are active */
export function activeFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.minPrice != null) count++;
  if (filters.maxPrice != null) count++;
  if (filters.minScore > 0) count++;
  if (filters.maxRisk) count++;
  if (filters.cities.length > 0) count++;
  if (filters.tiers.length > 0) count++;
  if (filters.starredOnly) count++;
  return count;
}

// ---------------------------------------------------------------------------
// Filter Predicate
// ---------------------------------------------------------------------------

export function filterProperties(
  properties: PropertySummary[],
  filters: FilterState,
): PropertySummary[] {
  return properties.filter((p) => {
    if (filters.minPrice != null && p.askingPrice < filters.minPrice) return false;
    if (filters.maxPrice != null && p.askingPrice > filters.maxPrice) return false;
    if (p.matchScore < filters.minScore) return false;
    if (filters.maxRisk && !isRiskWithin(p.overallRisk, filters.maxRisk)) return false;
    if (filters.cities.length > 0 && !filters.cities.includes(p.city)) return false;
    if (filters.tiers.length > 0 && !filters.tiers.includes(p.matchTier)) return false;
    if (filters.starredOnly && !p.starred) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Sort
// ---------------------------------------------------------------------------

export function sortProperties(
  properties: PropertySummary[],
  sortBy: SortOption,
): PropertySummary[] {
  const sorted = [...properties];

  switch (sortBy) {
    case 'score_desc':
      return sorted.sort((a, b) => b.matchScore - a.matchScore);
    case 'price_asc':
      return sorted.sort((a, b) => a.askingPrice - b.askingPrice);
    case 'price_desc':
      return sorted.sort((a, b) => b.askingPrice - a.askingPrice);
    case 'investment_asc':
      return sorted.sort((a, b) => a.totalInvestmentMid - b.totalInvestmentMid);
    case 'date_desc':
      return sorted.sort(
        (a, b) => (b.daysOnMarket ?? 0) - (a.daysOnMarket ?? 0),
      );
    default:
      return sorted;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function isRiskWithin(actual: RiskLevel, max: RiskLevel): boolean {
  return RISK_ORDER[actual] <= RISK_ORDER[max];
}

function parseIntOrNull(value: string | null): number | null {
  if (value == null) return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}
