import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Number formatting utilities
export function formatNumber(
  value: number,
  format: 'number' | 'percentage' | 'currency' | 'duration' = 'number',
  compact = true
): string {
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;

    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: compact ? 'compact' : 'standard',
        maximumFractionDigits: 1,
      }).format(value);

    case 'duration':
      if (value < 60) return `${Math.round(value)}s`;
      if (value < 3600) return `${Math.round(value / 60)}m`;
      return `${Math.round(value / 3600)}h`;

    case 'number':
    default:
      if (!compact) {
        return new Intl.NumberFormat('en-US').format(value);
      }

      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toString();
  }
}

export function formatChangePercentage(change: number): string {
  const absChange = Math.abs(change);
  const sign = change >= 0 ? '+' : '-';
  return `${sign}${absChange.toFixed(1)}%`;
}

export function getChangeDescription(
  current: number,
  previous: number,
  format: 'number' | 'percentage' | 'currency' | 'duration' = 'number'
): string {
  const change = ((current - previous) / previous) * 100;
  const isIncrease = change > 0;
  const changeDirection = isIncrease ? 'increase' : 'decrease';

  const currentFormatted = formatNumber(current, format, false);
  const previousFormatted = formatNumber(previous, format, false);
  const changeFormatted = formatChangePercentage(change);

  return `${currentFormatted}, an ${changeDirection} of ${changeFormatted} from ${previousFormatted}`;
}

// Theme utilities
export function getChartColors(isDark = false) {
  return {
    primary: isDark ? 'hsl(210 40% 70%)' : 'hsl(210 40% 50%)',
    primaryFaded: isDark ? 'hsl(210 40% 40%)' : 'hsl(210 40% 80%)',
    secondary: isDark ? 'hsl(200 30% 60%)' : 'hsl(200 30% 40%)',
    background: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
    grid: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.9% 83.9%)',
    text: isDark ? 'hsl(0 0% 95%)' : 'hsl(240 10% 3.9%)',
  };
}
