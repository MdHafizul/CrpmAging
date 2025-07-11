import React, { useMemo } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';

interface StaffDebtData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  ttlOsAmt: number;
  // Add Trade Receivable view fields
  totalUndue?: number;
  curMthUnpaid?: number;
  debtAmount?: number; // Same as ttlOsAmt for consistency
  totalUnpaid?: number;
}

interface StaffDebtTableProps {
  data: StaffDebtData[];
  loading?: boolean;
  viewType?: 'tradeReceivable' | 'agedDebt';
  onViewTypeChange?: (viewType: 'tradeReceivable' | 'agedDebt') => void;
}

interface TableRow extends StaffDebtData {
  isFirstInGroup?: boolean;
  isTotal?: boolean; 
  isGrandTotal?: boolean;
}

const StaffDebtTable: React.FC<StaffDebtTableProps> = ({
  data,
  loading = false,
  viewType = 'agedDebt'
}) => {
  // Calculate totals first for percentage calculations
  const totals = useMemo(() => ({
    numOfAccounts: data.reduce((sum, item) => sum + item.numOfAccounts, 0),
    ttlOsAmt: data.reduce((sum, item) => sum + (item.ttlOsAmt || 0), 0),
    totalUndue: data.reduce((sum, item) => sum + (item.totalUndue || 0), 0),
    curMthUnpaid: data.reduce((sum, item) => sum + (item.curMthUnpaid || 0), 0),
    totalUnpaid: data.reduce((sum, item) => sum + (item.totalUnpaid || 0), 0)
  }), [data]);

  // Calculate percentages and sort data
  const processedData = useMemo(() => {
    // Add percentage to each row based on view type
    const withPercentages = data.map(item => ({
      ...item,
      percentage: totals.ttlOsAmt > 0 ? (item.ttlOsAmt / totals.ttlOsAmt) * 100 : 0
    }));
    
    // Sort by percentage in descending order
    return [...withPercentages].sort((a, b) => b.percentage - a.percentage);
  }, [data, totals.ttlOsAmt]);
  
  const baseColumns = [
    { 
      header: 'Business Area', 
      accessor: 'businessArea',
      align: 'left' as const,
      cell: (value: string, row: any) => (
        <span className={`font-medium ${value === 'TOTAL' ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
          {value}
        </span>
      )
    },
    { 
      header: 'Station', 
      accessor: 'station',
      align: 'left' as const,
      cell: (value: string, row: any) => (
        <span className={`font-medium ${row.businessArea === 'TOTAL' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
          {value || 'All Stations'}
        </span>
      )
    },
    { 
      header: 'Number of Accounts', 
      accessor: 'numOfAccounts',
      align: 'right' as const,
      cell: (value: number, row: any) => (
        <span className={`font-medium ${row.businessArea === 'TOTAL' ? 'text-blue-600 font-bold text-lg' : ''}`}>
          {value.toLocaleString()}
        </span>
      )
    },
  ];

  // Additional columns for Trade Receivable view
  const tradeReceivableColumns = [
    { 
      header: 'Total Undue', 
      accessor: 'totalUndue',
      align: 'right' as const,
      cell: (value: number, row: TableRow) => (
        <span className={`font-medium ${row.businessArea === 'TOTAL' ? 'text-blue-600 font-bold text-lg' : 'text-blue-600'}`}>
          RM {value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
        </span>
      )
    },
    { 
      header: 'Cur.Mth Unpaid', 
      accessor: 'curMthUnpaid',
      align: 'right' as const,
      cell: (value: number, row: TableRow) => (
        <span className={`font-medium ${row.businessArea === 'TOTAL' ? 'text-blue-600 font-bold text-lg' : 'text-orange-600'}`}>
          RM {value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
        </span>
      )
    },
    { 
      header: 'TTL O/S Amt', 
      accessor: 'ttlOsAmt',
      align: 'right' as const,
      cell: (value: number, row: TableRow) => (
        <span className={`${row.businessArea === 'TOTAL' ? 'font-bold text-blue-600 text-lg' : 'font-bold text-red-600'}`}>
          RM {value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
        </span>
      )
    },
    { 
      header: '% of Total', 
      accessor: 'percentage',
      align: 'right' as const,
      cell: (value: number, row: TableRow) => (
        <span className={`${row.businessArea === 'TOTAL' ? 'font-bold text-blue-600 text-lg' : 'font-medium text-gray-900'}`}>
          {row.businessArea === 'TOTAL' ? '100.00%' : value.toFixed(2) + '%'}
        </span>
      )
    },
    { 
      header: 'Total Unpaid', 
      accessor: 'totalUnpaid',
      align: 'right' as const,
      cell: (value: number, row: TableRow) => (
        <span className={`${row.businessArea === 'TOTAL' ? 'font-bold text-blue-600 text-lg' : 'font-bold text-gray-900'}`}>
          RM {value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
        </span>
      )
    }
  ];

  // Aged Debt view columns with percentage column
  const agedDebtColumns = [
    { 
      header: 'TTL O/S Amt', 
      accessor: 'ttlOsAmt',
      align: 'right' as const,
      cell: (value: number, row: TableRow) => (
        <span className={`${row.businessArea === 'TOTAL' ? 'font-bold text-blue-600 text-lg' : 'font-bold text-gray-900'}`}>
          RM {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    { 
      header: '% of Total', 
      accessor: 'percentage',
      align: 'right' as const,
      cell: (value: number, row: TableRow) => (
        <span className={`${row.businessArea === 'TOTAL' ? 'font-bold text-blue-600 text-lg' : 'font-medium text-gray-900'}`}>
          {row.businessArea === 'TOTAL' ? '100.00%' : value.toFixed(2) + '%'}
        </span>
      )
    }
  ];

  // Combine columns based on view type
  const columns = viewType === 'tradeReceivable' 
    ? [...baseColumns, ...tradeReceivableColumns]
    : [...baseColumns, ...agedDebtColumns];

  // Create totals row data with percentage
  const totalsRowData = {
    businessArea: 'TOTAL',
    station: 'All Stations',
    numOfAccounts: totals.numOfAccounts,
    ttlOsAmt: totals.ttlOsAmt,
    percentage: 100, // Always 100%
    totalUndue: totals.totalUndue,
    curMthUnpaid: totals.curMthUnpaid,
    totalUnpaid: totals.totalUnpaid
  };

  // Combine data with totals row - keep totals at bottom regardless of sorting
  const dataWithTotals = [...processedData, totalsRowData];

  return (
    <Card title="By Staff Debt">
      <Table 
        columns={columns} 
        data={dataWithTotals} 
        loading={loading}
        emptyMessage="No staff debt data available"
        className="staff-debt-table"
        key="staff-debt-table"
      />
    </Card>
  );
};

export default StaffDebtTable;