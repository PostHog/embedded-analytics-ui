import React, { useState } from 'react';
import { BigNumbers, Graph, Table } from '@posthog/embedded-analytics-ui';
import '@posthog/embedded-analytics-ui/dist/index.esm.css';

// Example data
const bigNumbersData = [
  {
    key: 'visitors',
    label: 'Unique Visitors',
    value: 12453,
    previousValue: 10234,
    changePercentage: 21.7,
    isIncreaseGood: true,
    format: 'number' as const,
  },
  {
    key: 'pageviews',
    label: 'Page Views',
    value: 45678,
    previousValue: 39123,
    changePercentage: 16.8,
    isIncreaseGood: true,
    format: 'number' as const,
  },
  {
    key: 'bounce_rate',
    label: 'Bounce Rate',
    value: 34.2,
    previousValue: 41.1,
    changePercentage: -16.8,
    isIncreaseGood: false,
    format: 'percentage' as const,
  },
  {
    key: 'avg_session',
    label: 'Avg Session Duration',
    value: 142,
    previousValue: 138,
    changePercentage: 2.9,
    isIncreaseGood: true,
    format: 'duration' as const,
  },
];

const graphData = {
  title: 'Daily Visitors',
  metric: 'visitors',
  unit: 'visitors',
  points: [
    { date: '2024-01-01', value: 1200, previousValue: 1100 },
    { date: '2024-01-02', value: 1350, previousValue: 1250 },
    { date: '2024-01-03', value: 1150, previousValue: 1300 },
    { date: '2024-01-04', value: 1450, previousValue: 1200 },
    { date: '2024-01-05', value: 1600, previousValue: 1450 },
    { date: '2024-01-06', value: 1750, previousValue: 1600 },
    { date: '2024-01-07', value: 1520, previousValue: 1400 },
  ],
};

const tableData = {
  columns: [
    { key: 'breakdown_value', label: 'Page', type: 'string' as const, sortable: true },
    { key: 'visitors', label: 'Visitors', type: 'number' as const, sortable: true },
    { key: 'pageviews', label: 'Page Views', type: 'number' as const, sortable: true },
    { key: 'bounce_rate', label: 'Bounce Rate', type: 'percentage' as const, sortable: true },
  ],
  rows: [
    {
      breakdown_value: '/home',
      visitors: 5420,
      pageviews: 8230,
      bounce_rate: 23.4,
      fillRatio: 1.0,
    },
    {
      breakdown_value: '/about',
      visitors: 3210,
      pageviews: 4560,
      bounce_rate: 31.2,
      fillRatio: 0.6,
    },
    {
      breakdown_value: '/products',
      visitors: 2840,
      pageviews: 5120,
      bounce_rate: 28.7,
      fillRatio: 0.52,
    },
    {
      breakdown_value: '/contact',
      visitors: 1680,
      pageviews: 2340,
      bounce_rate: 45.1,
      fillRatio: 0.31,
    },
    {
      breakdown_value: '/blog',
      visitors: 980,
      pageviews: 1450,
      bounce_rate: 38.9,
      fillRatio: 0.18,
    },
  ],
  count: 150,
  next: 'next-page-token',
  previous: null,
};

export default function AnalyticsExample() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentSort, setCurrentSort] = useState<{column: string, direction: 'asc' | 'desc'}>({
    column: 'visitors',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleMetricClick = (key: string) => {
    console.log('Metric clicked:', key);
    alert(`Clicked metric: ${key}`);
  };

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    alert(`Clicked page: ${row.breakdown_value}`);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setCurrentSort({ column, direction });
    console.log('Sort changed:', column, direction);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className={`min-h-screen p-8 space-y-8 ${darkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="space-x-4">
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            >
              {darkMode ? 'Light' : 'Dark'} Mode
            </button>
            <button 
              onClick={simulateLoading}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground"
            >
              Simulate Loading
            </button>
          </div>
        </div>

        {/* Big Numbers */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <BigNumbers 
            data={bigNumbersData}
            loading={loading}
            onNumberClick={handleMetricClick}
          />
        </section>

        {/* Graph */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Visitor Trends</h2>
          <Graph 
            data={graphData}
            loading={loading}
            height={300}
          />
        </section>

        {/* Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Top Pages</h2>
          <Table
            data={tableData}
            loading={loading}
            onRowClick={handleRowClick}
            onSort={handleSort}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            currentSort={currentSort}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </section>
      </div>
    </div>
  );
}