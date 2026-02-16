import { UsersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * UserPreferences — singleton document for scoring model configuration.
 * Defines hard criteria, soft weights, and dealbreakers.
 *
 * Based on data contract: /scoring-spec/data-contract-scoring
 * Used by the scoring model to evaluate properties against user preferences.
 *
 * Note: For MVP this is a singleton (one user). Multi-user support
 * would promote this to a regular document type.
 */
export const userPreferences = defineType({
  name: 'userPreferences',
  title: 'Gebruikersvoorkeuren',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'weights', title: 'Gewichten', default: true },
    { name: 'dealbreakers', title: 'Dealbreakers' },
    { name: 'thresholds', title: 'Drempelwaarden' },
  ],
  fields: [
    // --- Soft Criteria Weights ---
    // Each weight is 0-1, total should sum to ~1.0
    defineField({
      name: 'softWeights',
      title: 'Zachte criteria gewichten',
      type: 'array',
      description: 'Gewichten per criterium (0-1). Totaal zou ~1.0 moeten zijn.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'criterion',
              title: 'Criterium',
              type: 'string',
              options: {
                list: [
                  { title: 'Energielabel', value: 'energy_label' },
                  { title: 'Bouwjaar', value: 'build_year' },
                  { title: 'Tuin', value: 'garden' },
                  { title: 'Balkon', value: 'balcony' },
                  { title: 'Parkeren', value: 'parking' },
                  { title: 'Buitenruimte', value: 'outdoor_space' },
                  { title: 'Staat van onderhoud', value: 'condition' },
                  { title: 'Buurt score', value: 'neighborhood_score' },
                  { title: 'Prijs/m²', value: 'price_per_sqm' },
                  { title: 'Dagen op markt', value: 'days_on_market' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'weight',
              title: 'Gewicht',
              type: 'number',
              description: '0 = niet belangrijk, 1 = zeer belangrijk',
              validation: (rule) => rule.required().min(0).max(1),
            }),
          ],
          preview: {
            select: { criterion: 'criterion', weight: 'weight' },
            prepare({ criterion, weight }) {
              const bar = '█'.repeat(Math.round((weight || 0) * 10));
              return {
                title: criterion,
                subtitle: `${weight} ${bar}`,
              };
            },
          },
        },
      ],
      group: 'weights',
    }),

    // --- Dealbreakers ---
    defineField({
      name: 'dealbreakers',
      title: 'Dealbreakers',
      type: 'array',
      description: 'Automatische afwijzing als een van deze waar is',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Geen VvE reservefonds', value: 'no_vve_reserve_fund' },
                  { title: 'VvE niet bij KvK', value: 'vve_not_registered' },
                  { title: 'Erfpacht niet afgekocht', value: 'erfpacht_not_redeemed' },
                  { title: 'Energielabel F of G', value: 'energy_label_fg' },
                  { title: 'Bouwjaar voor 1930', value: 'build_year_pre_1930' },
                  { title: 'Geen opstalverzekering', value: 'no_building_insurance' },
                  { title: 'Aangepast', value: 'custom' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'enabled',
              title: 'Actief',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'customDescription',
              title: 'Beschrijving',
              type: 'string',
              description: 'Alleen voor type "Aangepast"',
              hidden: ({ parent }) => parent?.type !== 'custom',
            }),
          ],
          preview: {
            select: { type: 'type', enabled: 'enabled' },
            prepare({ type, enabled }) {
              return {
                title: `${enabled ? '🚫' : '⚪'} ${type}`,
              };
            },
          },
        },
      ],
      group: 'dealbreakers',
    }),

    // --- Scoring Thresholds ---
    defineField({
      name: 'hardPenaltyCaps',
      title: 'Hard penalty caps',
      type: 'object',
      description: 'Maximum score bij gefaalde harde criteria',
      fields: [
        defineField({
          name: 'singleViolation',
          title: 'Enkele overtreding (max score)',
          type: 'number',
          initialValue: 55,
          validation: (rule) => rule.required().min(0).max(100),
        }),
        defineField({
          name: 'multipleViolations',
          title: 'Meerdere overtredingen (max score)',
          type: 'number',
          initialValue: 30,
          validation: (rule) => rule.required().min(0).max(100),
        }),
      ],
      group: 'thresholds',
    }),
    defineField({
      name: 'tierThresholds',
      title: 'Tier drempelwaarden',
      type: 'object',
      description: 'Score grenzen voor tier classificatie',
      fields: [
        defineField({
          name: 'topMatch',
          title: 'Top match (≥)',
          type: 'number',
          initialValue: 85,
          validation: (rule) => rule.required().min(0).max(100),
        }),
        defineField({
          name: 'goodMatch',
          title: 'Goede match (≥)',
          type: 'number',
          initialValue: 70,
          validation: (rule) => rule.required().min(0).max(100),
        }),
        defineField({
          name: 'reasonableMatch',
          title: 'Redelijke match (≥)',
          type: 'number',
          initialValue: 50,
          validation: (rule) => rule.required().min(0).max(100),
        }),
        defineField({
          name: 'poorMatch',
          title: 'Slechte match (≥)',
          type: 'number',
          initialValue: 25,
          validation: (rule) => rule.required().min(0).max(100),
        }),
      ],
      group: 'thresholds',
    }),
    defineField({
      name: 'vveThresholds',
      title: 'VvE drempelwaarden',
      type: 'object',
      fields: [
        defineField({
          name: 'highContribution',
          title: 'Hoge bijdrage (€/maand)',
          type: 'number',
          description: 'Boven dit bedrag → penalty',
          initialValue: 200,
        }),
        defineField({
          name: 'veryHighContribution',
          title: 'Zeer hoge bijdrage (€/maand)',
          type: 'number',
          description: 'Boven dit bedrag → zware penalty',
          initialValue: 350,
        }),
      ],
      group: 'thresholds',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '👤 Gebruikersvoorkeuren',
      };
    },
  },
});
