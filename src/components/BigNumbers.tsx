import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Skeleton } from './ui/skeleton';
import { cn } from '../lib/utils';
import {
  formatNumber,
  formatChangePercentage,
  getChangeDescription,
} from '../lib/utils';
import type { BigNumberItem, ErrorResponse } from '../types/schemas';

interface BigNumbersProps {
  data?: BigNumberItem[];
  loading?: boolean;
  error?: ErrorResponse;
  className?: string;
  onNumberClick?: (key: string) => void;
}

interface BigNumberCardProps {
  item: BigNumberItem;
  onClick?: (key: string) => void;
  className?: string;
}

function BigNumberCard({ item, onClick, className }: BigNumberCardProps) {
  const {
    key,
    label,
    value,
    previousValue,
    changePercentage,
    isIncreaseGood,
    format,
  } = item;

  const isClickable = onClick !== undefined;
  const hasChange =
    previousValue !== undefined && changePercentage !== undefined;
  const isPositiveChange = hasChange && changePercentage > 0;
  const isNeutralChange = hasChange && changePercentage === 0;

  // Determine the sentiment color
  let changeColorClass = 'analytics-metric-neutral';
  if (hasChange && !isNeutralChange) {
    const isGoodChange =
      (isPositiveChange && isIncreaseGood) ||
      (!isPositiveChange && !isIncreaseGood);
    changeColorClass = isGoodChange
      ? 'analytics-metric-positive'
      : 'analytics-metric-negative';
  }

  const handleClick = () => {
    if (isClickable) {
      onClick(key);
    }
  };

  const renderTrendIcon = () => {
    if (!hasChange || isNeutralChange) {
      return <Minus className="h-4 w-4" />;
    }
    return isPositiveChange ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  const tooltipContent =
    hasChange && previousValue !== undefined
      ? getChangeDescription(value, previousValue, format)
      : formatNumber(value, format, false);

  const content = (
    <div
      className={cn(
        'analytics-metric-card',
        isClickable && 'cursor-pointer hover:bg-accent/50 transition-colors',
        className
      )}
      onClick={handleClick}
    >
      <div className="space-y-2">
        {/* Label */}
        <div className="text-sm text-muted-foreground">
          {label ||
            key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>

        {/* Main Value */}
        <div className="text-2xl font-bold tabular-nums">
          {formatNumber(value, format, true)}
        </div>

        {/* Change Indicator */}
        {hasChange && (
          <div
            className={cn('flex items-center gap-1 text-sm', changeColorClass)}
          >
            {renderTrendIcon()}
            <span className="tabular-nums">
              {formatChangePercentage(changePercentage)}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function BigNumberCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('analytics-metric-card', className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

function BigNumbersError({
  error,
  className,
}: {
  error: ErrorResponse;
  className?: string;
}) {
  return (
    <div className={cn('analytics-error', className)}>
      <p className="font-medium">Error loading metrics</p>
      <p className="text-xs mt-1">{error.error}</p>
      {error.details && (
        <p className="text-xs mt-1 opacity-75">{error.details}</p>
      )}
    </div>
  );
}

export function BigNumbers({
  data,
  loading = false,
  error,
  className,
  onNumberClick,
}: BigNumbersProps) {
  if (error) {
    return <BigNumbersError error={error} className={className} />;
  }

  if (loading) {
    return (
      <div
        className={cn(
          'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          className
        )}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <BigNumberCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('analytics-error', className)}>
        <p>No metrics available</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {data.map(item => (
        <BigNumberCard key={item.key} item={item} onClick={onNumberClick} />
      ))}
    </div>
  );
}

export type { BigNumbersProps };
