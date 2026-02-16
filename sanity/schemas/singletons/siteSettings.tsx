import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Site Settings — global brand and site configuration (singleton).
 * Only one instance, enforced in Studio structure.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Brand', default: true},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'features', title: 'Features'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // --- Brand ---
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'NOTIME coffee',
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
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Default meta description used when pages don\'t have their own',
      validation: (rule) => rule.required(),
      group: 'brand',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Primary logo (light backgrounds)',
      validation: (rule) => rule.required(),
      group: 'brand',
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (Dark Variant)',
      type: 'image',
      description: 'Logo for dark backgrounds',
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
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'X (Twitter)', value: 'twitter'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
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
            select: {title: 'platform', subtitle: 'url'},
          },
        },
      ],
      group: 'brand',
    }),

    // --- Navigation ---
    defineField({
      name: 'mainNavigation',
      title: 'Main Navigation',
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
                  {title: 'Internal Page', value: 'internal'},
                  {title: 'External URL', value: 'external'},
                ],
                layout: 'radio',
              },
              initialValue: 'internal',
            }),
            defineField({
              name: 'internalLink',
              title: 'Internal Page',
              type: 'reference',
              to: [{type: 'page'}, {type: 'blogPost'}],
              hidden: ({parent}) => parent?.linkType !== 'internal',
            }),
            defineField({
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
              hidden: ({parent}) => parent?.linkType !== 'external',
            }),
            defineField({
              name: 'children',
              title: 'Dropdown Items',
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
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Internal Page', value: 'internal'},
                          {title: 'External URL', value: 'external'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'internal',
                    }),
                    defineField({
                      name: 'internalLink',
                      title: 'Internal Page',
                      type: 'reference',
                      to: [{type: 'page'}, {type: 'blogPost'}],
                      hidden: ({parent}) => parent?.linkType !== 'internal',
                    }),
                    defineField({
                      name: 'externalUrl',
                      title: 'External URL',
                      type: 'url',
                      hidden: ({parent}) => parent?.linkType !== 'external',
                    }),
                  ],
                  preview: {
                    select: {title: 'label'},
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'label',
              children: 'children',
            },
            prepare({title, children}) {
              const count = children?.length || 0
              return {
                title: title || 'Nav Item',
                subtitle: count > 0 ? `${count} dropdown items` : 'Link',
              }
            },
          },
        },
      ],
      group: 'navigation',
    }),

    // --- Footer ---
    defineField({
      name: 'footerNavigation',
      title: 'Footer Navigation',
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
                rule.uri({allowRelative: true, scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        },
      ],
      group: 'footer',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 2,
      description: 'Copyright or legal text displayed in the footer',
      group: 'footer',
    }),

    // --- Features ---
    defineField({
      name: 'orderingEnabled',
      title: 'Online Ordering Enabled',
      type: 'boolean',
      description: 'Phase 2 toggle — enables order terminal features on the website',
      initialValue: false,
      group: 'features',
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      group: 'features',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'string',
          hidden: ({parent}) => !parent?.enabled,
        }),
        defineField({
          name: 'link',
          title: 'Link URL',
          type: 'url',
          validation: (rule) =>
            rule.uri({allowRelative: true, scheme: ['http', 'https']}),
          hidden: ({parent}) => !parent?.enabled,
        }),
        defineField({
          name: 'linkText',
          title: 'Link Text',
          type: 'string',
          hidden: ({parent}) => !parent?.enabled,
        }),
        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          description: 'Hex color (e.g., #2D5016)',
          hidden: ({parent}) => !parent?.enabled,
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
      description: 'Fallback SEO settings used when pages don\'t have their own',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '⚙️ Site Settings',
      }
    },
  },
})
