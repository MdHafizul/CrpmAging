import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/layout/Layout';
import SummaryCards from '../components/dashboard/SummaryCard';
import SummaryChart from '../components/dashboard/charts/SummaryChart';
import DebtByStationTable from '../components/dashboard/DebtByStationTable';
import DetailedTable from '../components/dashboard/DetailedTable';
import AccClassDebtSummary from '../components/dashboard/AccClassDebtSummary';
import AccDefinitionDebt from '../components/dashboard/AccDefinitionDebt';
import StaffDebtTable from '../components/dashboard/StaffDebtTable';
import { formatCurrency } from '../utils/formatter';

const DashboardPage: React.FC = () => {
  const { 
    summaryData, 
    debtData, 
    isLoading,
    filters 
  } = useAppContext();
  
  // Create summary cards data for dashboard
  const summaryCardsData = summaryData ? [
    {
      title: 'Total Outstanding',
      value: formatCurrency(summaryData.totalOutstandingAmt),
      percentChange: summaryData.totalOutstandingAmtChange,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Active',
      value: formatCurrency(summaryData.active),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Inactive',
      value: formatCurrency(summaryData.inactive),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Net Profit',
      value: formatCurrency(summaryData.netProfit),
      percentChange: summaryData.netProfitChange,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Positive Balance',
      value: formatCurrency(summaryData.positiveBalance),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'MIT',
      value: formatCurrency(summaryData.mit),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    }
  ] : [];
  
  // Create summary chart data
  const summaryChartData = summaryData ? [
    { name: 'Total Outstanding', value: summaryData.totalOutstandingAmt, color: '#3B82F6' },
    { name: 'Active', value: summaryData.active, color: '#10B981' },
    { name: 'Inactive', value: summaryData.inactive, color: '#EF4444' },
    { name: 'Net Profit', value: summaryData.netProfit, color: '#8B5CF6' },
    { name: 'Positive Balance', value: summaryData.positiveBalance, color: '#F59E0B' },
    { name: 'MIT', value: summaryData.mit, color: '#6366F1' }
  ] : [];
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        {/* Summary Cards */}
        <SummaryCards data={summaryCardsData} />
        
        {/* Summary Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SummaryChart data={summaryChartData} />
        
          {/* Debt By Station */}
          <DebtByStationTable 
            data={debtData?.debtByStation || []} 
            loading={isLoading}
            filters={{
              businessArea: filters.businessArea,
              onBusinessAreaChange: filters.setBusinessArea,
              businessAreaOptions: filters.businessAreaOptions
            }}
          />
        </div>
        
        {/* Detailed Data Table */}
        <DetailedTable 
          data={debtData?.detailedCustomerData || []} 
          loading={isLoading}
          filters={{
            businessArea: filters.businessArea,
            onBusinessAreaChange: filters.setBusinessArea,
            businessAreaOptions: filters.businessAreaOptions,
            
            accStatus: filters.accStatus,
            onAccStatusChange: filters.setAccStatus,
            accStatusOptions: filters.accStatusOptions,
            
            netPositiveBalance: filters.netPositiveBalance,
            onNetPositiveBalanceChange: filters.setNetPositiveBalance,
            netPositiveBalanceOptions: filters.netPositiveBalanceOptions
          }}
        />
        
        {/* Account Class Debt Summary */}
        <AccClassDebtSummary 
          data={debtData?.accClassDebtSummary || []} 
          loading={isLoading}
          filters={{
            accClass: filters.accClass,
            onAccClassChange: filters.setAccClass,
            accClassOptions: filters.accClassOptions,
            
            accStatus: filters.accStatus,
            onAccStatusChange: filters.setAccStatus,
            accStatusOptions: filters.accStatusOptions
          }}
        />
        
        {/* Account Definition Debt */}
        <AccDefinitionDebt 
          data={debtData?.accDefinitionDebt || []} 
          loading={isLoading}
          filters={{
            accDefinition: filters.accDefinition,
            onAccDefinitionChange: filters.setAccDefinition,
            accDefinitionOptions: filters.accDefinitionOptions,
            
            accStatus: filters.accStatus,
            onAccStatusChange: filters.setAccStatus,
            accStatusOptions: filters.accStatusOptions
          }}
        />
        
        {/* By Staff Debt */}
        <StaffDebtTable 
          data={debtData?.staffDebt || []} 
          loading={isLoading}
          filters={{
            accStatus: filters.accStatus,
            onAccStatusChange: filters.setAccStatus,
            accStatusOptions: filters.accStatusOptions
          }}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;