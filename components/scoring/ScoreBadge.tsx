import { TIER_UI } from '@/lib/tier-config';
import { formatScore } from '@/lib/format';
import type { Tier } from '@/lib/scoring-labels';

interface ScoreBadgeProps {
  score: number;
  tier: Tier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  /** Card: 'vertical' (label below). Detail hero: 'horizontal' (label beside). */
  layout?: 'horizontal' | 'vertical';
}

const SIZE_CLASSES = {
  sm: 'h-10 w-10 text-base', // 40px
  md: 'h-12 w-12 text-lg', // 48px
  lg: 'h-[4.5rem] w-[4.5rem] text-[1.75rem]', // 72px
} as const;

/**
 * Circular score badge — the visual hero of every property card.
 *
 * Renders a colored circle with the numeric score inside.
 * Color is determined by tier, not by score value directly.
 *
 * Layout variants:
 * - horizontal (default): label beside badge — for detail hero
 * - vertical: label below badge — for property card
 *
 * Server component — no interactivity needed.
 */
export function ScoreBadge({
  score,
  tier,
  size = 'md',
  showLabel = false,
  layout = 'horizontal',
}: ScoreBadgeProps) {
  const config = TIER_UI[tier];

  const containerClass =
    layout === 'vertical'
      ? 'flex flex-col items-center gap-1'
      : 'flex items-center gap-2.5';

  return (
    <div className={containerClass}>
      <div
        className={`${SIZE_CLASSES[size]} ${config.badgeBg} rounded-full flex items-center justify-center font-bold text-white shadow-md`}
        aria-label={`Score: ${formatScore(score)} — ${config.label}`}
      >
        {formatScore(score)}
      </div>
      {showLabel && (
        <div className={layout === 'vertical' ? 'text-center' : ''}>
          <div className={`text-sm font-semibold ${config.text}`}>
            {config.emoji} {config.label}
          </div>
        </div>
      )}
    </div>
  );
}
