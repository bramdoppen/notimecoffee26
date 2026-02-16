import { CogIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Site Settings — global brand and site configuration (singleton).
 * Adapted for aankoopmakelaar (property buying agent) app.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Instellingen',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'brand', title: 'Merk', default: true },
    { name: 'navigation', title: 'Navigatie' },
    { name: 'footer', title: 'Footer' },
    { name: 'features', title: 'Features' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // --- Brand ---
    defineField({
      name: 'siteName',
      title: 'Site Naam',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'brand',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'brand',
    }),
    defineField({
      name: 'description',
      title: 'Site Beschrijving',
      type: 'text',
      rows: 3,
      description: 'Default meta description',
      validation: (rule) => rule.required(),
      group: 'brand',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'brand',
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (Donker)',
      type: 'image',
      group: 'brand',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'brand',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'X (Twitter)', value: 'twitter' },
                  { title: 'YouTube', value: 'youtube' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
      group: 'brand',
    }),

    // --- Navigation ---
    defineField({
      name: 'mainNavigation',
      title: 'Hoofdnavigatie',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Interne pagina', value: 'internal' },
                  { title: 'Externe URL', value: 'external' },
                ],
                layout: 'radio',
              },
              initialValue: 'internal',
            }),
            defineField({
              name: 'internalLink',
              title: 'Interne Pagina',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => parent?.linkType !== 'internal',
            }),
            defineField({
              name: 'externalUrl',
              title: 'Externe URL',
              type: 'url',
              hidden: ({ parent }) => parent?.linkType !== 'external',
            }),
          ],
          preview: {
            select: { title: 'label' },
          },
        },
      ],
      group: 'navigation',
    }),

    // --- Footer ---
    defineField({
      name: 'footerNavigation',
      title: 'Footer Navigatie',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
      group: 'footer',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Tekst',
      type: 'text',
      rows: 2,
      group: 'footer',
    }),

    // --- Features ---
    defineField({
      name: 'scoringEnabled',
      title: 'Scoring Model Actief',
      type: 'boolean',
      description: 'Schakel het AI scoring model in/uit op de site',
      initialValue: false,
      group: 'features',
    }),
    defineField({
      name: 'fundaScrapingEnabled',
      title: 'Funda Scraping Actief',
      type: 'boolean',
      description: 'Schakel automatische Funda imports in/uit',
      initialValue: false,
      group: 'features',
    }),
    defineField({
      name: 'announcementBar',
      title: 'Aankondigingsbalk',
      type: 'object',
      group: 'features',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Actief',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'message',
          title: 'Bericht',
          type: 'string',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'link',
          title: 'Link URL',
          type: 'url',
          validation: (rule) =>
            rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'linkText',
          title: 'Link Tekst',
          type: 'string',
          hidden: ({ parent }) => !parent?.enabled,
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // --- SEO ---
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seoFields',
      description: 'Fallback SEO instellingen',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '⚙️ Site Instellingen',
      };
    },
  },
});
