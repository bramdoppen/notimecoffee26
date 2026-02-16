import { Suspense } from 'react';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PROPERTIES_QUERY, TOP_ANALYSES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { FilterBar } from '@/components/filters/FilterBar';
import { SortSelect } from '@/components/filters/SortSelect';
import { DashboardStats } from '@/components/filters/DashboardStats';
import { parseFilters, filterProperties, sortProperties } from '@/lib/filters';
import { mapToPropertySummary } from '@/lib/mappers';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<any>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });

  return {
    title: settings?.siteName || 'Aankoopmakelaar',
    description:
      settings?.description ||
      'Vind en analyseer woningen met AI-ondersteuning.',
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

/**
 * Dashboard page — the main entry point.
 *
 * Server component that:
 * 1. Fetches all properties + analyses from Sanity
 * 2. Maps raw Sanity data to PropertySummary (lightweight card projection)
 * 3. Applies URL-driven filters and sort
 * 4. Renders PropertyGrid with FilterBar
 *
 * Filter state lives entirely in URL searchParams.
 * FilterBar and SortSelect are client components that push URL changes.
 */
export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  // Build URLSearchParams from the resolved params
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (Array.isArray(value)) {
      for (const v of value) urlParams.append(key, v);
    } else {
      urlParams.set(key, value);
    }
  }

  const filters = parseFilters(urlParams);

  // Fetch properties with analyses from Sanity
  // TODO: Replace with DASHBOARD_PROPERTIES_QUERY when backend adds it
  const [properties, analyses] = await Promise.all([
    sanityFetch<any[]>({
      query: PROPERTIES_QUERY,
      tags: ['property'],
    }),
    sanityFetch<any[]>({
      query: TOP_ANALYSES_QUERY,
      params: { minScore: 0, limit: 100 },
      tags: ['propertyAnalysis'],
    }),
  ]);

  // Map raw Sanity data to PropertySummary
  const allProperties = mapToPropertySummary(properties ?? [], analyses ?? []);

  // Extract available cities for filter dropdown
  const availableCities = [...new Set(allProperties.map((p) => p.city))].sort();

  // Apply filters and sort
  const filtered = filterProperties(allProperties, filters);
  const sorted = sortProperties(filtered, filters.sortBy);

  // Count top matches (excellent + strong tiers)
  const topMatches = allProperties.filter(
    (p) => p.matchTier === 'excellent' || p.matchTier === 'strong',
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Woningen</h1>
        <p className="text-sm text-gray-500">
          AI-analyse van beschikbare woningen op basis van jouw criteria.
        </p>
      </div>

      {/* Stats + Sort */}
      <div className="mb-4 flex items-center justify-between">
        <DashboardStats
          total={allProperties.length}
          filtered={sorted.length}
          topMatches={topMatches}
        />
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense>
          <FilterBar availableCities={availableCities} />
        </Suspense>
      </div>

      {/* Property Grid */}
      <PropertyGrid properties={sorted} />
    </div>
  );
}
