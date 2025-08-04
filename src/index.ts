// Main components
export { BigNumbers } from './components/BigNumbers';
export { Graph } from './components/Graph';
export { Table } from './components/Table';

// Types and schemas
export type { BigNumbersProps } from './components/BigNumbers';

export type { GraphProps } from './components/Graph';

export type { TableProps } from './components/Table';

export type {
  QueryMeta,
  BigNumberItem,
  BigNumbersResponse,
  GraphDataPoint,
  GraphResponse,
  TableColumn,
  TableRow,
  TableResponse,
  AnalyticsResponse,
  ErrorResponse,
} from './types/schemas';

export {
  QueryMetaSchema,
  BigNumberItemSchema,
  BigNumbersResponseSchema,
  GraphDataPointSchema,
  GraphResponseSchema,
  TableColumnSchema,
  TableRowSchema,
  TableResponseSchema,
  AnalyticsResponseSchema,
  ErrorResponseSchema,
} from './types/schemas';

// Utility functions
export {
  cn,
  formatNumber,
  formatChangePercentage,
  getChangeDescription,
  getChartColors,
} from './lib/utils';

// Styles (consumers will need to import this)
import './styles/globals.css';
