'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS, type SortOption } from '@/lib/filters';

/**
 * Sort dropdown for the dashboard.
 *
 * Updates URL searchParams on change — no client state needed.
 * Server re-renders with new sort order.
 */
export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get('sort') as SortOption) ?? 'score_desc';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value === 'score_desc') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : '/');
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      aria-label="Sorteer woningen"
    >
      {Object.entries(SORT_OPTIONS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
