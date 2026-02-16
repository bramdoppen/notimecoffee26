import { CogIcon, PackageIcon, TagIcon, PinIcon } from '@sanity/icons';
import type { StructureBuilder, StructureResolver } from 'sanity/structure';

// Types handled by custom structure or hidden from the default list
const HIDDEN_TYPES = [
  'siteSettings',
  'product',
  'productCategory',
  'assist.instruction.context',
];

const productStructure = (S: StructureBuilder) =>
  S.listItem()
    .title('Products')
    .icon(PackageIcon)
    .child(
      S.list()
        .title('Product Views')
        .items([
          S.listItem()
            .title('Products by Category')
            .icon(TagIcon)
            .child(
              S.documentTypeList('productCategory')
                .title('Categories')
                .child((categoryId) =>
                  S.documentList()
                    .title('Products')
                    .filter(
                      '_type == "product" && category._ref == $categoryId'
                    )
                    .params({ categoryId })
                )
            ),
          S.listItem()
            .title('Products by Store')
            .icon(PinIcon)
            .child(
              S.documentTypeList('store')
                .title('Stores')
                .child((storeId) =>
                  S.documentList()
                    .title('Products')
                    .filter(
                      '_type == "product" && $storeId in availableAt[]._ref'
                    )
                    .params({ storeId })
                )
            ),
          S.listItem()
            .title('All Products')
            .icon(PackageIcon)
            .child(S.documentTypeList('product').title('All Products')),
        ])
    );

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Products (custom nested structure)
      productStructure(S),

      // Product Categories
      S.documentTypeListItem('productCategory').title('Product Categories'),

      S.divider(),

      // Remaining document types (pages, blog posts, stores, promotions, persons)
      ...S.documentTypeListItems().filter(
        (listItem: any) => !HIDDEN_TYPES.includes(listItem.getId())
      ),

      S.divider(),

      // Settings Singleton
      S.listItem()
        .title('Site Settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        )
        .icon(CogIcon),
    ]);
