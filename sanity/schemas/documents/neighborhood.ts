import { PinIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Neighborhood — buurt/wijk reference data.
 * Used for location context on property listings.
 * Can be enriched with statistics, amenities, etc.
 */
export const neighborhood = defineType({
  name: 'neighborhood',
  title: 'Buurt',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Stad',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      type: 'text',
    }),
    defineField({
      name: 'averagePricePerSqm',
      title: 'Gemiddelde prijs per m²',
      type: 'number',
      description: 'Referentieprijs voor de buurt',
    }),
    defineField({
      name: 'amenities',
      title: 'Voorzieningen',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Supermarkt', value: 'supermarkt' },
          { title: 'School', value: 'school' },
          { title: 'OV halte', value: 'ov_halte' },
          { title: 'Park', value: 'park' },
          { title: 'Sportfaciliteiten', value: 'sport' },
          { title: 'Horeca', value: 'horeca' },
          { title: 'Huisarts', value: 'huisarts' },
          { title: 'Kinderopvang', value: 'kinderopvang' },
        ],
      },
    }),
    defineField({
      name: 'safetyRating',
      title: 'Veiligheidsscore',
      type: 'number',
      description: '1-10 schaal',
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: 'coordinates',
      title: 'Centrum coördinaten',
      type: 'geopoint',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      city: 'city',
      avgPrice: 'averagePricePerSqm',
    },
    prepare({ title, city, avgPrice }) {
      const priceStr = avgPrice ? `€${avgPrice}/m²` : '';
      return {
        title,
        subtitle: [city, priceStr].filter(Boolean).join(' — '),
      };
    },
  },
});
