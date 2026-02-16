import { Badge } from '@/components/ui/Badge';
import { RISK_UI } from '@/lib/tier-config';
import type { RiskResult } from '@/lib/types';
import type { RiskLevel } from '@/lib/scoring-labels';

interface RiskOverviewProps {
  overallRisk: RiskLevel;
  risks: RiskResult[];
  dealbreakers: string[];
}

/**
 * Section 5: Risk assessment with colored cards.
 *
 * From wireframe:
 * ┌──────────────────────────────────────────┐
 * │ Algeheel risico: 🟡 Medium               │
 * │                                          │
 * │ ┌─ 🟡 Erfpacht ─────────────────────────┐│
 * │ │ Canon €200/maand, herziening 2028.     ││
 * │ │ Mitigatie: Vraag erfpachtvoorwaarden   ││
 * │ └────────────────────────────────────────┘│
 * │                                          │
 * │ ┌─ 🟢 VvE ──────────────────────────────┐│
 * │ │ Gezond — reserve €45.000               ││
 * │ └────────────────────────────────────────┘│
 * │                                          │
 * │ ┌─ 🟢 Constructie ──────────────────────┐│
 * │ │ Geen signalen                          ││
 * │ └────────────────────────────────────────┘│
 * └──────────────────────────────────────────┘
 *
 * Server component.
 */
export function RiskOverview({
  overallRisk,
  risks,
  dealbreakers,
}: RiskOverviewProps) {
  const overallConfig = RISK_UI[overallRisk];

  // Sort: high first, then medium, then low
  const sorted = [...risks].sort(
    (a, b) => RISK_ORDER[b.level] - RISK_ORDER[a.level],
  );

  return (
    <div>
      {/* Overall risk */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-500">Algeheel risico:</span>
        <Badge text={overallConfig.text} bg={overallConfig.bg} pill>
          {overallConfig.label}
        </Badge>
      </div>

      {/* Dealbreakers (if any) */}
      {dealbreakers.length > 0 && (
        <div className="mb-4 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3">
          <div className="mb-1 text-sm font-semibold text-red-700">
            ⛔ Dealbreakers
          </div>
          <ul className="space-y-1">
            {dealbreakers.map((d) => (
              <li key={d} className="text-sm text-red-600">
                • {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk cards */}
      <div className="space-y-3">
        {sorted.map((risk) => {
          const config = RISK_UI[risk.level];
          return (
            <div
              key={risk.category}
              className={`rounded-lg border px-4 py-3 ${getRiskBorderColor(risk.level)}`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${config.dot}`}
                  aria-hidden
                />
                <span className="text-sm font-semibold text-gray-900">
                  {risk.category}
                </span>
                <Badge text={config.text} bg={config.bg} size="sm">
                  {config.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{risk.description}</p>
              {risk.mitigation && (
                <p className="mt-1.5 text-xs text-gray-500">
                  💡 <span className="font-medium">Mitigatie:</span>{' '}
                  {risk.mitigation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {risks.length === 0 && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✅ Geen significante risico&apos;s geïdentificeerd
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RISK_ORDER: Record<RiskLevel, number> = {
  high: 2,
  medium: 1,
  low: 0,
};

function getRiskBorderColor(level: RiskLevel): string {
  switch (level) {
    case 'high':
      return 'border-red-200 bg-red-50/50';
    case 'medium':
      return 'border-amber-200 bg-amber-50/50';
    case 'low':
      return 'border-gray-200 bg-white';
  }
}
