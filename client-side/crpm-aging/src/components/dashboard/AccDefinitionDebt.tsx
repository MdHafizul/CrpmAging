import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Dropdown from '../ui/Dropdown';

interface AccDefinitionDebtData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
}

interface AccDefinitionDebtProps {
  data: AccDefinitionDebtData[];
  loading?: boolean;
  filters: {
    accDefinition: string;
    onAccDefinitionChange: (value: string) => void;
    accDefinitionOptions: { value: string; label: string }[];
    
    accStatus: string;
    onAccStatusChange: (value: string) => void;
    accStatusOptions: { value: string; label: string }[];
  };
}

const AccDefinitionDebt: React.FC<AccDefinitionDebtProps> = ({
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
        options={filters.accDefinitionOptions}
        value={filters.accDefinition}
        onChange={filters.onAccDefinitionChange}
        placeholder="All Account Definitions"
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
    <Card title="Account Definition Debt" headerRight={headerRight}>
      <Table 
        columns={columns} 
        data={data} 
        loading={loading}
        emptyMessage="No account definition debt data available"
      />
    </Card>
  );
};

export default AccDefinitionDebt;