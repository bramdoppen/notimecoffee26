/**
 * All GROQ queries for notimecoffee.
 *
 * Conventions:
 * - SCREAMING_SNAKE_CASE names
 * - defineQuery() wrapper for TypeGen
 * - Explicit projections (no ... spread)
 * - Parameters for variables (never string interpolation)
 * - One query per export
 *
 * Owner: @grind
 * Consumers: @roast (pages)
 * Schema source: @bean's content model
 */

import { defineQuery } from 'next-sanity';

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/** All website products — flat list, frontend handles grouping/filtering */
export const PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && available == true
  && surfaces.website == true
] | order(sortOrder asc, name asc) {
  _id,
  name,
  slug,
  description,
  price,
  priceVariants[] { label, price },
  image {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  },
  allergens,
  dietaryFlags,
  featured,
  category->{
    _id,
    name,
    slug,
    icon,
    sortOrder
  },
  availableAt[]->{
    _id,
    name,
    city
  }
}`);

/** Single product by slug */
export const PRODUCT_BY_SLUG_QUERY = defineQuery(`*[
  _type == "product"
  && slug.current == $slug
  && surfaces.website == true
][0] {
  _id,
  name,
  slug,
  description,
  price,
  priceVariants[] { label, price },
  image {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  },
  gallery[] {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  },
  allergens,
  dietaryFlags,
  category->{
    _id,
    name,
    slug,
    icon
  },
  availableAt[]->{
    _id,
    name,
    city
  },
  seo
}`);

/** Featured products for landing page / featuredMenuSection (autoFeatured mode) */
export const FEATURED_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && available == true
  && featured == true
  && surfaces.website == true
] | order(sortOrder asc) [0...$limit] {
  _id,
  name,
  slug,
  description,
  price,
  priceVariants[] { label, price },
  image {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  },
  category->{
    _id,
    name,
    slug,
    icon
  }
}`);

// ---------------------------------------------------------------------------
// Product Categories
// ---------------------------------------------------------------------------

/** All website product categories */
export const PRODUCT_CATEGORIES_QUERY = defineQuery(`*[
  _type == "productCategory"
  && surfaces.website == true
] | order(sortOrder asc) {
  _id,
  name,
  slug,
  icon,
  sortOrder,
  image {
    asset->{ _id, url, metadata { lqip } },
    alt
  },
  description
}`);

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------

/** All stores (no surface filter — stores are always public) */
export const STORES_QUERY = defineQuery(`*[
  _type == "store"
] | order(name asc) {
  _id,
  name,
  slug,
  city,
  address,
  zipCode,
  coordinates,
  phone,
  email,
  hours[] { day, open, close, closed },
  features,
  image {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  }
}`);

/** Single store by slug — includes gallery, specialHours, description */
export const STORE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "store"
  && slug.current == $slug
][0] {
  _id,
  name,
  slug,
  city,
  address,
  zipCode,
  coordinates,
  phone,
  email,
  hours[] { day, open, close, closed },
  specialHours[] { date, label, open, close, closed },
  features,
  image {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    hotspot,
    crop
  },
  gallery[] {
    asset->{ _id, url, metadata { lqip, dimensions } },
    alt,
    caption
  },
  description,
  seo
}`);

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

/** All blog posts — listing view */
export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "blogPost"
] | order(publishedAt desc) {
  _id,
  title,
  slug,
  author,
  publishedAt,
  excerpt,
  categories,
  mainImage {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  }
}`);

/** Single blog post by slug — full content with portable text embeds resolved */
export const BLOG_POST_BY_SLUG_QUERY = defineQuery(`*[
  _type == "blogPost"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  author,
  publishedAt,
  excerpt,
  categories,
  mainImage {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  },
  body[] {
    ...,
    _type == "image" => {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt,
      caption
    },
    _type == "productEmbed" => {
      product->{
        _id,
        name,
        slug,
        price,
        image {
          asset->{ _id, url, metadata { lqip } },
          alt
        },
        category->{ name, slug }
      }
    },
    _type == "storeEmbed" => {
      store->{
        _id,
        name,
        slug,
        city,
        address,
        image {
          asset->{ _id, url, metadata { lqip } },
          alt
        }
      }
    },
    _type == "ctaButton" => {
      text,
      url,
      style
    },
    markDefs[] {
      ...,
      _type == "link" => {
        href,
        openInNewTab
      }
    }
  },
  relatedPosts[]->{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage {
      asset->{ _id, url, metadata { lqip } },
      alt
    }
  },
  seo
}`);

// ---------------------------------------------------------------------------
// Pages (Section Builder)
// ---------------------------------------------------------------------------

/** Page by slug — resolves all section types with their data */
export const PAGE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "page"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  sections[] {
    _type,
    _key,
    _type == "heroSection" => {
      headline,
      subheadline,
      backgroundImage {
        asset->{ _id, url, metadata { lqip, dimensions } },
        alt,
        hotspot,
        crop
      },
      backgroundVideo,
      ctaText,
      ctaLink,
      style
    },
    _type == "textSection" => {
      heading,
      body[] {
        ...,
        markDefs[] { ..., _type == "link" => { href, openInNewTab } },
        _type == "productEmbed" => {
          product->{ _id, name, slug, price, image { asset->{ _id, url }, alt } }
        },
        _type == "storeEmbed" => {
          store->{ _id, name, slug, city, image { asset->{ _id, url }, alt } }
        }
      },
      alignment
    },
    _type == "featuredMenuSection" => {
      heading,
      autoFeatured,
      maxItems,
      items[]->{
        _id,
        name,
        slug,
        price,
        priceVariants[] { label, price },
        image { asset->{ _id, url, metadata { lqip } }, alt },
        category->{ name, slug, icon }
      }
    },
    _type == "storeListSection" => {
      heading,
      showMap
    },
    _type == "imageGallerySection" => {
      heading,
      images[] {
        asset->{ _id, url, metadata { lqip, dimensions } },
        alt,
        caption,
        hotspot,
        crop
      },
      layout
    },
    _type == "ctaSection" => {
      heading,
      body,
      buttonText,
      buttonLink,
      backgroundImage {
        asset->{ _id, url, metadata { lqip } },
        hotspot,
        crop
      },
      style
    },
    _type == "testimonialSection" => {
      heading,
      testimonials[] { quote, author, role }
    },
    _type == "newsletterSection" => {
      heading,
      description,
      buttonText
    }
  },
  seo
}`);

// ---------------------------------------------------------------------------
// Site Settings (Singleton)
// ---------------------------------------------------------------------------

/** Global site settings — nav, footer, branding, announcement bar (singleton) */
export const SITE_SETTINGS_QUERY = defineQuery(`*[
  _id == "siteSettings"
][0] {
  siteName,
  tagline,
  description,
  logo {
    asset->{ _id, url }
  },
  logoDark {
    asset->{ _id, url }
  },
  favicon {
    asset->{ _id, url }
  },
  mainNavigation[] {
    _key,
    label,
    linkType,
    externalUrl,
    internalLink->{
      _type,
      "slug": slug.current
    },
    children[] {
      _key,
      label,
      linkType,
      externalUrl,
      internalLink->{
        _type,
        "slug": slug.current
      }
    }
  },
  footerNavigation[] { label, url },
  footerText,
  socialLinks[] { platform, url },
  orderingEnabled,
  announcementBar {
    enabled,
    message,
    link,
    linkText,
    backgroundColor
  },
  defaultSeo
}`);

// ---------------------------------------------------------------------------
// Promotions (Future-ready)
// ---------------------------------------------------------------------------

/** Active promotions for website — date-filtered */
export const ACTIVE_PROMOTIONS_QUERY = defineQuery(`*[
  _type == "promotion"
  && active == true
  && surfaces.website == true
  && (startDate == null || startDate <= now())
  && (endDate == null || endDate >= now())
] {
  _id,
  headline,
  description,
  image {
    asset->{ _id, url, metadata { lqip, dimensions } },
    alt
  },
  products[]->{
    _id,
    name,
    slug,
    price,
    image { asset->{ _id, url }, alt }
  },
  stores[]->{
    _id,
    name,
    city
  }
}`);
