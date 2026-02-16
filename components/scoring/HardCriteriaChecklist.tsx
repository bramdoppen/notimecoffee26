import { formatCriteriaCount } from '@/lib/format';
import type { HardCriterionResult } from '@/lib/types';

interface HardCriteriaChecklistProps {
  results: HardCriterionResult[];
  allPass: boolean;
}

/**
 * Section 1: Hard criteria pass/fail checklist.
 *
 * From wireframe:
 * ┌──────────────────────────────────────────┐
 * │ ✅ Minimaal 3 kamers    Vereist: ≥3  ✓4  │
 * │ ✅ Binnen budget        Vereist: ≤€450k  │
 * │ ❌ Minimaal 80m²        Vereist: ≥80  72 │
 * └──────────────────────────────────────────┘
 *
 * Server component.
 */
export function HardCriteriaChecklist({
  results,
  allPass,
}: HardCriteriaChecklistProps) {
  const passCount = results.filter((r) => r.pass).length;

  return (
    <div>
      {/* Summary */}
      <div className="mb-4 text-sm">
        {allPass ? (
          <span className="font-medium text-emerald-600">
            ✅ {formatCriteriaCount(passCount, results.length)}
          </span>
        ) : (
          <span className="font-medium text-red-600">
            ❌ {results.length - passCount} van {results.length} niet voldaan
          </span>
        )}
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {results.map((r) => (
          <div
            key={r.criterion}
            className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm ${
              r.pass ? 'bg-emerald-50' : 'bg-red-50'
            }`}
          >
            <span className="mt-0.5 flex-shrink-0">
              {r.pass ? '✅' : '❌'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{r.criterion}</div>
              <div className="mt-0.5 text-xs text-gray-500">
                Vereist: {r.requiredValue} · Werkelijk: {r.actualValue}
              </div>
              {!r.pass && r.reasoning && (
                <div className="mt-1 text-xs text-red-600">{r.reasoning}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
