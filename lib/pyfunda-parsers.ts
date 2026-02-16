/**
 * Parsing utilities for pyfunda data.
 *
 * pyfunda returns characteristics as key-value string pairs that need
 * to be parsed into typed values. This module handles all the edge cases
 * documented in the spike report.
 *
 * Based on: /project-plan/phase-1/funda-spike/spike-report-funda
 */

/**
 * Parse Dutch currency string to number.
 * Handles: "€ 123,50", "€ 9.706", "€ 1.482 per jaar", "€ 123,50 per maand"
 */
export function parseCurrency(value: string): number | null {
  if (!value) return null;
  // Remove € symbol, whitespace, and period thousand separators
  const cleaned = value
    .replace(/€/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    // Remove trailing text like "per maand", "per jaar"
    .replace(/per.*/i, '')
    .trim();

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Parse VvE monthly contribution.
 * Normalizes yearly amounts to monthly.
 * Handles: "€ 123,50 per maand", "€ 1.482 per jaar"
 */
export function parseVveContribution(value: string): number | null {
  if (!value) return null;

  const amount = parseCurrency(value);
  if (amount === null) return null;

  const isYearly = /per\s*jaar/i.test(value);
  return isYearly ? Math.round((amount / 12) * 100) / 100 : amount;
}

/**
 * Parse area string to number.
 * Handles: "181 m²", "85m²", "181"
 */
export function parseArea(value: string | number): number | null {
  if (typeof value === 'number') return value;
  if (!value) return null;

  const match = value.match(/([\d.,]+)/);
  if (!match) return null;

  const cleaned = match[1].replace('.', '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Parse comma-separated string to array.
 * Handles: "Dubbel glas, Dakisolatie, Muurisolatie"
 */
export function parseCommaSeparated(value: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse energy label, filtering out noise.
 * pyfunda sometimes returns "Wat betekent dit?" instead of the actual label.
 * Use the top-level `energy_label` field as fallback.
 */
export function parseEnergyLabel(
  characteristicsValue: string | null,
  topLevelValue: string | null
): string | null {
  // Prefer top-level field — it's more reliable
  if (topLevelValue && !topLevelValue.includes('betekent')) {
    return topLevelValue.trim();
  }
  if (characteristicsValue && !characteristicsValue.includes('betekent')) {
    return characteristicsValue.trim();
  }
  return null;
}

/**
 * Parse VvE boolean fields from characteristics.
 * Handles: "Ja", "Nee", "Aanwezig", "Niet aanwezig", etc.
 */
export function parseVveBoolean(value: string): boolean | null {
  if (!value) return null;
  const lower = value.toLowerCase().trim();
  if (['ja', 'aanwezig', 'yes', 'true'].includes(lower)) return true;
  if (['nee', 'niet aanwezig', 'no', 'false'].includes(lower)) return false;
  return null;
}

/**
 * Extract VvE data from pyfunda characteristics dict.
 * Returns parsed VvE fields for PropertyAnalysis.vveData.
 */
export function extractVveData(characteristics: Record<string, string>): {
  monthlyContribution: number | null;
  hasReserveFund: boolean | null;
  hasMaintenancePlan: boolean | null;
  kvkRegistered: boolean | null;
  hasBuildingInsurance: boolean | null;
} {
  return {
    monthlyContribution: parseVveContribution(
      characteristics['Bijdrage VvE'] || ''
    ),
    hasReserveFund: parseVveBoolean(
      characteristics['Reservefonds aanwezig'] || ''
    ),
    hasMaintenancePlan: parseVveBoolean(
      characteristics['Onderhoudsplan'] || ''
    ),
    kvkRegistered: parseVveBoolean(
      characteristics['Inschrijving KvK'] || ''
    ),
    hasBuildingInsurance: parseVveBoolean(
      characteristics['Opstalverzekering'] || ''
    ),
  };
}

/**
 * Map pyfunda listing data to Property schema fields.
 * This is the main mapping function used during import.
 *
 * @param listing - Raw pyfunda listing object
 * @returns Partial Property document fields
 */
export function mapPyfundaToProperty(listing: Record<string, any>): Record<string, any> {
  const characteristics: Record<string, string> = listing.characteristics || {};

  return {
    address: listing.address || null,
    zipCode: listing.zip_code || null,
    city: listing.city || null,
    propertyType: mapPropertyType(listing.property_type),
    askingPrice: listing.asking_price || null,
    livingArea: listing.living_area || parseArea(characteristics['Woonoppervlakte'] || ''),
    plotArea: listing.plot_area || parseArea(characteristics['Perceeloppervlakte'] || ''),
    rooms: listing.num_rooms || null,
    bedrooms: listing.num_bedrooms || null,
    bathrooms: listing.num_bathrooms || null,
    buildYear: listing.build_year || null,
    energyLabel: parseEnergyLabel(
      characteristics['Energielabel'] || null,
      listing.energy_label || null
    ),
    features: extractFeatures(listing),
    description: listing.description || null,
    pricePerSqm:
      listing.asking_price && listing.living_area
        ? Math.round(listing.asking_price / listing.living_area)
        : null,
    photoUrls: Array.isArray(listing.photo_urls) ? listing.photo_urls : [],
    floorPlanUrls: Array.isArray(listing.floorplan_urls) ? listing.floorplan_urls : [],
    fundaUrl: listing.url || null,
    fundaId: listing.funda_id || String(listing.id) || null,
    sourceType: 'pyfunda' as const,
    listingStatus: 'beschikbaar' as const,
    listingDate: listing.listing_date || null,
    rawData: JSON.stringify(listing),
    dataSources: [
      {
        _type: 'object' as const,
        source: 'pyfunda',
        fetchedAt: new Date().toISOString(),
        fieldsProvided: Object.keys(listing).filter(
          (k) => listing[k] != null && k !== 'characteristics'
        ),
      },
    ],
  };
}

/**
 * Map pyfunda property_type string to our enum.
 */
function mapPropertyType(type: string | null): string {
  if (!type) return 'overig';
  const lower = type.toLowerCase();

  const mapping: Record<string, string> = {
    appartement: 'appartement',
    apartment: 'appartement',
    tussenwoning: 'tussenwoning',
    hoekwoning: 'hoekwoning',
    'twee-onder-een-kap': 'twee_onder_een_kap',
    '2-onder-1-kap': 'twee_onder_een_kap',
    vrijstaand: 'vrijstaand',
    'vrijstaande woning': 'vrijstaand',
    penthouse: 'penthouse',
    grachtenpand: 'grachtenpand',
    bovenwoning: 'bovenwoning',
    benedenwoning: 'benedenwoning',
    maisonnette: 'maisonnette',
    villa: 'villa',
    woonboerderij: 'woonboerderij',
  };

  for (const [key, value] of Object.entries(mapping)) {
    if (lower.includes(key)) return value;
  }
  return 'overig';
}

/**
 * Extract feature flags from pyfunda listing.
 * pyfunda provides boolean fields for common features.
 */
function extractFeatures(listing: Record<string, any>): string[] {
  const features: string[] = [];
  // pyfunda boolean fields — False means not present, not "unknown"
  if (listing.has_garden === true) features.push('tuin');
  if (listing.has_balcony === true) features.push('balkon');
  if (listing.has_roof_terrace === true) features.push('dakterras');
  if (listing.has_garage === true) features.push('garage');
  if (listing.has_parking === true) features.push('parkeerplaats');
  if (listing.has_storage === true) features.push('berging');
  if (listing.has_elevator === true) features.push('lift');
  if (listing.has_attic === true) features.push('zolder');
  if (listing.has_basement === true) features.push('kelder');
  if (listing.has_solar_panels === true) features.push('zonnepanelen');
  return features;
}
