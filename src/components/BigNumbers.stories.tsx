import type { Meta, StoryObj } from '@storybook/react';
import { BigNumbers } from './BigNumbers';

const meta: Meta<typeof BigNumbers> = {
  title: 'Analytics/BigNumbers',
  component: BigNumbers,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Display key metrics with change indicators and tooltips.',
      },
    },
  },
  argTypes: {
    onNumberClick: { action: 'number clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof BigNumbers>;

// Sample data for stories
const sampleData = [
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
  {
    key: 'conversion_rate',
    label: 'Conversion Rate',
    value: 3.12,
    previousValue: 3.45,
    changePercentage: -10.6,
    isIncreaseGood: true,
    format: 'percentage' as const,
  },
  {
    key: 'revenue',
    label: 'Revenue',
    value: 15234.5,
    previousValue: 12987.25,
    changePercentage: 17.3,
    isIncreaseGood: true,
    format: 'currency' as const,
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    error: {
      error: 'Failed to load metrics',
      details: 'Network connection error. Please try again.',
    },
  },
};

export const WithoutPreviousData: Story = {
  args: {
    data: sampleData.map(item => ({
      ...item,
      previousValue: undefined,
      changePercentage: undefined,
    })),
    loading: false,
  },
};

export const Mixed: Story = {
  args: {
    data: [
      ...sampleData.slice(0, 2),
      {
        key: 'no_change',
        label: 'Static Metric',
        value: 1000,
        previousValue: 1000,
        changePercentage: 0,
        isIncreaseGood: true,
        format: 'number' as const,
      },
      ...sampleData.slice(2, 4),
    ],
    loading: false,
  },
};

export const SingleMetric: Story = {
  args: {
    data: [sampleData[0]],
    loading: false,
  },
};

export const LargeNumbers: Story = {
  args: {
    data: [
      {
        key: 'big_number',
        label: 'Very Large Number',
        value: 2847593821,
        previousValue: 2234567123,
        changePercentage: 27.4,
        isIncreaseGood: true,
        format: 'number' as const,
      },
      {
        key: 'small_number',
        label: 'Small Number',
        value: 23,
        previousValue: 18,
        changePercentage: 27.8,
        isIncreaseGood: true,
        format: 'number' as const,
      },
    ],
    loading: false,
  },
};

export const WithClickHandlers: Story = {
  args: {
    data: sampleData.slice(0, 4),
    loading: false,
    onNumberClick: (key: string) => {
      alert(`Clicked on ${key}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on any metric card to see the click handler in action.',
      },
    },
  },
};
