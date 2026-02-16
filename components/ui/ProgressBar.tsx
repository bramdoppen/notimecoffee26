interface ProgressBarProps {
  /** Value as percentage (0-100) */
  value: number;
  /** Tailwind background class for the filled portion */
  color?: string;
  /** Height variant */
  size?: 'sm' | 'md';
  /** Optional label shown to the right */
  label?: string;
  /** Tailwind text color for the label */
  labelColor?: string;
  /** Accessible label for screen readers (e.g. "Energielabel score") */
  ariaLabel?: string;
}

/**
 * Horizontal progress bar for scores, budget utilization, soft criteria.
 *
 * Server component — no interactivity.
 */
export function ProgressBar({
  value,
  color = 'bg-blue-500',
  size = 'sm',
  label,
  labelColor = 'text-gray-600',
  ariaLabel,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${heightClass} overflow-hidden rounded-full bg-gray-200`}>
        <div
          className={`${heightClass} rounded-full ${color} transition-all duration-500`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel ?? `${clampedValue}%`}
        />
      </div>
      {label && (
        <span className={`text-xs font-semibold ${labelColor} min-w-[3ch] text-right`}>
          {label}
        </span>
      )}
    </div>
  );
}
