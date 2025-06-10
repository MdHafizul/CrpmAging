import React from 'react';
import { Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../../ui/Card';

interface SummaryChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const SummaryChart: React.FC<SummaryChartProps> = ({ data }) => {
  // Ensure all data entries have a color (use a default if missing)
  const processedData = data.map(item => ({
    ...item,
    color: item.color || '#6366F1' // Default color if missing
  }));

  // Format the tooltip value
  const formatTooltipValue = (value: number) => {
    return `RM ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{formatTooltipValue(payload[0].value)}</span>
          </p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / processedData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Summary Dashboard">
      <div className="grid grid-cols-1 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatTooltipValue} />
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Bar dataKey="value">
                {processedData.map((entry, index) => (
                  <Cell key={`column-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatTooltipValue} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value) => formatTooltipValue(value as number)} />
              <Bar dataKey="value">
                {processedData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default SummaryChart;