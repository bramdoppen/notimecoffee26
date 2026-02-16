import type { PropertySummary } from '@/lib/types';

interface DashboardStatsProps {
  total: number;
  filtered: number;
  topMatches: number;
}

/**
 * Quick stats bar: "34 woningen · 8 top matches"
 * Shows filtered count when filters are active.
 *
 * Server component.
 */
export function DashboardStats({ total, filtered, topMatches }: DashboardStatsProps) {
  const isFiltered = filtered < total;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span className="font-medium text-gray-900">
        {isFiltered ? `${filtered} van ${total}` : total} woningen
      </span>
      <span>·</span>
      <span className="text-emerald-600 font-medium">
        {topMatches} top match{topMatches !== 1 ? 'es' : ''}
      </span>
    </div>
  );
}
