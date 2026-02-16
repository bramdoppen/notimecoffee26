import { sanityFetch } from "@/sanity/lib/fetch";
import { SETTINGS_QUERY } from "@/sanity/lib/queries";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch site settings for nav, footer, and announcement bar
  // This runs once per layout render and is cached via ISR
  const settings = await sanityFetch<any>({
    query: SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  const navigation = settings?.mainNavigation ?? [];
  const footerNavigation = settings?.footerNavigation ?? [];
  const socialLinks = settings?.socialLinks ?? [];
  const announcement = settings?.announcementBar;

  return (
    <>
      {announcement?.enabled && (
        <AnnouncementBar
          message={announcement.message}
          link={announcement.link}
          linkText={announcement.linkText}
          backgroundColor={announcement.backgroundColor}
        />
      )}
      <Header
        navigation={navigation}
        logo={settings?.logo}
        siteName={settings?.siteName ?? "No Time Coffee"}
        hasAnnouncement={!!announcement?.enabled}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        footerNavigation={footerNavigation}
        socialLinks={socialLinks}
        siteName={settings?.siteName ?? "No Time Coffee"}
        tagline={settings?.tagline}
        footerText={settings?.footerText}
      />
    </>
  );
}
