import React, { useState } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Dropdown from '../ui/Dropdown';

interface DetailedTableProps {
  data: any[];
  loading?: boolean;
  filters: {
    businessArea: string;
    onBusinessAreaChange: (value: string) => void;
    businessAreaOptions: { value: string; label: string }[];
    
    accStatus: string;
    onAccStatusChange: (value: string) => void;
    accStatusOptions: { value: string; label: string }[];
    
    netPositiveBalance: string;
    onNetPositiveBalanceChange: (value: string) => void;
    netPositiveBalanceOptions: { value: string; label: string }[];
  };
}

const DetailedTable: React.FC<DetailedTableProps> = ({
  data,
  loading = false,
  filters
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  
  // Define a subset of columns for the UI (the full data has many columns)
  const columns = [
    { header: 'BP No', accessor: 'bpNo' },
    { header: 'Contract Acc', accessor: 'contractAcc' },
    { header: 'Contract Account Name', accessor: 'contractAccountName' },
    { header: 'Business Area', accessor: 'businessArea' },
    { header: 'Station', accessor: 'station' },
    { header: 'Acc Status', accessor: 'accStatus' },
    { 
      header: 'Total Outstanding (RM)', 
      accessor: 'totalOutstandingAmt',
      cell: (value: number) => (
        <span className={`font-medium ${value > 0 ? 'text-red-600' : 'text-green-600'}`}>
          RM {Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    { 
      header: 'Last Payment Date', 
      accessor: 'lastPymtDate',
      cell: (value: string) => value || '-'
    },
    { 
      header: 'Last Payment Amount', 
      accessor: 'lastPymtAmt',
      cell: (value: number) => value ? `RM ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'
    }
  ];
  
  // Calculate pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  
  const headerRight = (
    <div className="flex flex-wrap gap-2">
      <Dropdown
        options={filters.businessAreaOptions}
        value={filters.businessArea}
        onChange={filters.onBusinessAreaChange}
        placeholder="All Business Areas"
        className="w-40"
      />
      <Dropdown
        options={filters.accStatusOptions}
        value={filters.accStatus}
        onChange={filters.onAccStatusChange}
        placeholder="Account Status"
        className="w-36"
      />
      <Dropdown
        options={filters.netPositiveBalanceOptions}
        value={filters.netPositiveBalance}
        onChange={filters.onNetPositiveBalanceChange}
        placeholder="Balance Type"
        className="w-36"
      />
    </div>
  );
  
  return (
    <Card title="Detailed Customer Data" headerRight={headerRight}>
      <Table 
        columns={columns} 
        data={paginatedData} 
        loading={loading}
        emptyMessage="No customer data available"
      />
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{Math.min(1 + (page - 1) * rowsPerPage, data.length)}</span> to <span className="font-medium">{Math.min(page * rowsPerPage, data.length)}</span> of{' '}
                <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (page > 3) {
                      pageNum = page - 3 + i;
                      if (pageNum > totalPages) {
                        pageNum = totalPages - 4 + i;
                      }
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === pageNum ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' 
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DetailedTable;