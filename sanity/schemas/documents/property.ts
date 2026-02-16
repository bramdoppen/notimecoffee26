import { HomeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Property — a residential property listing.
 * Core entity for the aankoopmakelaar app.
 *
 * Sources: Funda scraping, manual entry, or API import.
 * Extended by: property analysis (scoring model — separate schema, Phase 2).
 */
export const property = defineType({
  name: 'property',
  title: 'Woning',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'basics', title: 'Basis', default: true },
    { name: 'details', title: 'Details' },
    { name: 'location', title: 'Locatie' },
    { name: 'financial', title: 'Financieel' },
    { name: 'media', title: 'Media' },
    { name: 'source', title: 'Bron' },
    { name: 'status', title: 'Status' },
  ],
  fields: [
    // --- Basics ---
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'string',
      description: 'Straatnaam + huisnummer',
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'address', maxLength: 96 },
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'zipCode',
      title: 'Postcode',
      type: 'string',
      validation: (rule) =>
        rule.required().regex(/^\d{4}\s?[A-Z]{2}$/, {
          name: 'postcode',
          invert: false,
        }),
      group: 'basics',
    }),
    defineField({
      name: 'city',
      title: 'Plaats',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'neighborhood',
      title: 'Buurt',
      type: 'reference',
      to: [{ type: 'neighborhood' }],
      group: 'basics',
    }),
    defineField({
      name: 'propertyType',
      title: 'Woningtype',
      type: 'string',
      options: {
        list: [
          { title: 'Appartement', value: 'appartement' },
          { title: 'Tussenwoning', value: 'tussenwoning' },
          { title: 'Hoekwoning', value: 'hoekwoning' },
          { title: 'Twee-onder-een-kap', value: 'twee_onder_een_kap' },
          { title: 'Vrijstaand', value: 'vrijstaand' },
          { title: 'Penthouse', value: 'penthouse' },
          { title: 'Grachtenpand', value: 'grachtenpand' },
          { title: 'Bovenwoning', value: 'bovenwoning' },
          { title: 'Benedenwoning', value: 'benedenwoning' },
          { title: 'Maisonnette', value: 'maisonnette' },
          { title: 'Villa', value: 'villa' },
          { title: 'Woonboerderij', value: 'woonboerderij' },
          { title: 'Overig', value: 'overig' },
        ],
      },
      validation: (rule) => rule.required(),
      group: 'basics',
    }),

    // --- Details ---
    defineField({
      name: 'askingPrice',
      title: 'Vraagprijs (€)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      group: 'details',
    }),
    defineField({
      name: 'livingArea',
      title: 'Woonoppervlakte (m²)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      group: 'details',
    }),
    defineField({
      name: 'plotArea',
      title: 'Perceeloppervlakte (m²)',
      type: 'number',
      validation: (rule) => rule.positive(),
      group: 'details',
    }),
    defineField({
      name: 'rooms',
      title: 'Kamers',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
      group: 'details',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Slaapkamers',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
      group: 'details',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Badkamers',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
      group: 'details',
    }),
    defineField({
      name: 'buildYear',
      title: 'Bouwjaar',
      type: 'number',
      validation: (rule) => rule.integer().min(1600).max(2030),
      group: 'details',
    }),
    defineField({
      name: 'energyLabel',
      title: 'Energielabel',
      type: 'string',
      options: {
        list: [
          { title: 'A++++', value: 'A++++' },
          { title: 'A+++', value: 'A+++' },
          { title: 'A++', value: 'A++' },
          { title: 'A+', value: 'A+' },
          { title: 'A', value: 'A' },
          { title: 'B', value: 'B' },
          { title: 'C', value: 'C' },
          { title: 'D', value: 'D' },
          { title: 'E', value: 'E' },
          { title: 'F', value: 'F' },
          { title: 'G', value: 'G' },
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'features',
      title: 'Kenmerken',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Tuin', value: 'tuin' },
          { title: 'Balkon', value: 'balkon' },
          { title: 'Dakterras', value: 'dakterras' },
          { title: 'Garage', value: 'garage' },
          { title: 'Parkeerplaats', value: 'parkeerplaats' },
          { title: 'Berging', value: 'berging' },
          { title: 'Lift', value: 'lift' },
          { title: 'Zolder', value: 'zolder' },
          { title: 'Kelder', value: 'kelder' },
          { title: 'CV-ketel', value: 'cv_ketel' },
          { title: 'Vloerverwarming', value: 'vloerverwarming' },
          { title: 'Airco', value: 'airco' },
          { title: 'Zonnepanelen', value: 'zonnepanelen' },
          { title: 'Monumentaal', value: 'monumentaal' },
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      type: 'text',
      description: 'Volledige beschrijving van de woning',
      group: 'details',
    }),

    // --- Location ---
    defineField({
      name: 'coordinates',
      title: 'Coördinaten',
      type: 'geopoint',
      group: 'location',
    }),

    // --- Financial ---
    defineField({
      name: 'pricePerSqm',
      title: 'Prijs per m²',
      type: 'number',
      description: 'Berekend: vraagprijs / woonoppervlakte',
      readOnly: true,
      group: 'financial',
    }),
    defineField({
      name: 'serviceCharges',
      title: 'Servicekosten (€/maand)',
      type: 'number',
      description: 'VvE bijdrage of servicekosten',
      group: 'financial',
    }),
    defineField({
      name: 'ownershipType',
      title: 'Eigendomssituatie',
      type: 'string',
      options: {
        list: [
          { title: 'Volle eigendom', value: 'vol_eigendom' },
          { title: 'Erfpacht', value: 'erfpacht' },
          { title: 'Appartementsrecht', value: 'appartementsrecht' },
        ],
      },
      group: 'financial',
    }),
    defineField({
      name: 'erfpachtDetails',
      title: 'Erfpacht details',
      type: 'object',
      hidden: ({ parent }) => parent?.ownershipType !== 'erfpacht',
      fields: [
        defineField({
          name: 'annualAmount',
          title: 'Jaarlijks bedrag (€)',
          type: 'number',
        }),
        defineField({
          name: 'endDate',
          title: 'Einddatum',
          type: 'date',
        }),
        defineField({
          name: 'redeemed',
          title: 'Afgekocht',
          type: 'boolean',
          initialValue: false,
        }),
      ],
      group: 'financial',
    }),

    // --- Media ---
    defineField({
      name: 'mainImage',
      title: 'Hoofdfoto',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'photos',
      title: "Foto's",
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'category',
              title: 'Categorie',
              type: 'string',
              options: {
                list: [
                  { title: 'Exterieur', value: 'exterieur' },
                  { title: 'Woonkamer', value: 'woonkamer' },
                  { title: 'Keuken', value: 'keuken' },
                  { title: 'Slaapkamer', value: 'slaapkamer' },
                  { title: 'Badkamer', value: 'badkamer' },
                  { title: 'Tuin', value: 'tuin' },
                  { title: 'Plattegrond', value: 'plattegrond' },
                  { title: 'Overig', value: 'overig' },
                ],
              },
            }),
          ],
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'floorPlanUrl',
      title: 'Plattegrond URL',
      type: 'url',
      group: 'media',
    }),

    // --- Source & Data Provenance ---
    // Tracks where data comes from: pyfunda (scrape), BAG API (free),
    // Kadaster (paid), or manual entry. Each source has its own timestamp.
    defineField({
      name: 'fundaUrl',
      title: 'Funda URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
          allowRelative: false,
        }),
      group: 'source',
    }),
    defineField({
      name: 'fundaId',
      title: 'Funda ID',
      type: 'string',
      description: 'Unieke Funda listing identifier',
      group: 'source',
    }),
    defineField({
      name: 'sourceType',
      title: 'Primaire bron',
      type: 'string',
      options: {
        list: [
          { title: 'pyfunda (scrape)', value: 'pyfunda' },
          { title: 'Handmatig', value: 'manual' },
          { title: 'API import', value: 'api_import' },
        ],
      },
      initialValue: 'manual',
      validation: (rule) => rule.required(),
      group: 'source',
    }),
    defineField({
      name: 'dataSources',
      title: 'Data bronnen',
      type: 'array',
      description: 'Welke bronnen hebben data geleverd voor deze woning?',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'source',
              title: 'Bron',
              type: 'string',
              options: {
                list: [
                  { title: 'pyfunda', value: 'pyfunda' },
                  { title: 'BAG API', value: 'bag' },
                  { title: 'Kadaster', value: 'kadaster' },
                  { title: 'Handmatig', value: 'manual' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'fetchedAt',
              title: 'Opgehaald op',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'fieldsProvided',
              title: 'Geleverde velden',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Welke velden zijn door deze bron ingevuld?',
            }),
          ],
          preview: {
            select: { title: 'source', subtitle: 'fetchedAt' },
            prepare({ title, subtitle }) {
              const date = subtitle
                ? new Date(subtitle).toLocaleDateString('nl-NL')
                : '';
              return { title, subtitle: date };
            },
          },
        },
      ],
      group: 'source',
    }),
    defineField({
      name: 'bagId',
      title: 'BAG Verblijfsobject ID',
      type: 'string',
      description: 'Basisregistratie Adressen en Gebouwen identifier',
      group: 'source',
    }),
    defineField({
      name: 'rawData',
      title: 'Ruwe data',
      type: 'text',
      description: 'JSON dump van originele scrape data (voor debugging)',
      group: 'source',
    }),

    // --- Status ---
    defineField({
      name: 'listingStatus',
      title: 'Listing status',
      type: 'string',
      options: {
        list: [
          { title: 'Beschikbaar', value: 'beschikbaar' },
          { title: 'Onder bod', value: 'onder_bod' },
          { title: 'Verkocht onder voorbehoud', value: 'verkocht_onder_voorbehoud' },
          { title: 'Verkocht', value: 'verkocht' },
          { title: 'Ingetrokken', value: 'ingetrokken' },
        ],
      },
      initialValue: 'beschikbaar',
      validation: (rule) => rule.required(),
      group: 'status',
    }),
    defineField({
      name: 'listingDate',
      title: 'Datum op Funda',
      type: 'date',
      group: 'status',
    }),
    defineField({
      name: 'daysOnMarket',
      title: 'Dagen op markt',
      type: 'number',
      readOnly: true,
      group: 'status',
    }),
    defineField({
      name: 'starred',
      title: 'Favoriet',
      type: 'boolean',
      description: 'Gemarkeerd als interessant door gebruiker',
      initialValue: false,
      group: 'status',
    }),
    defineField({
      name: 'notes',
      title: 'Notities',
      type: 'text',
      description: 'Interne notities over deze woning',
      group: 'status',
    }),
  ],
  orderings: [
    {
      title: 'Prijs (laag → hoog)',
      name: 'priceAsc',
      by: [{ field: 'askingPrice', direction: 'asc' }],
    },
    {
      title: 'Prijs (hoog → laag)',
      name: 'priceDesc',
      by: [{ field: 'askingPrice', direction: 'desc' }],
    },
    {
      title: 'Nieuwste eerst',
      name: 'dateDesc',
      by: [{ field: 'listingDate', direction: 'desc' }],
    },
    {
      title: 'Oppervlakte (groot → klein)',
      name: 'areaDesc',
      by: [{ field: 'livingArea', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'address',
      city: 'city',
      price: 'askingPrice',
      status: 'listingStatus',
      starred: 'starred',
      media: 'mainImage',
    },
    prepare({ title, city, price, status, starred, media }) {
      const star = starred ? '⭐ ' : '';
      const statusEmoji =
        status === 'verkocht'
          ? '🔴 '
          : status === 'onder_bod'
            ? '🟡 '
            : status === 'verkocht_onder_voorbehoud'
              ? '🟠 '
              : '';
      const priceStr = price
        ? `€${(price / 1000).toFixed(0)}k`
        : '';
      return {
        title: `${star}${statusEmoji}${title}`,
        subtitle: `${city} — ${priceStr}`,
        media,
      };
    },
  },
});
