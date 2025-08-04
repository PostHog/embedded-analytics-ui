import { z } from 'zod';

// Base query metadata that's common across all response types
export const QueryMetaSchema = z.object({
  dateRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  previousDateRange: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .optional(),
});

// BigNumbers schema
export const BigNumberItemSchema = z.object({
  key: z.string(),
  label: z.string().optional(), // Human readable label
  value: z.number(),
  previousValue: z.number().optional(),
  changePercentage: z.number().optional(),
  isIncreaseGood: z.boolean().default(true), // Whether an increase is considered positive
  format: z
    .enum(['number', 'percentage', 'currency', 'duration'])
    .default('number'),
});

export const BigNumbersResponseSchema = z.object({
  type: z.literal('big_numbers'),
  data: z.array(BigNumberItemSchema),
  meta: QueryMetaSchema,
});

// Graph schema
export const GraphDataPointSchema = z.object({
  date: z.string(), // ISO date string
  value: z.number(),
  previousValue: z.number().optional(), // Value from previous period
});

export const GraphResponseSchema = z.object({
  type: z.literal('graph'),
  data: z.object({
    title: z.string().optional(),
    metric: z.string(), // e.g., "visitors", "pageviews"
    unit: z.string().optional(), // e.g., "visitors", "%"
    points: z.array(GraphDataPointSchema),
  }),
  meta: QueryMetaSchema,
});

// Table schema
export const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'percentage']).default('string'),
  sortable: z.boolean().default(true),
});

export const TableRowSchema = z
  .object({
    breakdown_value: z.string(), // The main identifier for the row
    fillRatio: z.number().min(0).max(1).optional(), // 0-1 for horizontal fill bar
  })
  .catchall(z.union([z.string(), z.number()])); // Allow any additional columns

export const TableResponseSchema = z.object({
  type: z.literal('table'),
  data: z.object({
    columns: z.array(TableColumnSchema),
    rows: z.array(TableRowSchema),
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  }),
  meta: QueryMetaSchema,
});

// Union type for all response types
export const AnalyticsResponseSchema = z.discriminatedUnion('type', [
  BigNumbersResponseSchema,
  GraphResponseSchema,
  TableResponseSchema,
]);

// TypeScript types
export type QueryMeta = z.infer<typeof QueryMetaSchema>;
export type BigNumberItem = z.infer<typeof BigNumberItemSchema>;
export type BigNumbersResponse = z.infer<typeof BigNumbersResponseSchema>;
export type GraphDataPoint = z.infer<typeof GraphDataPointSchema>;
export type GraphResponse = z.infer<typeof GraphResponseSchema>;
export type TableColumn = z.infer<typeof TableColumnSchema>;
export type TableRow = z.infer<typeof TableRowSchema>;
export type TableResponse = z.infer<typeof TableResponseSchema>;
export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;

// Error types
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
