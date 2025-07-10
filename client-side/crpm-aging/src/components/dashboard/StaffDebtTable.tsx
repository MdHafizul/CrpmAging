import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';

interface StaffDebtData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  ttlOsAmt: number;
}

interface StaffDebtTableProps {
  data: StaffDebtData[];
  loading?: boolean;
}

const StaffDebtTable: React.FC<StaffDebtTableProps> = ({
  data,
  loading = false
}) => {
  const columns = [
    { 
      header: 'Business Area', 
      accessor: 'businessArea',
      align: 'left' as const,
      cell: (value: string, row: any) => (
        <span className={`font-medium ${row.businessArea === 'TOTAL' ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
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
    { 
      header: 'TTL O/S AMT', 
      accessor: 'ttlOsAmt',
      align: 'right' as const,
      cell: (value: number, row: any) => (
        <span className={`font-medium ${row.businessArea === 'TOTAL' ? 'text-blue-600 font-bold text-lg' : 'text-gray-900'}`}>
          RM {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    }
  ];

  // Calculate totals based on view type
  const calculateTotals = () => {
    const totals = {
      numOfAccounts: data.reduce((sum, item) => sum + item.numOfAccounts, 0),
      ttlOsAmt: data.reduce((sum, item) => sum + (item.ttlOsAmt || 0), 0),
    };
    return totals;
  };

  const totals = calculateTotals();

  // Create totals row data - Make sure the businessArea is exactly 'TOTAL'
  const totalsRowData = {
    businessArea: 'TOTAL', // This string needs to match exactly what's checked in cell renderers
    station: 'All Stations', // Add a clear label instead of empty string
    numOfAccounts: totals.numOfAccounts,
    ttlOsAmt: totals.ttlOsAmt,
  };

  // Combine data with totals row
  const dataWithTotals = [...data, totalsRowData];


  const headerRight = null;

  return (
    <Card title="By Staff Debt" headerRight={headerRight}>
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