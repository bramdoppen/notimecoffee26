'use client';

import { useState } from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getBarColor } from '@/lib/tier-config';
import type { SoftCriterionResult } from '@/lib/types';

interface SoftCriteriaChartProps {
  results: SoftCriterionResult[];
  overallScore: number;
}

/**
 * Section 2: Soft criteria horizontal bar chart with weights.
 *
 * From wireframe:
 * ┌──────────────────────────────────────────┐
 * │ Locatie        ●●●●● ████████████  92/100│
 * │ Grootte        ●●●   ████████     78/100 │
 * │ Tuin           ●●    ██████       55/100  │
 * │ Lichtinval     ●     ████████████  90/100│
 * └──────────────────────────────────────────┘
 *
 * Weight dots: ● = weight level (1-5)
 * Bar: colored by score (green/amber/red)
 * Click to expand reasoning text.
 *
 * Client component — expandable reasoning.
 */
export function SoftCriteriaChart({
  results,
  overallScore,
}: SoftCriteriaChartProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Sort by weighted score descending (most impactful first)
  const sorted = [...results].sort((a, b) => b.weightedScore - a.weightedScore);

  return (
    <div>
      {/* Overall score */}
      <div className="mb-4 text-sm">
        <span className="font-medium text-gray-900">
          Totaal: {overallScore}/100
        </span>
      </div>

      {/* Criteria bars */}
      <div className="space-y-3">
        {sorted.map((r) => (
          <div key={r.criterion}>
            <button
              type="button"
              onClick={() =>
                setExpanded(expanded === r.criterion ? null : r.criterion)
              }
              className="w-full text-left"
              aria-expanded={expanded === r.criterion}
            >
              <div className="flex items-center gap-3">
                {/* Criterion name */}
                <span className="w-28 flex-shrink-0 text-sm font-medium text-gray-700 truncate">
                  {r.criterion}
                </span>

                {/* Weight dots */}
                <span
                  className="flex-shrink-0 text-xs text-gray-400"
                  title={`Gewicht: ${r.weight}`}
                  aria-label={`Gewicht: ${r.weight}`}
                >
                  {'●'.repeat(Math.min(r.weight, 5))}
                  {'○'.repeat(Math.max(0, 5 - r.weight))}
                </span>

                {/* Bar */}
                <div className="flex-1">
                  <ProgressBar
                    value={r.score}
                    color={getBarColor(r.score)}
                    size="md"
                    ariaLabel={`${r.criterion} score`}
                  />
                </div>

                {/* Score */}
                <span className="w-12 flex-shrink-0 text-right text-sm font-semibold text-gray-900">
                  {r.score}
                </span>
              </div>
            </button>

            {/* Expanded reasoning */}
            {expanded === r.criterion && r.reasoning && (
              <div className="mt-1.5 ml-[7.75rem] rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                {r.reasoning}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
