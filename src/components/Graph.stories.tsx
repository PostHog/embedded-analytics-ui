import type { Meta, StoryObj } from '@storybook/react';
import { Graph } from './Graph';

const meta: Meta<typeof Graph> = {
  title: 'Analytics/Graph',
  component: Graph,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Display linear area charts with current and previous period data.',
      },
    },
  },
  argTypes: {
    height: {
      control: { type: 'range', min: 200, max: 600, step: 50 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Graph>;

// Sample data for stories
const generateDatePoints = (
  days: number,
  baseValue: number,
  variance: number
) => {
  const points = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getTime());
    date.setDate(date.getDate() - i);

    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const value = Math.round(
      baseValue * randomFactor + (Math.random() - 0.5) * variance
    );
    const previousValue = Math.round(value * (0.75 + Math.random() * 0.5)); // Previous period variation

    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
      previousValue: Math.max(0, previousValue),
    });
  }

  return points;
};

const visitorsData = {
  title: 'Daily Visitors',
  metric: 'visitors',
  unit: 'visitors',
  points: generateDatePoints(14, 1500, 300),
};

const pageviewsData = {
  title: 'Page Views Over Time',
  metric: 'pageviews',
  unit: 'views',
  points: generateDatePoints(30, 5000, 1000),
};

const revenueData = {
  title: 'Daily Revenue',
  metric: 'revenue',
  unit: '$',
  points: generateDatePoints(7, 2500, 500),
};

export const Default: Story = {
  args: {
    data: visitorsData,
    loading: false,
    height: 300,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    height: 300,
  },
};

export const WithError: Story = {
  args: {
    error: {
      error: 'Failed to load chart data',
      details:
        'Unable to connect to analytics service. Please try again later.',
    },
    height: 300,
  },
};

export const WithoutPreviousData: Story = {
  args: {
    data: {
      ...visitorsData,
      points: visitorsData.points.map(point => ({
        date: point.date,
        value: point.value,
      })),
    },
    loading: false,
    height: 300,
  },
};

export const LongTimePeriod: Story = {
  args: {
    data: pageviewsData,
    loading: false,
    height: 400,
  },
};

export const ShortTimePeriod: Story = {
  args: {
    data: revenueData,
    loading: false,
    height: 300,
  },
};

export const TallChart: Story = {
  args: {
    data: visitorsData,
    loading: false,
    height: 500,
  },
};

export const CompactChart: Story = {
  args: {
    data: visitorsData,
    loading: false,
    height: 200,
  },
};

export const WithHighValues: Story = {
  args: {
    data: {
      title: 'High Volume Metrics',
      metric: 'impressions',
      unit: 'impressions',
      points: generateDatePoints(14, 50000, 15000),
    },
    loading: false,
    height: 350,
  },
};

export const WithLowValues: Story = {
  args: {
    data: {
      title: 'Low Volume Metrics',
      metric: 'conversions',
      unit: 'conversions',
      points: generateDatePoints(14, 25, 10),
    },
    loading: false,
    height: 300,
  },
};

export const NoTitle: Story = {
  args: {
    data: {
      metric: 'visitors',
      unit: 'visitors',
      points: visitorsData.points,
    },
    loading: false,
    height: 300,
  },
};

export const ZeroValues: Story = {
  args: {
    data: {
      title: 'Sparse Data',
      metric: 'events',
      unit: 'events',
      points: [
        { date: '2024-01-01', value: 0, previousValue: 0 },
        { date: '2024-01-02', value: 5, previousValue: 2 },
        { date: '2024-01-03', value: 0, previousValue: 0 },
        { date: '2024-01-04', value: 12, previousValue: 8 },
        { date: '2024-01-05', value: 3, previousValue: 1 },
        { date: '2024-01-06', value: 0, previousValue: 0 },
        { date: '2024-01-07', value: 15, previousValue: 10 },
      ],
    },
    loading: false,
    height: 300,
  },
};
