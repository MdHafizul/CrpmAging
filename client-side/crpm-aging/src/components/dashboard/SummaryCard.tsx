import React from 'react';
import Card from '../ui/Card';

interface SummaryItem {
  title: string;
  value: string | number;
  percentChange?: number;
  icon: React.ReactNode;
}

interface SummaryCardsProps {
  data: SummaryItem[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {data.map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              {item.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
              <div className="flex items-baseline">
                <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                {item.percentChange !== undefined && (
                  <span className={`ml-2 text-xs font-medium ${item.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.percentChange >= 0 ? '+' : ''}{item.percentChange}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;