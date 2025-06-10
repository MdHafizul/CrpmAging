import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Dropdown from '../ui/Dropdown';

interface DebtByStationData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
}

interface DebtByStationTableProps {
  data: DebtByStationData[];
  loading?: boolean;
  title?: string;
  filters?: {
    businessArea: string;
    onBusinessAreaChange: (value: string) => void;
    businessAreaOptions: { value: string; label: string }[];
  };
}

const DebtByStationTable: React.FC<DebtByStationTableProps> = ({
  data,
  loading = false,
  title = 'Debt By Station',
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

  const headerRight = filters && (
    <div className="flex">
      <Dropdown
        options={filters.businessAreaOptions}
        value={filters.businessArea}
        onChange={filters.onBusinessAreaChange}
        placeholder="All Business Areas"
        className="w-48"
      />
    </div>
  );

  return (
    <Card title={title} headerRight={headerRight}>
      <Table 
        columns={columns} 
        data={data} 
        loading={loading}
        emptyMessage="No debt data available"
      />
    </Card>
  );
};

export default DebtByStationTable;