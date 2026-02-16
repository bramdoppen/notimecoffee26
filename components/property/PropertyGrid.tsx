import { PropertyCard } from '@/components/property/PropertyCard';
import type { PropertySummary } from '@/lib/types';

interface PropertyGridProps {
  properties: PropertySummary[];
}

/**
 * Responsive grid of PropertyCards.
 *
 * Layout:
 * - Mobile (<640px): 1 column
 * - Tablet (640-1024px): 2 columns
 * - Desktop (>1024px): 3 columns
 *
 * Server component.
 */
export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-8 py-16 text-center">
      <div className="mb-4 text-5xl">🏠</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Geen woningen gevonden
      </h3>
      <p className="max-w-sm text-sm text-gray-500">
        Probeer de minimum score te verlagen of filters aan te passen.
      </p>
    </div>
  );
}
