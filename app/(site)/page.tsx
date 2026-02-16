import { sanityFetch } from '@/sanity/lib/fetch';
import { PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries';
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

export default async function HomePage() {
  const properties = await sanityFetch<any[]>({
    query: PROPERTIES_QUERY,
    tags: ['property'],
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Aankoopmakelaar</h1>
      <p className="text-lg text-gray-600 mb-8">
        Vind en analyseer woningen met AI-ondersteuning.
      </p>

      {!properties || properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">
            Nog geen woningen gevonden. Voeg woningen toe via{' '}
            <a href="/studio" className="text-blue-600 underline">
              Sanity Studio
            </a>{' '}
            of start een Funda import.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <a
              key={property._id}
              href={`/woningen/${property.slug?.current}`}
              className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {property.mainImage?.asset?.url && (
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={property.mainImage.asset.url}
                    alt={property.mainImage.alt || property.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-lg truncate">
                    {property.starred && '⭐ '}
                    {property.address}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {property.zipCode} {property.city}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    €{property.askingPrice?.toLocaleString('nl-NL')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {property.livingArea}m² · {property.rooms} kamers
                  </span>
                </div>
                {property.energyLabel && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                    Label {property.energyLabel}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
