/**
 * Detail page loading skeleton.
 *
 * Matches the detail layout: hero + 6 section skeletons.
 */
export default function DetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-gray-100" />

      {/* Photo */}
      <div className="mb-6 aspect-[21/9] animate-pulse rounded-xl bg-gray-200" />

      {/* Address */}
      <div className="mb-1 h-7 w-80 animate-pulse rounded bg-gray-200" />
      <div className="mb-4 h-4 w-48 animate-pulse rounded bg-gray-100" />

      {/* Metrics */}
      <div className="mb-4 flex gap-3">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
        <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />
        <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />
      </div>

      {/* Score badge + actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-[4.5rem] w-[4.5rem] animate-pulse rounded-full bg-gray-300" />
          <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-9 w-36 animate-pulse rounded-lg bg-gray-100" />
      </div>

      {/* Investment bar */}
      <div className="mb-8 h-12 animate-pulse rounded-lg bg-gray-100" />

      {/* Section skeletons */}
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="mb-4 h-5 w-48 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
