import React from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/layout/Layout';
import { SummaryCardsContainer } from '../components/dashboard/SummaryCard';
import DebtByStationTable from '../components/dashboard/DebtByStationTable';
import DetailedTable from '../components/dashboard/DetailedTable';
import AccClassDebtSummary from '../components/dashboard/AccClassDebtSummary';
import { AccDefinitionDebt } from '../components/dashboard/AccDefinitionDebt';
import StaffDebtTable from '../components/dashboard/StaffDebtTable';
import FilterSection from '../components/dashboard/FilterSection';
import DriverTree from '../components/dashboard/charts/DriverTree';
import DirectedGraph from '../components/dashboard/charts/DirectedGraph';

const DashboardPage: React.FC = () => {
  const { 
    summaryData, 
    debtData, 
    isLoading,
    filters 
  } = useAppContext();
  
  // Create driver tree data with Active/Inactive -> Government/Non-Government structure
  const driverTreeData = summaryData ? [
    // Active Government Account Classes
    { 
      category: 'OPCG', 
      debtAmount: summaryData.active * 0.35, // 35% of active debt
      numOfAcc: Math.floor(summaryData.activeNumOfAccounts * 0.35), 
      color: '#3b82f6',
      type: 'government' as const,
      status: 'active' as const
    },
    { 
      category: 'LPCG', 
      debtAmount: summaryData.active * 0.25, // 25% of active debt
      numOfAcc: Math.floor(summaryData.activeNumOfAccounts * 0.25), 
      color: '#10b981',
      type: 'government' as const,
      status: 'active' as const
    },
    // Active Non-Government Account Classes
    { 
      category: 'OPCN', 
      debtAmount: summaryData.active * 0.25, // 25% of active debt
      numOfAcc: Math.floor(summaryData.activeNumOfAccounts * 0.25), 
      color: '#ec4899',
      type: 'non-government' as const,
      status: 'active' as const
    },
    { 
      category: 'LPCN', 
      debtAmount: summaryData.active * 0.15, // 15% of active debt
      numOfAcc: Math.floor(summaryData.activeNumOfAccounts * 0.15), 
      color: '#f59e0b',
      type: 'non-government' as const,
      status: 'active' as const
    },
    // Inactive Government Account Classes
    { 
      category: 'OPCG', 
      debtAmount: summaryData.inactive * 0.35, // 35% of inactive debt
      numOfAcc: Math.floor(summaryData.inactiveNumOfAccounts * 0.35), 
      color: '#6366f1',
      type: 'government' as const,
      status: 'inactive' as const
    },
    { 
      category: 'LPCG', 
      debtAmount: summaryData.inactive * 0.25, // 25% of inactive debt
      numOfAcc: Math.floor(summaryData.inactiveNumOfAccounts * 0.25), 
      color: '#059669',
      type: 'government' as const,
      status: 'inactive' as const
    },
    // Inactive Non-Government Account Classes
    { 
      category: 'OPCN', 
      debtAmount: summaryData.inactive * 0.25, // 25% of inactive debt
      numOfAcc: Math.floor(summaryData.inactiveNumOfAccounts * 0.25), 
      color: '#db2777',
      type: 'non-government' as const,
      status: 'inactive' as const
    },
    { 
      category: 'LPCN', 
      debtAmount: summaryData.inactive * 0.15, // 15% of inactive debt
      numOfAcc: Math.floor(summaryData.inactiveNumOfAccounts * 0.15), 
      color: '#d97706',
      type: 'non-government' as const,
      status: 'inactive' as const
    }
  ] : [];
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Aged Debt Analytics Dashboard</h1>
        
        {/* Summary Cards with Pie Charts - Both Total Aged Debt cards will now tally */}
        <SummaryCardsContainer summaryData={summaryData} />
        
        {/* Enhanced Driver Tree with Active/Inactive -> Government/Non-Government -> Account Classes */}
        <DriverTree driverTreeData={driverTreeData} />
        
        {/* Directed Graph visualization - Add new component */}
        <DirectedGraph title="Driver Tree By Smer Segment" />
        
        {/* Global Filter Section */}
        <FilterSection 
          filters={{
            // Business Area - both single and multi-select
            businessArea: filters.businessArea,
            onBusinessAreaChange: filters.setBusinessArea,
            businessAreaOptions: filters.businessAreaOptions,
            businessAreas: filters.businessAreas,
            setBusinessAreas: filters.setBusinessAreas,
            
            // Account Definition - both single and multi-select
            accDefinition: filters.accDefinition,
            onAccDefinitionChange: filters.setAccDefinition,
            accDefinitionOptions: filters.accDefinitionOptions,
            accDefinitions: filters.accDefinitions,
            setAccDefinitions: filters.setAccDefinitions,
            
            // Account Status
            accStatus: filters.accStatus,
            onAccStatusChange: filters.setAccStatus,
            accStatusOptions: filters.accStatusOptions,
            
            // Account Class
            accClass: filters.accClass,
            onAccClassChange: filters.setAccClass,
            accClassOptions: filters.accClassOptions,
            
            // Other filters
            debtRange: filters.debtRange,
            onDebtRangeChange: filters.setDebtRange,
            debtRangeOptions: filters.debtRangeOptions,
            
            smerSegment: filters.smerSegment,
            onSmerSegmentChange: filters.setSmerSegment,
            smerSegmentOptions: filters.smerSegmentOptions,
            
            // Centralized view type
            viewType: filters.viewType,
            onViewTypeChange: filters.setViewType,
            
            // Add government type filters to FilterSection
            governmentType: filters.governmentType,
            onGovernmentTypeChange: filters.setGovernmentType,
            governmentTypeOptions: filters.governmentTypeOptions,
            
            // Add MIT filter to FilterSection
            mitFilter: filters.mitFilter,
            onMitFilterChange: filters.setMitFilter,
            mitFilterOptions: filters.mitFilterOptions,
            
            // Net Positive Balance filter
            netPositiveBalance: filters.netPositiveBalance,
            onNetPositiveBalanceChange: filters.setNetPositiveBalance,
            netPositiveBalanceOptions: filters.netPositiveBalanceOptions,
            
            // Months outstanding bracket filter
            monthsOutstandingBracket: filters.monthsOutstandingBracket,
            onMonthsOutstandingBracketChange: filters.setMonthsOutstandingBracket,
            monthsOutstandingBracketOptions: filters.monthsOutstandingBracketOptions,
          }}
        />
        
        {/* Debt By Station Table - now uses centralized viewType */}
        <DebtByStationTable 
          data={debtData?.debtByStation || []} 
          loading={isLoading}
          viewType={filters.viewType}
          onViewTypeChange={filters.setViewType}
        />
        
        {/* Account Class Debt Summary - pass both government type and accClass filters */}
        <AccClassDebtSummary 
          data={debtData?.accClassDebtSummary || []} 
          loading={isLoading}
          viewType={filters.viewType}
          onViewTypeChange={filters.setViewType}
          filters={{
            governmentType: filters.governmentType,
            onGovernmentTypeChange: filters.setGovernmentType,
            governmentTypeOptions: filters.governmentTypeOptions,
            accClass: filters.accClass // Add the accClass filter
          }}
        />
        
        {/* Account Definition Debt */}
        <AccDefinitionDebt 
          data={debtData?.accDefinitionDebt || []} 
          loading={isLoading}
          viewType={filters.viewType}
          onViewTypeChange={filters.setViewType}
        />
        
        {/* By Staff Debt */}
        <StaffDebtTable 
          data={(debtData?.staffDebt || []).map(item => ({
            ...item,
            ttlOsAmt: item.ttlOsAmt ?? 0 // Ensure ttlOsAmt is always a number
          }))} 
          loading={isLoading}
          viewType={filters.viewType}
          onViewTypeChange={filters.setViewType}
        />


        {/* Detailed Data Table - now uses centralized viewType */}
        <DetailedTable 
          data={debtData?.detailedCustomerData || []} 
          loading={isLoading}
          viewType={filters.viewType}
          onViewTypeChange={filters.setViewType}
          filters={{
            // MIT filters (local to DetailedTable)
            mitFilter: filters.mitFilter,
            onMitFilterChange: filters.setMitFilter,
            mitFilterOptions: filters.mitFilterOptions,
            monthsOutstandingBracket: filters.monthsOutstandingBracket,
            onMonthsOutstandingBracketChange: filters.setMonthsOutstandingBracket,
            monthsOutstandingBracketOptions: filters.monthsOutstandingBracketOptions,
            
            // Global filters (from FilterSection)
            businessArea: filters.businessArea,
            accStatus: filters.accStatus,
            accClass: filters.accClass,
            accDefinition: filters.accDefinition,
            netPositiveBalance: filters.netPositiveBalance,
            
            // Add government type filter
            governmentType: filters.governmentType,
          }}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;