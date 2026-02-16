import Link from 'next/link';
import { ScoreBadge } from '@/components/scoring/ScoreBadge';
import { Badge } from '@/components/ui/Badge';
import {
  TIER_UI,
  RISK_UI,
  BUDGET_UI,
  CONDITION_UI,
  getEnergyLabelColor,
} from '@/lib/tier-config';
import {
  formatPrice,
  formatPriceRange,
  formatArea,
  formatDaysOnMarket,
  formatPercentage,
} from '@/lib/format';
import type { PropertySummary } from '@/lib/types';

interface PropertyCardProps {
  property: PropertySummary;
}

/**
 * Property card for the dashboard grid.
 *
 * Structure (from wireframe):
 * ┌─────────────────────────────┐
 * │ Photo (16:9)        ♡ star  │
 * │                             │
 * ├── ScoreBadge (overlapping) ─┤
 * │ ⭐ Top Match                │
 * │ Address                     │
 * │ City · Neighborhood         │
 * │ €350.000  85m²  3🛏  A     │
 * ├─────────────────────────────┤
 * │ RISICO'S  🟡 Erfpacht      │
 * │ 🔧 €22k – €68k renovatie   │
 * ├─────────────────────────────┤
 * │ TOTALE INVESTERING          │
 * │ €386k – €423k               │
 * │ ⚠️ Stretch budget (94%)    │
 * │                             │
 * │ Bekijk volledige analyse →  │
 * └─────────────────────────────┘
 *
 * Server component — Link handles navigation.
 * Star/compare interactions are handled by parent via client wrapper.
 */
export function PropertyCard({ property: p }: PropertyCardProps) {
  const tier = TIER_UI[p.matchTier];
  const budget = BUDGET_UI[p.budgetStatus];
  const energyColor = p.energyLabel ? getEnergyLabelColor(p.energyLabel) : null;
  const hasDealbreakers = p.dealbreakers.length > 0;
  const condition = p.renovationCondition ? CONDITION_UI[p.renovationCondition] : null;

  return (
    <Link
      href={`/woningen/${p.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Photo area */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.address}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-300">
            <span className="text-4xl">🏠</span>
            <span className="text-xs">Geen foto beschikbaar</span>
          </div>
        )}

        {/* Star indicator (top right) */}
        {p.starred && (
          <div className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-base shadow-sm">
            ⭐
          </div>
        )}

        {/* Days on market (top left, if notable) */}
        {p.daysOnMarket != null && p.daysOnMarket > 60 && (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-gray-600 shadow-sm">
            📅 {formatDaysOnMarket(p.daysOnMarket)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-4">
        {/* Score badge — overlaps photo, vertical layout (label below) */}
        <div className="-mt-10 mb-3">
          {hasDealbreakers ? (
            <DealbreakBadge />
          ) : (
            <ScoreBadge
              score={p.matchScore}
              tier={p.matchTier}
              size="md"
              showLabel
              layout="vertical"
            />
          )}
        </div>

        {/* Address */}
        <div className="mb-0.5 text-[15px] font-semibold text-gray-900 leading-tight">
          {p.address}
        </div>
        <div className="mb-3 text-xs text-gray-500">
          {p.city}
          {p.neighborhood && ` · ${p.neighborhood}`}
        </div>

        {/* Key metrics row */}
        <div className="mb-3 flex items-center gap-3">
          <span className="text-base font-semibold text-gray-900">
            {formatPrice(p.askingPrice)}
          </span>
          <span className="text-xs text-gray-500">{formatArea(p.livingArea)}</span>
          <span className="text-xs text-gray-500">{p.rooms}🛏</span>
          <span className="text-xs text-gray-500">{p.bathrooms}🚿</span>
          {energyColor && p.energyLabel && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${energyColor.text} ${energyColor.bg}`}
            >
              {p.energyLabel}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mb-3 border-t border-gray-100" />

        {/* Risk pills (max 2) */}
        <div
          className="mb-2.5 flex flex-wrap gap-1.5"
          role="status"
          aria-label={
            p.topRiskFlags.length > 0
              ? `Risico's: ${p.topRiskFlags.map((r) => `${r.severity} - ${r.label}`).join(', ')}`
              : 'Laag risico'
          }
        >
          {p.topRiskFlags.length > 0 ? (
            p.topRiskFlags.slice(0, 2).map((risk) => {
              const riskConfig = RISK_UI[risk.severity];
              return (
                <Badge
                  key={risk.label}
                  text={riskConfig.text}
                  bg={riskConfig.bg}
                  pill
                  size="sm"
                >
                  {risk.label}
                </Badge>
              );
            })
          ) : (
            <Badge text="text-emerald-700" bg="bg-emerald-50" pill size="sm">
              Laag risico
            </Badge>
          )}
        </div>

        {/* Renovation estimate */}
        {p.renovationEstimateHigh > 0 && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
            <span>
              🔧 {formatPriceRange(p.renovationEstimateLow, p.renovationEstimateHigh)}{' '}
              renovatie
            </span>
            {condition && (
              <Badge text={condition.text} bg={condition.bg} size="sm">
                {condition.label}
              </Badge>
            )}
          </div>
        )}

        {/* Negotiation signals hint */}
        {p.negotiationSignalCount > 0 && (
          <div className="mb-2 text-xs text-emerald-600 font-medium">
            💪 {p.negotiationSignalCount} onderhandelingssignaal{p.negotiationSignalCount > 1 ? 'en' : ''}
          </div>
        )}

        {/* Total investment range + budget status */}
        <div className="mt-2.5 border-t border-gray-100 pt-2.5">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Totale investering
          </div>
          <div className="mb-1.5 text-sm font-semibold text-gray-900">
            {formatPriceRange(p.totalInvestmentLow, p.totalInvestmentHigh)}
          </div>
          <Badge text={budget.text} bg={budget.bg} size="sm">
            {budget.icon} {budget.label} ({formatPercentage(p.budgetUtilization)})
          </Badge>
        </div>

        {/* CTA */}
        <div className="mt-3 text-center text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
          Bekijk volledige analyse →
        </div>
      </div>
    </Link>
  );
}

/** Special badge for properties with hard criteria violations */
function DealbreakBadge() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-red-400 bg-gray-500 text-sm text-white shadow-md">
        ⛔
      </div>
      <div className="text-sm font-semibold text-red-600">Dealbreaker</div>
    </div>
  );
}
