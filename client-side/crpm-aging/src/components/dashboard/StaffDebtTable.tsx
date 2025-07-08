import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';

interface StaffDebtData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
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

  const headerRight = null;

  return (
    <Card title="By Staff Debt" headerRight={headerRight}>
      <Table 
        columns={columns} 
        data={data} 
        loading={loading}
        emptyMessage="No staff debt data available"
      />
    </Card>
  );
};

export default StaffDebtTable;