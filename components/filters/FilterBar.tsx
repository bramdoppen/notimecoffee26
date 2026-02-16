'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { parseFilters, serializeFilters, activeFilterCount, DEFAULT_FILTERS, type FilterState } from '@/lib/filters';
import type { Tier, RiskLevel } from '@/lib/scoring-labels';
import type { BudgetStatus } from '@/lib/scoring-labels';
import { TIER_UI, RISK_UI, BUDGET_UI } from '@/lib/tier-config';

const BUDGET_FILTER_OPTIONS: BudgetStatus[] = ['safe', 'stretch', 'over_budget'];

interface FilterBarProps {
  /** Available cities from the dataset, for the city filter */
  availableCities: string[];
}

/**
 * Horizontal filter bar for the dashboard (desktop + mobile).
 *
 * All filter state lives in URL searchParams — no useState for filter values.
 * Each change pushes a new URL, triggering a server re-render.
 *
 * Compact layout: inline controls on one row, expandable for more options.
 * Mobile: wraps naturally, key filters first.
 */
export function FilterBar({ availableCities }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);
  const count = activeFilterCount(filters);

  function update(partial: Partial<FilterState>) {
    const next = { ...filters, ...partial };
    const params = serializeFilters(next);
    const query = params.toString();
    router.push(query ? `/?${query}` : '/', { scroll: false });
  }

  function reset() {
    router.push('/', { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Min score */}
      <label className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
        <span className="text-gray-500">Min score</span>
        <input
          type="number"
          min={0}
          max={100}
          step={5}
          value={filters.minScore || ''}
          placeholder="0"
          onChange={(e) => update({ minScore: parseInt(e.target.value, 10) || 0 })}
          className="w-12 border-none bg-transparent p-0 text-sm font-medium text-gray-900 focus:outline-none"
          aria-label="Minimum score"
        />
      </label>

      {/* Max risk */}
      <select
        value={filters.maxRisk ?? ''}
        onChange={(e) => update({ maxRisk: (e.target.value as RiskLevel) || null })}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        aria-label="Maximum risico"
      >
        <option value="">Alle risico&apos;s</option>
        <option value="low">{RISK_UI.low.label}</option>
        <option value="medium">{RISK_UI.medium.label}</option>
        <option value="high">{RISK_UI.high.label}</option>
      </select>

      {/* City filter */}
      {availableCities.length > 1 && (
        <select
          value={filters.cities[0] ?? ''}
          onChange={(e) => update({ cities: e.target.value ? [e.target.value] : [] })}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          aria-label="Stad"
        >
          <option value="">Alle steden</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}

      {/* Tier filter */}
      <select
        value={filters.tiers[0] ?? ''}
        onChange={(e) => update({ tiers: e.target.value ? [e.target.value as Tier] : [] })}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        aria-label="Match tier"
      >
        <option value="">Alle tiers</option>
        {(Object.keys(TIER_UI) as Tier[]).map((tier) => (
          <option key={tier} value={tier}>
            {TIER_UI[tier].emoji} {TIER_UI[tier].label}
          </option>
        ))}
      </select>

      {/* Budget status */}
      <select
        value={filters.budgetStatuses[0] ?? ''}
        onChange={(e) =>
          update({ budgetStatuses: e.target.value ? [e.target.value as BudgetStatus] : [] })
        }
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        aria-label="Budget status"
      >
        <option value="">Alle budgetten</option>
        {BUDGET_FILTER_OPTIONS.map((bs) => (
          <option key={bs} value={bs}>
            {BUDGET_UI[bs].icon} {BUDGET_UI[bs].label}
          </option>
        ))}
      </select>

      {/* Starred only */}
      <button
        type="button"
        onClick={() => update({ starredOnly: !filters.starredOnly })}
        className={`rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors ${
          filters.starredOnly
            ? 'border-amber-300 bg-amber-50 text-amber-700'
            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
        }`}
        aria-pressed={filters.starredOnly}
        aria-label="Alleen favorieten"
      >
        ⭐ Favorieten
      </button>

      {/* Reset */}
      {count > 0 && (
        <button
          type="button"
          onClick={reset}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ✕ Reset ({count})
        </button>
      )}
    </div>
  );
}
