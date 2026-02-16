/**
 * Dashboard loading skeleton.
 *
 * Shown during server-side data fetching (route transitions, filter changes).
 * Matches the dashboard layout: stats bar + filter bar + 6 skeleton cards.
 *
 * Uses CSS animations only — no client JS needed.
 */
export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="mb-1 h-7 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-gray-100" />
      </div>

      {/* Stats + Sort skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-48 animate-pulse rounded bg-gray-100" />
        <div className="h-9 w-44 animate-pulse rounded-lg bg-gray-100" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 animate-pulse rounded-lg bg-gray-100"
            style={{ width: `${80 + i * 16}px` }}
          />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Photo placeholder */}
      <div className="aspect-[16/9] animate-pulse bg-gray-200" />

      <div className="px-5 pb-5 pt-4">
        {/* Score badge */}
        <div className="-mt-10 mb-3">
          <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300" />
        </div>

        {/* Address */}
        <div className="mb-1 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-3 w-1/2 animate-pulse rounded bg-gray-100" />

        {/* Metrics */}
        <div className="mb-3 flex gap-3">
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-12 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-8 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mb-3 border-t border-gray-100" />

        {/* Risk pills */}
        <div className="mb-2.5 flex gap-1.5">
          <div className="h-5 w-24 animate-pulse rounded-full bg-gray-100" />
        </div>

        {/* Investment */}
        <div className="mt-2.5 border-t border-gray-100 pt-2.5">
          <div className="mb-1 h-3 w-28 animate-pulse rounded bg-gray-100" />
          <div className="mb-1.5 h-5 w-36 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-32 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
