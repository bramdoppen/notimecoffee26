// GROQ queries — to be expanded by @grind
// All queries use SCREAMING_SNAKE_CASE
// See data-layer-spec on the board for full query definitions

export const SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;

export const PRODUCTS_QUERY = `*[_type == "product" && available == true] | order(sortOrder asc)`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]`;

export const PRODUCT_CATEGORIES_QUERY = `*[_type == "productCategory"] | order(sortOrder asc)`;

export const STORES_QUERY = `*[_type == "store"]`;

export const STORE_BY_SLUG_QUERY = `*[_type == "store" && slug.current == $slug][0]`;

export const POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc)`;

export const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]`;

export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && featured == true && available == true] | order(sortOrder asc) [0...$limit]`;

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]`;
