import { SearchIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * SearchProfile — a user's property search criteria.
 * Defines hard filters (must-have) and soft preferences (nice-to-have with weights).
 * Used by the scoring model to rank properties.
 *
 * Note: UserPreferences (scoring weights, dealbreakers) will be a separate
 * singleton once the scoring data contract is finalized.
 */
export const searchProfile = defineType({
  name: 'searchProfile',
  title: 'Zoekprofiel',
  type: 'document',
  icon: SearchIcon,
  groups: [
    { name: 'basics', title: 'Basis', default: true },
    { name: 'budget', title: 'Budget' },
    { name: 'requirements', title: 'Eisen' },
    { name: 'preferences', title: 'Voorkeuren' },
  ],
  fields: [
    // --- Basics ---
    defineField({
      name: 'name',
      title: 'Profielnaam',
      type: 'string',
      description: 'Bijv. "Gezinswoning Amsterdam" of "Starterswoning Utrecht"',
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'active',
      title: 'Actief',
      type: 'boolean',
      description: 'Wordt dit profiel gebruikt voor automatische matching?',
      initialValue: true,
      group: 'basics',
    }),
    defineField({
      name: 'cities',
      title: 'Steden',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'In welke steden zoek je?',
      validation: (rule) => rule.required().min(1),
      group: 'basics',
    }),
    defineField({
      name: 'neighborhoods',
      title: 'Buurten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'neighborhood' }] }],
      description: 'Optioneel: specifieke buurten',
      group: 'basics',
    }),

    // --- Budget ---
    defineField({
      name: 'minPrice',
      title: 'Minimumprijs (€)',
      type: 'number',
      validation: (rule) => rule.positive(),
      group: 'budget',
    }),
    defineField({
      name: 'maxPrice',
      title: 'Maximumprijs (€)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      group: 'budget',
    }),
    defineField({
      name: 'maxTotalCost',
      title: 'Max totale kosten (€)',
      type: 'number',
      description: 'Inclusief geschatte renovatiekosten en kosten koper',
      group: 'budget',
    }),

    // --- Requirements (hard filters) ---
    defineField({
      name: 'propertyTypes',
      title: 'Woningtypes',
      type: 'array',
      of: [{ type: 'string' }],
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
        ],
      },
      group: 'requirements',
    }),
    defineField({
      name: 'minLivingArea',
      title: 'Minimale woonoppervlakte (m²)',
      type: 'number',
      validation: (rule) => rule.positive(),
      group: 'requirements',
    }),
    defineField({
      name: 'minRooms',
      title: 'Minimaal aantal kamers',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
      group: 'requirements',
    }),
    defineField({
      name: 'minBedrooms',
      title: 'Minimaal aantal slaapkamers',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
      group: 'requirements',
    }),
    defineField({
      name: 'mustHaveFeatures',
      title: 'Must-have kenmerken',
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
        ],
      },
      group: 'requirements',
    }),

    // --- Preferences (soft, weighted) ---
    defineField({
      name: 'preferredEnergyLabels',
      title: 'Voorkeur energielabels',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'A++++', value: 'A++++' },
          { title: 'A+++', value: 'A+++' },
          { title: 'A++', value: 'A++' },
          { title: 'A+', value: 'A+' },
          { title: 'A', value: 'A' },
          { title: 'B', value: 'B' },
          { title: 'C', value: 'C' },
        ],
      },
      group: 'preferences',
    }),
    defineField({
      name: 'maxBuildYear',
      title: 'Maximaal bouwjaar',
      type: 'number',
      description: 'Geen woningen ouder dan dit jaar',
      group: 'preferences',
    }),
    defineField({
      name: 'niceToHaveFeatures',
      title: 'Nice-to-have kenmerken',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Zonnepanelen', value: 'zonnepanelen' },
          { title: 'Vloerverwarming', value: 'vloerverwarming' },
          { title: 'Airco', value: 'airco' },
          { title: 'Zolder', value: 'zolder' },
          { title: 'Kelder', value: 'kelder' },
        ],
      },
      group: 'preferences',
    }),
    defineField({
      name: 'notes',
      title: 'Notities',
      type: 'text',
      description: 'Vrije tekst over wat je zoekt — wordt meegenomen in AI analyse',
      group: 'preferences',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      active: 'active',
      maxPrice: 'maxPrice',
      cities: 'cities',
    },
    prepare({ title, active, maxPrice, cities }) {
      const status = active ? '🟢' : '⚪';
      const priceStr = maxPrice ? `max €${(maxPrice / 1000).toFixed(0)}k` : '';
      const cityStr = cities?.slice(0, 2).join(', ') || '';
      return {
        title: `${status} ${title}`,
        subtitle: [cityStr, priceStr].filter(Boolean).join(' — '),
      };
    },
  },
});
