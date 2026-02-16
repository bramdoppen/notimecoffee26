/**
 * Formatting utilities for Dutch locale display.
 *
 * All functions are pure, side-effect free, and safe for server components.
 * Uses Intl.NumberFormat for locale-correct formatting.
 */

// ---------------------------------------------------------------------------
// Price formatting
// ---------------------------------------------------------------------------

const priceFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const priceCompactFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 0,
});

/** Format price: 425000 → "€ 425.000" */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

/** Format price compact: 425000 → "€ 425K" */
export function formatPriceCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return priceCompactFormatter.format(amount);
  }
  if (amount >= 1000) {
    return `€${Math.round(amount / 1000)}k`;
  }
  return formatPrice(amount);
}

/** Format price range: (22500, 68000) → "€22k – €68k" */
export function formatPriceRange(low: number, high: number): string {
  if (low === 0 && high === 0) return '€0';
  if (low === high) return formatPriceCompact(low);
  return `${formatPriceCompact(low)} – ${formatPriceCompact(high)}`;
}

// ---------------------------------------------------------------------------
// Area formatting
// ---------------------------------------------------------------------------

/** Format area: 85 → "85 m²" */
export function formatArea(m2: number): string {
  return `${m2} m²`;
}

/** Format price per m²: 4573 → "€ 4.573/m²" */
export function formatPricePerM2(pricePerM2: number): string {
  return `${formatPrice(pricePerM2)}/m²`;
}

// ---------------------------------------------------------------------------
// Room formatting
// ---------------------------------------------------------------------------

/** Format rooms: (4, 2) → "4 kamers · 2 slaapkamers" */
export function formatRooms(rooms: number, bedrooms: number): string {
  return `${rooms} kamers · ${bedrooms} slaapkamers`;
}

/** Format rooms compact: (4, 2) → "4k / 2sl" */
export function formatRoomsCompact(rooms: number, bedrooms: number): string {
  return `${rooms}k / ${bedrooms}sl`;
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

const dateFormatter = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const dateShortFormatter = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'short',
});

/** Format date: "2026-02-14" → "14 feb. 2026" */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** Format date short: "2026-02-14" → "14 feb." */
export function formatDateShort(iso: string): string {
  return dateShortFormatter.format(new Date(iso));
}

/** Format days on market: 95 → "95 dagen" */
export function formatDaysOnMarket(days: number): string {
  if (days === 0) return 'Vandaag';
  if (days === 1) return '1 dag';
  return `${days} dagen`;
}

// ---------------------------------------------------------------------------
// Percentage formatting
// ---------------------------------------------------------------------------

/** Format percentage: 94.3 → "94%" */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/** Format budget utilization: (424525, 450000) → "94%" */
export function formatBudgetUtilization(
  totalInvestment: number,
  maxBudget: number,
): string {
  if (maxBudget === 0) return '—';
  return formatPercentage((totalInvestment / maxBudget) * 100);
}

// ---------------------------------------------------------------------------
// Score formatting
// ---------------------------------------------------------------------------

/** Format score: 72.4 → "72" (always integer for display) */
export function formatScore(score: number): string {
  return String(Math.round(score));
}

// ---------------------------------------------------------------------------
// Criteria count formatting
// ---------------------------------------------------------------------------

/** Format criteria pass count: (3, 4) → "3 van 4 voldaan" */
export function formatCriteriaCount(passed: number, total: number): string {
  if (passed === total) return `Alle ${total} voldaan`;
  return `${passed} van ${total} voldaan`;
}

/** Format hard criteria failures: (1, 4) → "1 niet voldaan" */
export function formatCriteriaFailures(
  passed: number,
  total: number,
): string {
  const failed = total - passed;
  if (failed === 0) return 'Alles voldaan ✅';
  return `${failed} niet voldaan ❌`;
}
