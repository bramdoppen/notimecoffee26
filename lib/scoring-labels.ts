/**
 * Shared scoring constants — used by both backend (scoring model) and frontend (display).
 * Single source of truth for labels, thresholds, and configuration.
 *
 * Based on data contract: /scoring-spec/data-contract-scoring (sections 7 & 10)
 */

// ---------------------------------------------------------------------------
// Tier Labels (internal enum → Dutch display label)
// ---------------------------------------------------------------------------

export const TIER_LABELS = {
  top_match: 'Topmatch',
  good_match: 'Goede match',
  reasonable_match: 'Redelijke match',
  poor_match: 'Slechte match',
  not_suitable: 'Niet geschikt',
} as const;

export type Tier = keyof typeof TIER_LABELS;

// ---------------------------------------------------------------------------
// Recommendation Labels
// ---------------------------------------------------------------------------

export const RECOMMENDATION_LABELS = {
  visit_immediately: 'Direct bezichtigen',
  worth_visiting: 'Bezichtigen',
  needs_research: 'Nader onderzoek',
  skip: 'Overslaan',
} as const;

export type Recommendation = keyof typeof RECOMMENDATION_LABELS;

// ---------------------------------------------------------------------------
// Condition Labels
// ---------------------------------------------------------------------------

export const CONDITION_LABELS = {
  excellent: 'Uitstekend',
  good: 'Goed',
  fair: 'Redelijk',
  poor: 'Matig',
  bad: 'Slecht',
} as const;

export type Condition = keyof typeof CONDITION_LABELS;

// ---------------------------------------------------------------------------
// Renovation Need Labels
// ---------------------------------------------------------------------------

export const RENOVATION_NEED_LABELS = {
  not_needed: 'Niet nodig',
  optional: 'Optioneel',
  recommended: 'Aanbevolen',
  required: 'Vereist',
} as const;

export type RenovationNeed = keyof typeof RENOVATION_NEED_LABELS;

// ---------------------------------------------------------------------------
// Risk Level Labels
// ---------------------------------------------------------------------------

export const RISK_LEVEL_LABELS = {
  low: 'Laag',
  medium: 'Gemiddeld',
  high: 'Hoog',
} as const;

export type RiskLevel = keyof typeof RISK_LEVEL_LABELS;

// ---------------------------------------------------------------------------
// Scoring Thresholds (defaults — can be overridden in UserPreferences)
// ---------------------------------------------------------------------------

export const SCORE_THRESHOLDS = {
  excellent: 85,
  strong: 70,
  moderate: 50,
  weak: 25,
} as const;

export const HARD_PENALTY_CAPS = {
  singleViolation: 55,
  multipleViolations: 30,
} as const;

export const VVE_THRESHOLDS = {
  highContribution: 200, // €/maand → penalty
  veryHighContribution: 350, // €/maand → heavy penalty
} as const;

// ---------------------------------------------------------------------------
// Renovation Categories
// ---------------------------------------------------------------------------

export const RENOVATION_CATEGORIES = [
  'keuken',
  'badkamer',
  'vloeren',
  'schilderwerk',
  'dak',
  'isolatie',
  'ramen_kozijnen',
  'elektra',
  'leidingwerk',
  'cv_ketel',
  'tuin',
  'kozijnen',
  'overig',
] as const;

export type RenovationCategory = (typeof RENOVATION_CATEGORIES)[number];

export const RENOVATION_CATEGORY_LABELS: Record<RenovationCategory, string> = {
  keuken: 'Keuken',
  badkamer: 'Badkamer',
  vloeren: 'Vloeren',
  schilderwerk: 'Schilderwerk',
  dak: 'Dak',
  isolatie: 'Isolatie',
  ramen_kozijnen: 'Ramen & kozijnen',
  elektra: 'Elektra',
  leidingwerk: 'Leidingwerk',
  cv_ketel: 'CV-ketel',
  tuin: 'Tuin',
  kozijnen: 'Kozijnen',
  overig: 'Overig',
};

// ---------------------------------------------------------------------------
// Condition Classification (based on renovation categories needed)
// ---------------------------------------------------------------------------

export const CONDITION_CLASSIFICATION = {
  /** 0 required categories */
  turnkey: 'excellent',
  /** 1 required category */
  minorWork: 'good',
  /** 2-3 required categories */
  dated: 'fair',
  /** 4+ required categories */
  fullRenovation: 'poor',
} as const;

// ---------------------------------------------------------------------------
// Property Type Labels (Dutch)
// ---------------------------------------------------------------------------

export const PROPERTY_TYPE_LABELS = {
  appartement: 'Appartement',
  tussenwoning: 'Tussenwoning',
  hoekwoning: 'Hoekwoning',
  twee_onder_een_kap: 'Twee-onder-een-kap',
  vrijstaand: 'Vrijstaand',
  penthouse: 'Penthouse',
  grachtenpand: 'Grachtenpand',
  bovenwoning: 'Bovenwoning',
  benedenwoning: 'Benedenwoning',
  maisonnette: 'Maisonnette',
  villa: 'Villa',
  woonboerderij: 'Woonboerderij',
  overig: 'Overig',
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPE_LABELS;

// ---------------------------------------------------------------------------
// Energy Label Scoring (higher = better)
// ---------------------------------------------------------------------------

export const ENERGY_LABEL_SCORES: Record<string, number> = {
  'A++++': 100,
  'A+++': 95,
  'A++': 90,
  'A+': 85,
  A: 80,
  B: 65,
  C: 50,
  D: 35,
  E: 20,
  F: 10,
  G: 0,
};
