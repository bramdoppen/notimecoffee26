/**
 * All GROQ queries for aankoopmakelaar.
 *
 * Conventions:
 * - SCREAMING_SNAKE_CASE names
 * - defineQuery() wrapper for TypeGen
 * - Explicit projections (no ... spread)
 * - Parameters for variables (never string interpolation)
 * - One query per export
 */

import { defineQuery } from 'next-sanity';

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

/** All available properties — listing view */
export const PROPERTIES_QUERY = defineQuery(`*[
  _type == "property"
  && listingStatus == "beschikbaar"
] | order(listingDate desc) {
  _id,
  address,
  slug,
  zipCode,
  city,
  propertyType,
  askingPrice,
  livingArea,
  plotArea,
  rooms,
  bedrooms,
  bathrooms,
  buildYear,
  energyLabel,
  features,
  listingStatus,
  listingDate,
  daysOnMarket,
  starred,
  mainImage {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  },
  neighborhood->{
    _id,
    name,
    city
  }
}`);

/** All properties (any status) — for admin/overview */
export const ALL_PROPERTIES_QUERY = defineQuery(`*[
  _type == "property"
] | order(listingDate desc) {
  _id,
  address,
  slug,
  zipCode,
  city,
  propertyType,
  askingPrice,
  livingArea,
  rooms,
  bedrooms,
  listingStatus,
  starred,
  listingDate,
  mainImage {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  }
}`);

/** Starred/favorite properties */
export const STARRED_PROPERTIES_QUERY = defineQuery(`*[
  _type == "property"
  && starred == true
] | order(listingDate desc) {
  _id,
  address,
  slug,
  zipCode,
  city,
  propertyType,
  askingPrice,
  livingArea,
  rooms,
  bedrooms,
  listingStatus,
  starred,
  listingDate,
  mainImage {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  },
  neighborhood->{
    _id,
    name,
    city
  }
}`);

/** Single property by slug — full detail view */
export const PROPERTY_BY_SLUG_QUERY = defineQuery(`*[
  _type == "property"
  && slug.current == $slug
][0] {
  _id,
  address,
  slug,
  zipCode,
  city,
  propertyType,
  askingPrice,
  livingArea,
  plotArea,
  rooms,
  bedrooms,
  bathrooms,
  buildYear,
  energyLabel,
  features,
  description,
  coordinates,
  pricePerSqm,
  serviceCharges,
  ownershipType,
  erfpachtDetails,
  mainImage {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  },
  photos[] {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    category
  },
  floorPlanUrl,
  fundaUrl,
  fundaId,
  sourceType,
  scrapedAt,
  listingStatus,
  listingDate,
  daysOnMarket,
  starred,
  notes,
  neighborhood->{
    _id,
    name,
    slug,
    city,
    description,
    averagePricePerSqm,
    amenities,
    safetyRating
  }
}`);

/** Property by fundaId — used for deduplication during import */
export const PROPERTY_BY_FUNDA_ID_QUERY = defineQuery(`*[
  _type == "property"
  && fundaId == $fundaId
][0] {
  _id,
  fundaId,
  scrapedAt,
  listingStatus
}`);

// ---------------------------------------------------------------------------
// Property Analyses
// ---------------------------------------------------------------------------

/** Analysis for a specific property (latest) */
export const ANALYSIS_FOR_PROPERTY_QUERY = defineQuery(`*[
  _type == "propertyAnalysis"
  && property._ref == $propertyId
] | order(analyzedAt desc) [0] {
  _id,
  matchScore,
  tier,
  recommendation,
  summary,
  hardCriteriaPass,
  hardCriteriaResults[] {
    criterion,
    pass,
    actualValue,
    requiredValue,
    reasoning
  },
  softCriteriaScore,
  softCriteriaResults[] {
    criterion,
    score,
    weight,
    weightedScore,
    reasoning
  },
  overallCondition,
  totalRenovationCostLow,
  totalRenovationCostMid,
  totalRenovationCostHigh,
  renovationBreakdown[] {
    category,
    needed,
    costLow,
    costMid,
    costHigh,
    reasoning
  },
  totalInvestment,
  kostenKoper,
  monthlyMortgage,
  monthlyTotal,
  erfpachtNpv,
  withinBudget,
  budgetRemaining,
  overallRiskLevel,
  risks[] {
    category,
    level,
    description,
    mitigation
  },
  vveData {
    monthlyContribution,
    hasReserveFund,
    hasMaintenancePlan,
    kvkRegistered,
    hasBuildingInsurance
  },
  dealbreakers,
  analyzedAt,
  modelVersion,
  searchProfile->{
    _id,
    name
  }
}`);

/** Top analyses — for dashboard view */
export const TOP_ANALYSES_QUERY = defineQuery(`*[
  _type == "propertyAnalysis"
  && matchScore >= $minScore
] | order(matchScore desc) [0...$limit] {
  _id,
  matchScore,
  tier,
  recommendation,
  summary,
  hardCriteriaPass,
  overallCondition,
  totalInvestment,
  overallRiskLevel,
  dealbreakers,
  analyzedAt,
  property->{
    _id,
    address,
    slug,
    zipCode,
    city,
    propertyType,
    askingPrice,
    livingArea,
    rooms,
    bedrooms,
    energyLabel,
    listingStatus,
    starred,
    mainImage {
      asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      },
      alt,
      hotspot,
      crop
    }
  }
}`);

/** All analyses for a search profile */
export const ANALYSES_BY_PROFILE_QUERY = defineQuery(`*[
  _type == "propertyAnalysis"
  && searchProfile._ref == $profileId
] | order(matchScore desc) {
  _id,
  matchScore,
  tier,
  recommendation,
  hardCriteriaPass,
  totalInvestment,
  overallRiskLevel,
  analyzedAt,
  property->{
    _id,
    address,
    slug,
    city,
    askingPrice,
    livingArea,
    rooms,
    listingStatus,
    starred,
    mainImage {
      asset->{
        _id,
        url,
        metadata { lqip }
      },
      alt
    }
  }
}`);

// ---------------------------------------------------------------------------
// Search Profiles
// ---------------------------------------------------------------------------

/** All active search profiles */
export const ACTIVE_SEARCH_PROFILES_QUERY = defineQuery(`*[
  _type == "searchProfile"
  && active == true
] {
  _id,
  name,
  slug,
  cities,
  minPrice,
  maxPrice,
  maxTotalCost,
  propertyTypes,
  minLivingArea,
  minRooms,
  minBedrooms,
  mustHaveFeatures,
  preferredEnergyLabels,
  maxBuildYear,
  niceToHaveFeatures,
  notes,
  neighborhoods[]->{
    _id,
    name,
    city
  }
}`);

/** Single search profile by slug */
export const SEARCH_PROFILE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "searchProfile"
  && slug.current == $slug
][0] {
  _id,
  name,
  slug,
  active,
  cities,
  minPrice,
  maxPrice,
  maxTotalCost,
  propertyTypes,
  minLivingArea,
  minRooms,
  minBedrooms,
  mustHaveFeatures,
  preferredEnergyLabels,
  maxBuildYear,
  niceToHaveFeatures,
  notes,
  neighborhoods[]->{
    _id,
    name,
    slug,
    city,
    averagePricePerSqm
  }
}`);

// ---------------------------------------------------------------------------
// Neighborhoods
// ---------------------------------------------------------------------------

/** All neighborhoods */
export const NEIGHBORHOODS_QUERY = defineQuery(`*[
  _type == "neighborhood"
] | order(city asc, name asc) {
  _id,
  name,
  slug,
  city,
  description,
  averagePricePerSqm,
  amenities,
  safetyRating,
  coordinates
}`);

// ---------------------------------------------------------------------------
// Pages (Section Builder — kept from template)
// ---------------------------------------------------------------------------

/** Page by slug — resolves all section types */
export const PAGE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "page"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  sections[] {
    _type,
    _key,
    _type == "heroSection" => {
      headline,
      subheadline,
      backgroundImage {
        asset->{ _id, url, metadata { lqip, dimensions } },
        alt,
        hotspot,
        crop
      },
      backgroundVideo,
      ctaText,
      ctaLink,
      style
    },
    _type == "textSection" => {
      heading,
      body[] {
        ...,
        markDefs[] { ..., _type == "link" => { href, openInNewTab } }
      },
      alignment
    },
    _type == "imageGallerySection" => {
      heading,
      images[] {
        asset->{ _id, url, metadata { lqip, dimensions } },
        alt,
        caption,
        hotspot,
        crop
      },
      layout
    },
    _type == "ctaSection" => {
      heading,
      body,
      buttonText,
      buttonLink,
      backgroundImage {
        asset->{ _id, url, metadata { lqip } },
        hotspot,
        crop
      },
      style
    },
    _type == "testimonialSection" => {
      heading,
      testimonials[] { quote, author, role }
    },
    _type == "newsletterSection" => {
      heading,
      description,
      buttonText
    }
  },
  seo
}`);

// ---------------------------------------------------------------------------
// Site Settings (Singleton)
// ---------------------------------------------------------------------------

/** Global site settings */
export const SITE_SETTINGS_QUERY = defineQuery(`*[
  _id == "siteSettings"
][0] {
  siteName,
  tagline,
  description,
  logo {
    asset->{ _id, url }
  },
  logoDark {
    asset->{ _id, url }
  },
  favicon {
    asset->{ _id, url }
  },
  mainNavigation[] {
    _key,
    label,
    linkType,
    externalUrl,
    internalLink->{
      _type,
      "slug": slug.current
    }
  },
  footerNavigation[] { label, url },
  footerText,
  socialLinks[] { platform, url },
  scoringEnabled,
  fundaScrapingEnabled,
  announcementBar {
    enabled,
    message,
    link,
    linkText
  },
  defaultSeo
}`);
