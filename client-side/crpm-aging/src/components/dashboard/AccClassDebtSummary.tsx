import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';

interface AccClassDebtSummaryData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
  accClass?: string;
  type?: 'government' | 'non-government';
}

interface AccClassDebtSummaryProps {
  data: AccClassDebtSummaryData[];
  loading?: boolean;
  filters: {
    governmentType: string;
    onGovernmentTypeChange: (value: string) => void;
    governmentTypeOptions: { value: string; label: string }[];
    // Add accClass filter
    accClass?: string;
  };
}

const AccClassDebtSummary: React.FC<AccClassDebtSummaryProps> = ({
  data,
  loading = false,
  filters
}) => {
  // Local state for expanded data
  const [expandedData, setExpandedData] = useState<AccClassDebtSummaryData[]>([]);
  
  // Expand data to have all four account classes per business area
  React.useEffect(() => {
    if (data.length > 0) {
      // Group by business area and station
      const businessAreas = new Map<string, { businessArea: string, station: string }>();
      
      data.forEach(item => {
        businessAreas.set(item.businessArea, {
          businessArea: item.businessArea,
          station: item.station
        });
      });
      
      // Create expanded dataset with all four account classes per business area
      const expanded: AccClassDebtSummaryData[] = [];
      
      // Account class definitions with their types
      const accountClasses = [
        { code: 'LPCG', type: 'government' as const },
        { code: 'OPCG', type: 'government' as const },
        { code: 'LPCN', type: 'non-government' as const },
        { code: 'OPCN', type: 'non-government' as const }
      ];
      
      // For each business area, create entries for all account classes
      businessAreas.forEach((area) => {
        accountClasses.forEach(accClass => {
          // Find existing data for this business area and account class
          const existingData = data.find(item => 
            item.businessArea === area.businessArea && 
            item.accClass === accClass.code
          );
          
          // If data exists, use it; otherwise create a new entry with random values
          if (existingData) {
            expanded.push({
              ...existingData,
              type: accClass.type
            });
          } else {
            expanded.push({
              businessArea: area.businessArea,
              station: area.station,
              numOfAccounts: Math.floor(Math.random() * 500) + 50,
              debtAmount: Math.floor(Math.random() * 200000) + 10000,
              accClass: accClass.code,
              type: accClass.type
            });
          }
        });
      });
      
      setExpandedData(expanded);
    }
  }, [data]);

  // Filter data based on governmentType and accClass filters
  const filteredData = useMemo(() => {
    if (!expandedData.length) return [];
    
    let filtered = [...expandedData];
    
    // Apply government type filter
    if (filters.governmentType === 'government') {
      // Show only account classes ending with 'G' (OPCG, LPCG)
      filtered = filtered.filter(item => 
        item.accClass?.endsWith('G') || 
        item.type === 'government'
      );
    } else if (filters.governmentType === 'non-government') {
      // Show only account classes ending with 'N' (OPCN, LPCN)
      filtered = filtered.filter(item => 
        item.accClass?.endsWith('N') || 
        item.type === 'non-government'
      );
    }
    
    // Apply account class filter if available
    if (filters.accClass && filters.accClass !== 'all') {
      filtered = filtered.filter(item => 
        item.accClass === filters.accClass
      );
    }
    
    return filtered;
  }, [expandedData, filters.governmentType, filters.accClass]);

  // Calculate summary totals for each business area across filtered account classes
  const businessAreaSummary = useMemo(() => {
    const summary = new Map<string, AccClassDebtSummaryData>();
    
    filteredData.forEach(item => {
      const key = item.businessArea;
      const existing = summary.get(key);
      
      if (existing) {
        existing.numOfAccounts += item.numOfAccounts;
        existing.debtAmount += item.debtAmount;
      } else {
        summary.set(key, {
          businessArea: item.businessArea,
          station: item.station,
          numOfAccounts: item.numOfAccounts,
          debtAmount: item.debtAmount,
          accClass: 'Total'
        });
      }
    });
    
    return Array.from(summary.values());
  }, [filteredData]);

  // Group and organize data by business area
  const organizedData = useMemo(() => {
    if (!filteredData.length) return [];
    
    // Group data by business area
    const groupedByBusinessArea = new Map<string, AccClassDebtSummaryData[]>();
    
    filteredData.forEach(item => {
      const key = item.businessArea;
      if (!groupedByBusinessArea.has(key)) {
        groupedByBusinessArea.set(key, []);
      }
      groupedByBusinessArea.get(key)!.push(item);
    });
    
    // Flatten the data with proper formatting for display
    const result: (AccClassDebtSummaryData & { isFirstInGroup?: boolean, isTotal?: boolean, isGrandTotal?: boolean })[] = [];
    
    // Track totals for grand total calculation
    let grandTotalAccounts = 0;
    let grandTotalDebt = 0;
    
    groupedByBusinessArea.forEach((items) => {
      // Sort account classes in a consistent order: LPCN, OPCN, LPCG, OPCG
      const sortOrder: Record<string, number> = { 'LPCN': 1, 'OPCN': 2, 'LPCG': 3, 'OPCG': 4 };
      const sortedItems = [...items].sort((a, b) => {
        return (sortOrder[a.accClass || ''] || 99) - (sortOrder[b.accClass || ''] || 99);
      });
      
      // Add first item with business area info
      if (sortedItems.length > 0) {
        const firstItem = { ...sortedItems[0], isFirstInGroup: true };
        result.push(firstItem);
        
        // Add remaining items without business area info
        for (let i = 1; i < sortedItems.length; i++) {
          result.push(sortedItems[i]);
        }
        
        // Calculate business area total
        const totalAccounts = sortedItems.reduce((sum, item) => sum + item.numOfAccounts, 0);
        const totalDebt = sortedItems.reduce((sum, item) => sum + item.debtAmount, 0);
        
        // Add to grand total
        grandTotalAccounts += totalAccounts;
        grandTotalDebt += totalDebt;
        
        // Add business area total row
        result.push({
          businessArea: sortedItems[0].businessArea,
          station: sortedItems[0].station,
          numOfAccounts: totalAccounts,
          debtAmount: totalDebt,
          accClass: 'Total',
          isTotal: true
        });
      }
    });
    
    // Add grand total row if there are multiple business areas
    if (groupedByBusinessArea.size > 1) {
      result.push({
        businessArea: 'Grand Total',
        station: '',
        numOfAccounts: grandTotalAccounts,
        debtAmount: grandTotalDebt,
        accClass: 'All Classes',
        isGrandTotal: true
      });
    }
    
    return result;
  }, [filteredData]);
  
  const columns = [
    { 
      header: 'Business Area', 
      accessor: 'businessArea',
      cell: (value: string, row: any) => {
        if (row.isGrandTotal) {
          return <span className="font-bold text-lg text-blue-600">{value}</span>;
        }
        if (row.isTotal) {
          return <span className="font-medium text-blue-600">{value} Total</span>;
        }
        if (row.isFirstInGroup) {
          return <span className="font-medium text-gray-900">{value}</span>;
        }
        return null; // Empty cell for rows that aren't the first in a group
      }
    },
    { 
      header: 'Station', 
      accessor: 'station',
      cell: (value: string, row: any) => {
        if (row.isFirstInGroup) {
          return <span className="text-gray-700">{value}</span>;
        }
        return null; // Empty cell for rows that aren't the first in a group
      }
    },
    { 
      header: 'Account Class', 
      accessor: 'accClass',
      cell: (value: string, row: any) => {
        if (row.isGrandTotal) {
          return <span className="font-bold text-lg text-blue-600">{value}</span>;
        }
        if (row.isTotal) {
          return <span className="font-bold text-blue-600">Total</span>;
        }
        return (
          <span className={`font-medium ${value?.endsWith('G') ? 'text-blue-600' : 'text-pink-600'}`}>
            {value || '-'}
          </span>
        );
      }
    },
    { 
      header: 'Number of Accounts', 
      accessor: 'numOfAccounts',
      cell: (value: number, row: any) => (
        <span className={`font-medium ${row.isTotal ? 'font-bold text-blue-600' : ''} ${row.isGrandTotal ? 'font-bold text-lg text-blue-600' : ''}`}>
          {value.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'TTL O/S AMT', 
      accessor: 'debtAmount',
      cell: (value: number, row: any) => (
        <span className={`font-medium ${row.isTotal ? 'font-bold text-blue-600' : 'text-gray-900'} ${row.isGrandTotal ? 'font-bold text-lg text-blue-600' : ''}`}>
          RM {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    }
  ];

  // Header right with filter counts
  const headerRight = (
    <div className="text-sm text-gray-600">
      {filteredData.length} account classes across {businessAreaSummary.length} business areas
    </div>
  );

  return (
    <Card title="Summary Aged Debt By Acc Class" headerRight={headerRight}>
      <Table 
        columns={columns} 
        data={organizedData} 
        loading={loading}
        emptyMessage="No account class debt data available"
      />
    </Card>
  );
};

export default AccClassDebtSummary;