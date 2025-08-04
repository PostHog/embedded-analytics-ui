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
export function getChartColors() {
  // Get CSS custom property values from the document root
  const getCustomProperty = (property: string) => {
    if (typeof window !== 'undefined') {
      const style = getComputedStyle(document.documentElement);
      const value = style.getPropertyValue(property).trim();
      return value ? `hsl(${value})` : '';
    }
    return '';
  };

  return {
    primary: getCustomProperty('--ph-embed-chart-primary'),
    secondary: getCustomProperty('--ph-embed-chart-secondary'),
    background: getCustomProperty('--ph-embed-chart-background'),
    grid: getCustomProperty('--ph-embed-chart-grid'),
    text: getCustomProperty('--ph-embed-chart-text'),
    lineColor: getCustomProperty('--ph-embed-chart-line-color'),
    lineColorMuted: getCustomProperty('--ph-embed-chart-line-color-muted'),
    gradientStart: getCustomProperty('--ph-embed-chart-gradient-start'),
    gradientEnd: getCustomProperty('--ph-embed-chart-gradient-end'),
  };
}
