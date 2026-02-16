import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FooterNewsletterForm } from "./footer-newsletter-form";

type SocialLink = {
  platform: string;
  url: string;
};

type FooterProps = {
  siteName: string;
  tagline?: string;
  logo?: { asset: { url: string } };
  footerNavigation?: Array<{ label: string; url: string }>;
  footerText?: string;
  socialLinks?: SocialLink[];
  stores?: Array<{
    name: string;
    city: string;
    address: string;
    hours: Array<{ day: string; open: string; close: string; closed: boolean }>;
  }>;
};

const socialIcons: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  twitter: "X",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

function formatStoreHours(hours: Array<{ day: string; open: string; close: string; closed: boolean }>): string {
  const weekday = hours.find((h) => h.day === "monday");
  if (!weekday || weekday.closed) return "";
  return `${weekday.open}–${weekday.close}`;
}

function Footer({
  siteName,
  tagline,
  logo,
  footerNavigation,
  footerText,
  socialLinks,
  stores,
}: FooterProps) {
  return (
    <footer className="bg-forest-700 text-crema-200">
      <div className="container-site py-(--space-16)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-(--space-8)">
          {/* Brand Column */}
          <div className="space-y-(--space-4)">
            {logo ? (
              <Image
                src={logo.asset?.url ?? ""}
                alt={siteName}
                width={140}
                height={40}
                className="h-8 w-auto brightness-0 invert opacity-90"
              />
            ) : (
              <span className="font-display text-2xl text-crema-100">
                {siteName}
              </span>
            )}
            {tagline && (
              <p className="text-base text-sage-300">{tagline}</p>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-(--space-3)">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-400 hover:text-crema-100 transition-colors duration-(--transition-fast)"
                    aria-label={`Follow us on ${socialIcons[link.platform] || link.platform}`}
                  >
                    {socialIcons[link.platform] || link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Locations Column */}
          {stores && stores.length > 0 && (
            <div className="space-y-(--space-4)">
              <h3 className="font-body font-medium text-sm uppercase tracking-wider text-crema-100">
                Locations
              </h3>
              <div className="space-y-(--space-3)">
                {stores.map((store) => (
                  <div key={store.city} className="text-sm">
                    <p className="font-medium text-crema-100">{store.city}</p>
                    <p className="text-sage-300">{store.address}</p>
                    <p className="text-sage-400">{formatStoreHours(store.hours)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links Column */}
          {footerNavigation && footerNavigation.length > 0 && (
            <div className="space-y-(--space-4)">
              <h3 className="font-body font-medium text-sm uppercase tracking-wider text-crema-100">
                Quick Links
              </h3>
              <nav className="flex flex-col gap-(--space-2)" aria-label="Footer navigation">
                {footerNavigation.map((link) => (
                  <Link
                    key={link.label}
                    href={link.url}
                    className="text-sm text-sage-300 hover:text-crema-100 transition-colors duration-(--transition-fast)"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Newsletter Column */}
          <div className="space-y-(--space-4)">
            <h3 className="font-body font-medium text-sm uppercase tracking-wider text-crema-100">
              Stay in the Loop
            </h3>
            <p className="text-sm text-sage-300">
              New brews, events, and the occasional coffee wisdom.
            </p>
            <FooterNewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-forest-600">
        <div className="container-site py-(--space-4) flex flex-col sm:flex-row justify-between items-center gap-(--space-2)">
          <p className="text-sm text-sage-400">
            {footerText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
          </p>
          <div className="flex gap-(--space-4) text-sm text-sage-400">
            <Link href="/privacy" className="hover:text-crema-100 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-crema-100 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer, type FooterProps };
