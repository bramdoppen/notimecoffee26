import {
  CogIcon,
  HomeIcon,
  PinIcon,
  SearchIcon,
} from '@sanity/icons';
import type { StructureBuilder, StructureResolver } from 'sanity/structure';

// Types handled by custom structure or hidden from the default list
const HIDDEN_TYPES = [
  'siteSettings',
  'property',
  'neighborhood',
  'searchProfile',
  'assist.instruction.context',
];

const propertyStructure = (S: StructureBuilder) =>
  S.listItem()
    .title('Woningen')
    .icon(HomeIcon)
    .child(
      S.list()
        .title('Woningen')
        .items([
          S.listItem()
            .title('Beschikbaar')
            .child(
              S.documentList()
                .title('Beschikbare woningen')
                .filter(
                  '_type == "property" && listingStatus == "beschikbaar"'
                )
            ),
          S.listItem()
            .title('Favorieten ⭐')
            .child(
              S.documentList()
                .title('Favoriete woningen')
                .filter('_type == "property" && starred == true')
            ),
          S.listItem()
            .title('Onder bod / Verkocht')
            .child(
              S.documentList()
                .title('Onder bod / Verkocht')
                .filter(
                  '_type == "property" && listingStatus in ["onder_bod", "verkocht_onder_voorbehoud", "verkocht"]'
                )
            ),
          S.divider(),
          S.listItem()
            .title('Alle woningen')
            .icon(HomeIcon)
            .child(S.documentTypeList('property').title('Alle woningen')),
        ])
    );

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Aankoopmakelaar')
    .items([
      // Properties (custom nested structure)
      propertyStructure(S),

      // Search Profiles
      S.listItem()
        .title('Zoekprofielen')
        .icon(SearchIcon)
        .child(S.documentTypeList('searchProfile').title('Zoekprofielen')),

      // Neighborhoods
      S.listItem()
        .title('Buurten')
        .icon(PinIcon)
        .child(S.documentTypeList('neighborhood').title('Buurten')),

      S.divider(),

      // Remaining document types (pages, etc.)
      ...S.documentTypeListItems().filter(
        (listItem: any) => !HIDDEN_TYPES.includes(listItem.getId())
      ),

      S.divider(),

      // Settings Singleton
      S.listItem()
        .title('Site Instellingen')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        )
        .icon(CogIcon),
    ]);
