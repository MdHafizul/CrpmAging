import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatter';

interface PieChartData {
  name: string;
  value: number;
  numOfAcc: number;
  color: string;
  subCategories?: PieChartData[];
}

interface SummaryCardProps {
  title: string;
  data: PieChartData[];
  totalValue: number;
  totalAccounts: number;
  icon?: React.ReactNode;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  data,
  totalValue,
  totalAccounts,
  icon,
  className = ""
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0';
      
      return (
        <div className="bg-white p-4 shadow-2xl rounded-xl border border-gray-200 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.payload?.color || item.color }}></div>
            <p className="font-bold text-gray-900 text-base">{item.name || label}</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(item.value)}
            </p>
            <p className="text-sm text-gray-600 font-medium">
              {item.payload?.numOfAcc?.toLocaleString() || 'N/A'} accounts
            </p>
            <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              {percentage}% of total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Chart renderer - only pie chart
  const renderChart = () => {
    // For chart, we need to flatten the data - only showing main categories
    const chartData = data.filter(item => item.value > 0);

    if (!chartData.length) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium">No data available</p>
          </div>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {chartData.map((entry, index) => (
              <filter key={index} id={`shadow-${index}`}>
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" floodColor={entry.color} />
              </filter>
            ))}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
            stroke="white"
            strokeWidth={3}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                filter={`url(#shadow-${index})`}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const validData = data.filter(item => item.value > 0);

  return (
    <Card className={`h-auto min-h-[400px] ${className}`}>
      <div className="space-y-6">
        {/* Header with metrics */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {formatCurrency(totalValue)}
                  </span>
                  <div className="text-sm text-gray-500">
                    <div>{totalAccounts.toLocaleString()} accounts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Distribution Analysis</h4>
            <div className="text-sm text-gray-500">
              {validData.length} categories • Total: {formatCurrency(totalValue, 0, 0)}
            </div>
          </div>
          <div className="h-80 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
            {renderChart()}
          </div>
        </div>

        {/* Clean redesign of categories display */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {validData.map((item, index) => {
            const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0.0';
            const hasSubcategories = item.subCategories && item.subCategories.length > 0;
            const isCurrentMonth = item.name === 'Total Current Month';
            
            return (
              <div key={index} className={`rounded-lg overflow-hidden ${isCurrentMonth ? 'border border-blue-200' : 'border border-gray-200'}`}>
                {/* Main category header */}
                <div className={`p-4 ${isCurrentMonth ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      {isCurrentMonth && (
                        <span className="ml-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          With Sub Categories
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{formatCurrency(item.value, 0, 0)}</p>
                      <p className="text-xs text-gray-500">{item.numOfAcc.toLocaleString()} accounts • {percentage}% of total</p>
                    </div>
                  </div>
                  
                  {/* Breakdown summary for Current Month */}
                  {isCurrentMonth && item.subCategories && (
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <div className="text-blue-700">SubCategories:</div>
                      {item.subCategories.map((sub, i) => {
                        const subPercentage = ((sub.value / item.value) * 100).toFixed(0);
                        return (
                          <div key={i} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }}></div>
                            <span>{sub.name}: {subPercentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Subcategories in a clean table format */}
                {hasSubcategories && item.subCategories && (
                  <div className="bg-white">
                    {item.subCategories.map((subItem, subIndex) => {
                      const subPercentage = item.value > 0 ? ((subItem.value / item.value) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={`sub-${index}-${subIndex}`} 
                            className={`border-t border-gray-100 p-4 ${subIndex === 0 ? 'border-t-0' : ''}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subItem.color }}></div>
                              <div>
                                <div className="font-medium text-gray-700">{subItem.name}</div>
                                <div className="text-xs text-gray-500">{subItem.numOfAcc.toLocaleString()} accounts</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{formatCurrency(subItem.value, 0, 0)}</div>
                              <div className="text-xs text-blue-600">{subPercentage}% of {item.name}</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                            <div 
                              className="h-1.5 rounded-full" 
                              style={{ width: `${subPercentage}%`, backgroundColor: subItem.color }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

// Enhanced container for the three summary cards
interface SummaryCardsContainerProps {
  summaryData: any;
}

export const SummaryCardsContainer: React.FC<SummaryCardsContainerProps> = ({ summaryData }) => {
  if (!summaryData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-96">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Ensure all values are positive numbers
  const safeValue = (value: number | undefined | null) => Math.max(0, value || 0);
  const safeCount = (count: number | undefined | null) => Math.max(0, count || 0);

  // Calculate the main total aged debt (Active + Inactive) - this will be consistent across cards
  const totalAgedDebt = safeValue(summaryData.active) + safeValue(summaryData.inactive);
  const totalAgedDebtAccounts = safeCount(summaryData.activeNumOfAccounts) + safeCount(summaryData.inactiveNumOfAccounts);

  // Card 1: Trade Receivable
  const totalUndue = safeValue(summaryData.totalUnpaid);
  const totalUndueAccounts = safeCount(summaryData.totalUnpaidNumOfAccounts);
  const currentMonthUnpaid = safeValue(summaryData.currentMonthUnpaid);
  const currentMonthUnpaidAccounts = safeCount(summaryData.currentMonthUnpaidNumOfAccounts);
  
  // Calculate total current month (sum of Total Undue and Current Month Unpaid)
  const totalCurrentMonth = totalUndue + currentMonthUnpaid;
  const totalCurrentMonthAccounts = totalUndueAccounts + currentMonthUnpaidAccounts;
  
  const tradeReceivableData = [
    {
      name: 'Total Current Month',
      value: totalCurrentMonth,
      numOfAcc: totalCurrentMonthAccounts,
      color: '#DC2626',
      subCategories: [
        {
          name: 'Total Undue',
          value: totalUndue,
          numOfAcc: totalUndueAccounts,
          color: '#DC2626'
        },
        {
          name: 'Current Month Unpaid',
          value: currentMonthUnpaid,
          numOfAcc: currentMonthUnpaidAccounts,
          color: '#F59E0B'
        }
      ]
    },
    {
      name: 'Total Outstanding',
      value: safeValue(summaryData.totalUndue),
      numOfAcc: safeCount(summaryData.totalUndueNumOfAccounts),
      color: '#059669'
    }
  ];
  const totalTradeReceivable = tradeReceivableData.reduce((sum, item) => sum + item.value, 0);
  const totalTradeReceivableAccounts = tradeReceivableData.reduce((sum, item) => sum + item.numOfAcc, 0);

  // Card 2: Total Aged Debt by Status (Active + Inactive)
  const totalAgedDebtByStatusData = [
    {
      name: 'Active',
      value: safeValue(summaryData.active),
      numOfAcc: safeCount(summaryData.activeNumOfAccounts),
      color: '#10B981'
    },
    {
      name: 'Inactive', 
      value: safeValue(summaryData.inactive),
      numOfAcc: safeCount(summaryData.inactiveNumOfAccounts),
      color: '#EF4444'
    }
  ];

  // Card 3: Total Aged Debt by Balance Type
  const balanceTypeData = [
    {
      name: 'Positive Balance',
      value: safeValue(summaryData.positiveBalance),
      numOfAcc: safeCount(summaryData.positiveBalanceNumOfAccounts),
      color: '#3B82F6'
    },
    {
      name: 'Negative Balance',
      value: safeValue(summaryData.negativeBalance),
      numOfAcc: safeCount(summaryData.negativeBalanceNumOfAccounts),
      color: '#EF4444'
    },
    {
      name: 'Zero Balance',
      value: safeValue(summaryData.zeroBalance),
      numOfAcc: safeCount(summaryData.zeroBalanceNumOfAccounts),
      color: '#6B7280'
    },
    {
      name: 'MIT',
      value: safeValue(summaryData.mit),
      numOfAcc: safeCount(summaryData.mitNumOfAccounts),
      color: '#F59E0B'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     <SummaryCard
        title="Trade Receivable"
        data={tradeReceivableData}
        totalValue={totalTradeReceivable}
        totalAccounts={totalTradeReceivableAccounts}
        icon={
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />

      <SummaryCard
        title="Total Aged Debt by Status"
        data={totalAgedDebtByStatusData}
        totalValue={totalAgedDebt}
        totalAccounts={totalAgedDebtAccounts}
        icon={
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      
      <SummaryCard
        title="Total Aged Debt by Balance Type"
        data={balanceTypeData}
        totalValue={totalAgedDebt}
        totalAccounts={totalAgedDebtAccounts}
        icon={
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    </div>
  );
};

export default SummaryCard;