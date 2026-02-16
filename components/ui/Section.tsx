'use client';

import { useState, type ReactNode } from 'react';
import type { Confidence } from '@/lib/tier-config';
import { CONFIDENCE_UI } from '@/lib/tier-config';

interface SectionProps {
  title: string;
  icon?: string;
  confidence?: Confidence;
  defaultOpen?: boolean;
  badge?: ReactNode;
  children: ReactNode;
}

/**
 * Collapsible section with heading, optional confidence disclaimer.
 *
 * Behavior:
 * - Desktop (lg+): always open, header is a non-interactive div
 * - Mobile (<lg): collapsed by default, header is a button toggle
 *
 * Confidence rendering (from @designer):
 * - high: nothing shown (default = trustworthy)
 * - medium: subtle ⓘ icon with tooltip
 * - low: yellow banner above content
 *
 * Client component — needs state for collapse toggle.
 */
export function Section({
  title,
  icon,
  confidence = 'high',
  defaultOpen = false,
  badge,
  children,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const confidenceConfig = CONFIDENCE_UI[confidence];

  const headerContent = (
    <>
      <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
        {icon && <span>{icon}</span>}
        {title}
      </h3>

      {badge && <div className="ml-1">{badge}</div>}

      {/* Confidence indicator (medium only — ⓘ with tooltip) */}
      {confidenceConfig.showIndicator && !confidenceConfig.showBanner && (
        <span
          className={`${confidenceConfig.text} cursor-help text-sm`}
          title={confidenceConfig.tooltipText}
        >
          ⓘ
        </span>
      )}

      <span className="flex-1" />
    </>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop: non-interactive div */}
      <div className="hidden lg:flex items-center gap-3 px-6 py-4">
        {headerContent}
      </div>

      {/* Mobile: interactive button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-6 py-4 text-left lg:hidden"
        aria-expanded={isOpen}
      >
        {headerContent}

        {/* Chevron */}
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Content — collapsible on mobile, always visible on desktop */}
      <div
        className={`overflow-hidden transition-all duration-200 lg:max-h-none lg:opacity-100 ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Low confidence banner */}
        {confidenceConfig.showBanner && (
          <div
            className={`mx-6 mb-3 rounded-lg px-4 py-2.5 text-xs font-medium ${confidenceConfig.text} ${confidenceConfig.bg}`}
          >
            {confidenceConfig.bannerText}
          </div>
        )}

        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
