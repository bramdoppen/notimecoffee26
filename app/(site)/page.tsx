import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageSections } from "@/components/sections/page-sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "No Time Coffee — Great coffee for people who live at full speed",
  description:
    "Specialty coffee in Amsterdam, Arnhem & Den Haag. Crafted with care, served at speed.",
};

export default async function HomePage() {
  // The homepage is a "page" document with slug "home" in Sanity
  const page = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug: "home" },
    tags: ["page"],
  });

  if (!page?.sections || page.sections.length === 0) {
    // Fallback for when CMS content isn't set up yet
    return (
      <div className="container-site py-24">
        <h1 className="text-5xl font-display text-espresso-600 mb-6">
          No Time Coffee
        </h1>
        <p className="text-lg text-stone max-w-2xl">
          Great coffee for people who live at full speed. Amsterdam · Arnhem · Den Haag
        </p>
        <p className="mt-8 text-sm text-pebble">
          Add a &quot;page&quot; document with slug &quot;home&quot; in Sanity Studio to populate this page.
        </p>
      </div>
    );
  }

  return <PageSections sections={page.sections} />;
}
