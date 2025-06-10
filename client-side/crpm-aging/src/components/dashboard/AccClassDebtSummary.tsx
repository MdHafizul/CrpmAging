// filepath: c:\Users\hafiz\OneDrive\Desktop\DebtAging\client-side\crpm-aging\src\components\dashboard\AccClassDebtSummary.tsx
import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Dropdown from '../ui/Dropdown';

interface AccClassDebtSummaryData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
}

interface AccClassDebtSummaryProps {
  data: AccClassDebtSummaryData[];
  loading?: boolean;
  filters: {
    accClass: string;
    onAccClassChange: (value: string) => void;
    accClassOptions: { value: string; label: string }[];
    
    accStatus: string;
    onAccStatusChange: (value: string) => void;
    accStatusOptions: { value: string; label: string }[];
  };
}

const AccClassDebtSummary: React.FC<AccClassDebtSummaryProps> = ({
  data,
  loading = false,
  filters
}) => {
  const columns = [
    { header: 'Business Area', accessor: 'businessArea' },
    { header: 'Station', accessor: 'station' },
    { 
      header: 'Number of Accounts', 
      accessor: 'numOfAccounts',
      cell: (value: number) => <span className="font-medium">{value.toLocaleString()}</span>
    },
    { 
      header: 'Debt (RM)', 
      accessor: 'debtAmount',
      cell: (value: number) => <span className="font-medium text-gray-900">RM {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    }
  ];

  const headerRight = (
    <div className="flex gap-2">
      <Dropdown
        options={filters.accClassOptions}
        value={filters.accClass}
        onChange={filters.onAccClassChange}
        placeholder="All Account Classes"
        className="w-40"
      />
      <Dropdown
        options={filters.accStatusOptions}
        value={filters.accStatus}
        onChange={filters.onAccStatusChange}
        placeholder="Account Status"
        className="w-36"
      />
    </div>
  );

  return (
    <Card title="Account Class Debt Summary" headerRight={headerRight}>
      <Table 
        columns={columns} 
        data={data} 
        loading={loading}
        emptyMessage="No account class debt data available"
      />
    </Card>
  );
};

export default AccClassDebtSummary;