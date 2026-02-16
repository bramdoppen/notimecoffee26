import { sanityFetch } from '@/sanity/lib/fetch';
import { PROPERTY_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await sanityFetch<any>({
    query: PROPERTY_BY_SLUG_QUERY,
    params: { slug },
    tags: ['property'],
  });

  if (!property) return { title: 'Woning niet gevonden' };

  return {
    title: `${property.address}, ${property.city} — €${property.askingPrice?.toLocaleString('nl-NL')}`,
    description: `${property.propertyType} in ${property.city}. ${property.livingArea}m², ${property.rooms} kamers. Vraagprijs €${property.askingPrice?.toLocaleString('nl-NL')}.`,
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await sanityFetch<any>({
    query: PROPERTY_BY_SLUG_QUERY,
    params: { slug },
    tags: ['property'],
  });

  if (!property) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          {property.starred && <span className="text-2xl">⭐</span>}
          <h1 className="text-3xl font-bold">{property.address}</h1>
        </div>
        <p className="text-gray-600">
          {property.zipCode} {property.city}
          {property.neighborhood && ` · ${property.neighborhood.name}`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo */}
          {property.mainImage?.asset?.url && (
            <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
              <img
                src={property.mainImage.asset.url}
                alt={property.mainImage.alt || property.address}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {property.description && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Beschrijving</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {property.description}
              </p>
            </section>
          )}

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Kenmerken</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature: string) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Photo gallery */}
          {property.photos && property.photos.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Foto&apos;s</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.photos.map((photo: any, i: number) => (
                  <div
                    key={photo.asset?._id || i}
                    className="aspect-[4/3] rounded overflow-hidden bg-gray-100"
                  >
                    <img
                      src={photo.asset?.url}
                      alt={photo.alt || `Foto ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price card */}
          <div className="rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold mb-1">
              €{property.askingPrice?.toLocaleString('nl-NL')}
            </div>
            {property.pricePerSqm && (
              <p className="text-sm text-gray-500 mb-4">
                €{property.pricePerSqm.toLocaleString('nl-NL')}/m²
              </p>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">{property.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Woonoppervlakte</span>
                <span className="font-medium">{property.livingArea} m²</span>
              </div>
              {property.plotArea && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Perceel</span>
                  <span className="font-medium">{property.plotArea} m²</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Kamers</span>
                <span className="font-medium">{property.rooms}</span>
              </div>
              {property.bedrooms != null && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Slaapkamers</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Badkamers</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}
              {property.buildYear && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Bouwjaar</span>
                  <span className="font-medium">{property.buildYear}</span>
                </div>
              )}
              {property.energyLabel && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Energielabel</span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                    {property.energyLabel}
                  </span>
                </div>
              )}
              {property.ownershipType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Eigendom</span>
                  <span className="font-medium">{property.ownershipType}</span>
                </div>
              )}
              {property.serviceCharges != null && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Servicekosten</span>
                  <span className="font-medium">
                    €{property.serviceCharges}/mnd
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold mb-3">Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{property.listingStatus}</span>
              </div>
              {property.listingDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Sinds</span>
                  <span className="font-medium">
                    {new Date(property.listingDate).toLocaleDateString('nl-NL')}
                  </span>
                </div>
              )}
              {property.daysOnMarket != null && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Dagen op markt</span>
                  <span className="font-medium">{property.daysOnMarket}</span>
                </div>
              )}
            </div>
          </div>

          {/* Funda link */}
          {property.fundaUrl && (
            <a
              href={property.fundaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Bekijk op Funda →
            </a>
          )}

          {/* Neighborhood */}
          {property.neighborhood && (
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold mb-3">
                Buurt: {property.neighborhood.name}
              </h3>
              {property.neighborhood.description && (
                <p className="text-sm text-gray-600 mb-3">
                  {property.neighborhood.description}
                </p>
              )}
              {property.neighborhood.averagePricePerSqm && (
                <p className="text-sm">
                  <span className="text-gray-500">Gem. prijs/m²: </span>
                  <span className="font-medium">
                    €
                    {property.neighborhood.averagePricePerSqm.toLocaleString(
                      'nl-NL'
                    )}
                  </span>
                </p>
              )}
              {property.neighborhood.safetyRating && (
                <p className="text-sm mt-1">
                  <span className="text-gray-500">Veiligheid: </span>
                  <span className="font-medium">
                    {property.neighborhood.safetyRating}/10
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Notes (internal) */}
          {property.notes && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <h3 className="font-semibold mb-2 text-yellow-800">
                📝 Notities
              </h3>
              <p className="text-sm text-yellow-700 whitespace-pre-line">
                {property.notes}
              </p>
            </div>
          )}

          {/* Placeholder for scoring — Phase 2 */}
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-400">
            <p className="text-sm">
              🎯 AI Scoring komt in Fase 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
