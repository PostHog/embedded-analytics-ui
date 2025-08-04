import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from './ui/skeleton';
import { cn, formatNumber, getChartColors } from '../lib/utils';
import type { GraphResponse, ErrorResponse } from '../types/schemas';

interface GraphProps {
  data?: GraphResponse['data'];
  loading?: boolean;
  error?: ErrorResponse;
  className?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  unit?: string;
}

function CustomTooltip({ active, payload, label, unit }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const currentPeriod = payload.find(p => p.dataKey === 'value');
  const previousPeriod = payload.find(p => p.dataKey === 'previousValue');

  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="space-y-1">
        {currentPeriod && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentPeriod.color }}
            />
            <span className="text-sm">
              Current period:{' '}
              {formatNumber(currentPeriod.value, 'number', false)}
              {unit ? ` ${unit}` : ''}
            </span>
          </div>
        )}
        {previousPeriod && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: previousPeriod.color }}
            />
            <span className="text-sm">
              Previous period:{' '}
              {formatNumber(previousPeriod.value, 'number', false)}
              {unit ? ` ${unit}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function GraphSkeleton({
  height = 300,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn('analytics-metric-card', className)}>
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className={`w-full`} style={{ height }} />
      </div>
    </div>
  );
}

function GraphError({
  error,
  className,
}: {
  error: ErrorResponse;
  className?: string;
}) {
  return (
    <div className={cn('analytics-error', className)}>
      <p className="font-medium">Error loading chart</p>
      <p className="text-xs mt-1">{error.error}</p>
      {error.details && (
        <p className="text-xs mt-1 opacity-75">{error.details}</p>
      )}
    </div>
  );
}

export function Graph({
  data,
  loading = false,
  error,
  className,
  height = 300,
}: GraphProps) {
  const colors = getChartColors();

  const chartData = useMemo(() => {
    if (!data?.points) return [];

    return data.points.map(point => ({
      date: new Date(point.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      fullDate: point.date,
      value: point.value,
      previousValue: point.previousValue ?? null,
    }));
  }, [data?.points]);

  const hasCurrentData = chartData.some(
    d => d.value !== null && d.value !== undefined
  );
  const hasPreviousData = chartData.some(
    d => d.previousValue !== null && d.previousValue !== undefined
  );

  if (error) {
    return <GraphError error={error} className={className} />;
  }

  if (loading) {
    return <GraphSkeleton height={height} className={className} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return (
      <div className={cn('analytics-metric-card', className)}>
        <div className="flex items-center justify-center" style={{ height }}>
          <p className="text-muted-foreground">No chart data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('analytics-metric-card', className)}>
      <div className="space-y-4">
        {/* Header */}
        {data.title && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{data.title}</h3>
          </div>
        )}

        {/* Chart */}
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="currentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.lineColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.lineColor}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="previousGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.lineColorMuted}
                    stopOpacity={0.08}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.lineColorMuted}
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
                opacity={0.3}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: 'hsl(var(--chart-text))',
                  opacity: 0.7,
                }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: 'hsl(var(--chart-text))',
                  opacity: 0.7,
                }}
                tickFormatter={value => formatNumber(value, 'number', true)}
                dx={-10}
              />

              <RechartsTooltip
                content={<CustomTooltip unit={data.unit} />}
                cursor={{
                  stroke: 'hsl(var(--chart-primary))',
                  strokeWidth: 1,
                  strokeDasharray: '5 5',
                }}
              />

              {hasPreviousData && (
                <Area
                  type="monotone"
                  dataKey="previousValue"
                  stroke={colors.lineColorMuted}
                  strokeWidth={1.5}
                  fill="url(#previousGradient)"
                  strokeOpacity={0.15}
                  connectNulls={false}
                />
              )}

              {hasCurrentData && (
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.lineColor}
                  strokeWidth={3}
                  fill="url(#currentGradient)"
                  strokeOpacity={1}
                  connectNulls={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export type { GraphProps };
