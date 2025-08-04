import type { Meta, StoryObj } from '@storybook/react';
import { BigNumbers } from './BigNumbers';
import { Graph } from './Graph';
import { Table } from './Table';

const meta: Meta = {
  title: 'Analytics/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Complete analytics dashboard showcasing all components together.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Sample data
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
    key: 'conversion_rate',
    label: 'Conversion Rate',
    value: 3.45,
    previousValue: 3.12,
    changePercentage: 10.6,
    isIncreaseGood: true,
    format: 'percentage' as const,
  },
];

const generateDatePoints = (days: number) => {
  const points = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getTime());
    date.setDate(date.getDate() - i);

    const value = Math.round(1200 + Math.random() * 600);
    const previousValue = Math.round(value * (0.8 + Math.random() * 0.4));

    points.push({
      date: date.toISOString().split('T')[0],
      value,
      previousValue,
    });
  }

  return points;
};

const graphData = {
  title: 'Daily Visitors',
  metric: 'visitors',
  unit: 'visitors',
  points: generateDatePoints(14),
};

const tableData = {
  columns: [
    {
      key: 'breakdown_value',
      label: 'Page',
      type: 'string' as const,
      sortable: true,
    },
    {
      key: 'visitors',
      label: 'Visitors',
      type: 'number' as const,
      sortable: true,
    },
    {
      key: 'pageviews',
      label: 'Page Views',
      type: 'number' as const,
      sortable: true,
    },
    {
      key: 'bounce_rate',
      label: 'Bounce Rate',
      type: 'percentage' as const,
      sortable: true,
    },
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
      fillRatio: 0.59,
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
  ],
  count: 50,
  next: 'next-page-token',
  previous: null,
};

export const CompleteDashboard: Story = {
  render: () => (
    <div className="space-y-8 max-w-6xl">
      <div>
        <BigNumbers
          data={bigNumbersData}
          onNumberClick={key => console.log('Clicked:', key)}
        />
      </div>

      <div>
        <Graph data={graphData} height={300} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Pages</h2>
        <Table
          data={tableData}
          onRowClick={row => console.log('Clicked row:', row)}
          currentPage={1}
          pageSize={10}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A complete analytics dashboard showing how all components work together.',
      },
    },
  },
};

export const CompleteDashboardDark: Story = {
  render: () => (
    <div className="dark">
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="space-y-8 max-w-6xl">
          <div>
            <BigNumbers
              data={bigNumbersData}
              onNumberClick={key => console.log('Clicked:', key)}
            />
          </div>

          <div>
            <Graph data={graphData} height={300} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Pages</h2>
            <Table
              data={tableData}
              onRowClick={row => console.log('Clicked row:', row)}
              currentPage={1}
              pageSize={10}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A complete analytics dashboard in dark mode, demonstrating how semantic CSS variables adapt the theme.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-8 max-w-6xl">
      <div>
        <BigNumbers loading />
      </div>

      <div>
        <Graph loading height={300} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Paths</h2>
        <Table loading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All components in their loading states.',
      },
    },
  },
};

export const ErrorStates: Story = {
  render: () => (
    <div className="space-y-8 max-w-6xl">
      <div>
        <BigNumbers
          error={{
            error: 'Failed to load metrics',
            details: 'API connection error',
          }}
        />
      </div>

      <div>
        <Graph
          error={{
            error: 'Chart data unavailable',
            details: 'Service temporarily down',
          }}
          height={300}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Paths</h2>
        <Table
          error={{
            error: 'Table data failed to load',
            details: 'Database timeout',
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All components showing error states.',
      },
    },
  },
};
