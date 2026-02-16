"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  _key: string;
  label: string;
  linkType: "internal" | "external";
  externalUrl?: string;
  internalLink?: { _type: string; slug: string };
  children?: NavItem[];
};

type HeaderProps = {
  siteName: string;
  logo?: { asset: { url: string } };
  navigation: NavItem[];
  transparent?: boolean;
  hasAnnouncement?: boolean;
};

function resolveNavHref(item: NavItem): string {
  if (item.linkType === "external" && item.externalUrl) {
    return item.externalUrl;
  }
  if (item.internalLink) {
    const { _type, slug } = item.internalLink;
    if (_type === "blogPost") return `/blog/${slug}`;
    if (slug === "home") return "/";
    return `/${slug}`;
  }
  return "/";
}

function Header({ siteName, logo, navigation, transparent = false, hasAnnouncement = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const showSolid = !transparent || scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-(--transition-base)",
          hasAnnouncement ? "top-10" : "top-0",
          showSolid
            ? "bg-crema-50/95 backdrop-blur-md border-b border-mist"
            : "bg-transparent"
        )}
      >
        <div className="container-site flex items-center justify-between h-(--header-height)">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            {logo ? (
              <Image
                src={logo.asset?.url ?? ""}
                alt={siteName}
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
              />
            ) : (
              <span className="font-display text-xl text-espresso-600">
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-(--space-8)" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item._key}
                href={resolveNavHref(item)}
                className={cn(
                  "text-base font-medium transition-colors duration-(--transition-fast)",
                  "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-forest-600 after:transition-all after:duration-(--transition-base)",
                  "hover:text-forest-600 hover:after:w-full",
                  showSolid ? "text-espresso-600" : "text-espresso-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button variant="primary" size="sm">
              Find a Store
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={cn(
                  "block h-0.5 w-6 bg-espresso-600 transition-all duration-(--transition-base) origin-center",
                  mobileOpen && "rotate-45 translate-y-[9px]"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-espresso-600 transition-opacity duration-(--transition-fast)",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-espresso-600 transition-all duration-(--transition-base) origin-center",
                  mobileOpen && "-rotate-45 -translate-y-[9px]"
                )}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-crema-50 transition-all duration-(--transition-slow) lg:hidden",
          hasAnnouncement ? "pt-[calc(var(--header-height)+2.5rem)]" : "pt-(--header-height)",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav
          className="container-site flex flex-col items-center justify-center h-full gap-(--space-6) -mt-(--header-height)"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item._key}
              href={resolveNavHref(item)}
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl text-espresso-600 hover:text-forest-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-(--space-4)">
            <Button variant="primary" size="lg" onClick={() => setMobileOpen(false)}>
              Find a Store
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}

export { Header, type HeaderProps };
