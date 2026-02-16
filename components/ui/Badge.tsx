import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  /** Tailwind text color class, e.g. "text-emerald-700" */
  text?: string;
  /** Tailwind background class, e.g. "bg-emerald-50" */
  bg?: string;
  /** Pill shape (full radius) vs rounded rectangle */
  pill?: boolean;
  /** Small or default size */
  size?: 'sm' | 'md';
}

/**
 * Generic colored badge/pill component.
 *
 * Used for risk pills, budget status, renovation urgency, energy labels.
 * Pass Tailwind classes for colors — no hardcoded color logic here.
 *
 * Server component.
 */
export function Badge({
  children,
  text = 'text-gray-700',
  bg = 'bg-gray-100',
  pill = false,
  size = 'md',
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';
  const radiusClass = pill ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${sizeClasses} ${radiusClass} ${text} ${bg}`}
    >
      {children}
    </span>
  );
}
