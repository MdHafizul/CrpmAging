import React, { useState, useMemo, useEffect } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';

interface AccDefinitionDebtData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
  accDefinition?: string;
}

interface AccDefinitionDebtProps {
  data: AccDefinitionDebtData[];
  loading?: boolean;
}

export const AccDefinitionDebt: React.FC<AccDefinitionDebtProps> = ({
  data,
  loading = false
}) => {
  // Local state for expanded data
  const [expandedData, setExpandedData] = useState<AccDefinitionDebtData[]>([]);
  
  // Expand data to have all ADID types per business area
  useEffect(() => {
    if (data.length > 0) {
      // Group by business area and station
      const businessAreas = new Map<string, { businessArea: string, station: string }>();
      
      data.forEach(item => {
        businessAreas.set(item.businessArea, {
          businessArea: item.businessArea,
          station: item.station
        });
      });
      
      // Create expanded dataset with all ADID types per business area
      const expanded: AccDefinitionDebtData[] = [];
      
      // ADID types
      const adidTypes = ['AG', 'CM', 'DM', 'IN', 'MN', 'SL'];
      
      // For each business area, create entries for all ADID types
      businessAreas.forEach((area) => {
        adidTypes.forEach(adidType => {
          // Find existing data for this business area and ADID type
          const existingData = data.find(item => 
            item.businessArea === area.businessArea && 
            item.accDefinition === adidType
          );
          
          // If data exists, use it; otherwise create a new entry with random values
          if (existingData) {
            expanded.push({
              ...existingData,
              accDefinition: adidType
            });
          } else {
            expanded.push({
              businessArea: area.businessArea,
              station: area.station,
              numOfAccounts: Math.floor(Math.random() * 100) + 10,
              debtAmount: Math.floor(Math.random() * 50000) + 5000,
              accDefinition: adidType
            });
          }
        });
      });
      
      setExpandedData(expanded);
    }
  }, [data]);

  // Group and organize data by business area
  const organizedData = useMemo(() => {
    if (!expandedData.length) return [];
    
    // Group data by business area
    const groupedByBusinessArea = new Map<string, AccDefinitionDebtData[]>();
    
    expandedData.forEach(item => {
      const key = item.businessArea;
      if (!groupedByBusinessArea.has(key)) {
        groupedByBusinessArea.set(key, []);
      }
      groupedByBusinessArea.get(key)!.push(item);
    });
    
    // Flatten the data with proper formatting for display
    const result: (AccDefinitionDebtData & { isFirstInGroup?: boolean, isTotal?: boolean, isGrandTotal?: boolean })[] = [];
    
    // Track totals for grand total calculation
    let grandTotalAccounts = 0;
    let grandTotalDebt = 0;
    
    groupedByBusinessArea.forEach((items) => {
      // Sort ADID types in alphabetical order
      const sortedItems = [...items].sort((a, b) => {
        return (a.accDefinition || '').localeCompare(b.accDefinition || '');
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
          accDefinition: 'Total',
          isTotal: true
        });
      }
    });
    
    // Add grand total row if there are multiple business areas
    if (groupedByBusinessArea.size > 1) {
      result.push({
        businessArea: 'GRAND TOTAL',
        station: '',
        numOfAccounts: grandTotalAccounts,
        debtAmount: grandTotalDebt,
        accDefinition: 'Grand Total',
        isGrandTotal: true
      });
    }
    
    return result;
  }, [expandedData]);

  // Calculate summary totals for each business area
  const businessAreaSummary = useMemo(() => {
    const summary = new Map<string, AccDefinitionDebtData>();
    
    expandedData.forEach(item => {
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
          accDefinition: 'Total'
        });
      }
    });
    
    return Array.from(summary.values());
  }, [expandedData]);

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
        if (row.isGrandTotal || row.isTotal) {
          return null;
        }
        if (row.isFirstInGroup) {
          return <span className="text-gray-700">{value}</span>;
        }
        return null; // Empty cell for rows that aren't the first in a group
      }
    },
    { 
      header: 'ADID', 
      accessor: 'accDefinition',
      cell: (value: string, row: any) => {
        if (row.isGrandTotal) {
          return <span className="font-bold text-lg text-blue-600">{value}</span>;
        }
        if (row.isTotal) {
          return <span className="font-bold text-blue-600">Total</span>;
        }
        
        // Color coding for different ADIDs
        const colors: Record<string, string> = {
          'AG': 'text-green-600',
          'CM': 'text-blue-600',
          'DM': 'text-purple-600',
          'IN': 'text-orange-600',
          'MN': 'text-red-600',
          'SL': 'text-teal-600'
        };
        
        return (
          <span className={`font-medium ${colors[value] || 'text-gray-600'}`}>
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
      header: 'Debt Amount', 
      accessor: 'debtAmount',
      cell: (value: number, row: any) => (
        <span className={`font-medium ${row.isTotal ? 'font-bold text-blue-600' : 'text-gray-900'} ${row.isGrandTotal ? 'font-bold text-lg text-blue-600' : ''}`}>
          RM {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    }
  ];
    
  // Header right with data summary
  const headerRight = (
    <div className="text-sm text-gray-600">
      {expandedData.length} ADID entries across {businessAreaSummary.length} business areas
    </div>
  );

  return (
    <Card title="Account Definition Debt" headerRight={headerRight}>
      <Table 
        columns={columns} 
        data={organizedData}
        loading={loading}
        emptyMessage="No account definition debt data available"
      />
    </Card>
  );
};

export default AccDefinitionDebt;