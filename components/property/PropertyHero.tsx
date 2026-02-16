import Link from 'next/link';
import { ScoreBadge } from '@/components/scoring/ScoreBadge';
import { Badge } from '@/components/ui/Badge';
import { TIER_UI, BUDGET_UI, getEnergyLabelColor } from '@/lib/tier-config';
import { formatPrice, formatArea, formatPriceRange, formatPercentage } from '@/lib/format';
import type { Tier, BudgetStatus, Recommendation } from '@/lib/scoring-labels';

interface PropertyHeroProps {
  address: string;
  city: string;
  zipCode: string;
  neighborhood: string | null;
  askingPrice: number;
  livingArea: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  energyLabel: string | null;
  imageUrl: string | null;
  fundaUrl: string | null;
  starred: boolean;
  matchScore: number;
  matchTier: Tier;
  recommendation: Recommendation;
  totalInvestmentLow: number;
  totalInvestmentHigh: number;
  budgetStatus: BudgetStatus;
  budgetUtilization: number;
}

/**
 * Detail page hero — photo + key info + score badge.
 *
 * Layout (from wireframe):
 * ┌─────────────────────────────────────────────┐
 * │ ← Terug naar overzicht                       │
 * │                                              │
 * │ [Grote foto]                                 │
 * │                                              │
 * │ Keizersgracht 123, Amsterdam                 │
 * │ €350.000 · 85m² · 3 kamers · Energielabel A │
 * │ ┌────┐                                      │
 * │ │ 92 │ ⭐ Top Match    [♡ Favoriet] [🔗 Funda] │
 * │ └────┘                                      │
 * │ Totale investering: €386k – €401k · ✅ Binnen budget │
 * └─────────────────────────────────────────────┘
 *
 * Server component.
 */
export function PropertyHero(p: PropertyHeroProps) {
  const tier = TIER_UI[p.matchTier];
  const budget = BUDGET_UI[p.budgetStatus];
  const energyColor = p.energyLabel ? getEnergyLabelColor(p.energyLabel) : null;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Terug naar overzicht
      </Link>

      {/* Photo */}
      {p.imageUrl ? (
        <div className="mb-6 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 md:aspect-[21/9]">
          <img
            src={p.imageUrl}
            alt={p.address}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="mb-6 flex aspect-[16/9] flex-col items-center justify-center gap-1 rounded-xl bg-gray-100 md:aspect-[21/9]">
          <span className="text-4xl text-gray-300">🏠</span>
          <span className="text-xs text-gray-300">Geen foto beschikbaar</span>
        </div>
      )}

      {/* Address + location */}
      <div className="mb-1 flex items-center gap-2">
        {p.starred && <span className="text-xl">⭐</span>}
        <h1 className="text-2xl font-bold text-gray-900">
          {p.address}
        </h1>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        {p.zipCode} {p.city}
        {p.neighborhood && ` · ${p.neighborhood}`}
      </p>

      {/* Key metrics */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(p.askingPrice)}
        </span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600">{formatArea(p.livingArea)}</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600">{p.rooms} kamers</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600">{p.bedrooms} slaapkamers</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600">{p.bathrooms} badkamers</span>
        {energyColor && p.energyLabel && (
          <>
            <span className="text-gray-400">·</span>
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-semibold ${energyColor.text} ${energyColor.bg}`}
            >
              Label {p.energyLabel}
            </span>
          </>
        )}
      </div>

      {/* Score badge + actions row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <ScoreBadge
          score={p.matchScore}
          tier={p.matchTier}
          size="lg"
          showLabel
          layout="horizontal"
        />

        <div className="flex items-center gap-2">
          {p.fundaUrl && (
            <a
              href={p.fundaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Bekijk op Funda →
            </a>
          )}
        </div>
      </div>

      {/* Total investment + budget */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
        <span className="text-sm text-gray-500">Totale investering:</span>
        <span className="text-sm font-semibold text-gray-900">
          {formatPriceRange(p.totalInvestmentLow, p.totalInvestmentHigh)}
        </span>
        <Badge text={budget.text} bg={budget.bg} size="sm">
          {budget.icon} {budget.label} ({formatPercentage(p.budgetUtilization)})
        </Badge>
      </div>
    </div>
  );
}
