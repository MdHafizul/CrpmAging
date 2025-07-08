import type { DebtData, SummaryData, FilterParams } from '../types/dashboard.type.ts';
import { mockDebtData, mockSummaryData } from './mockData';
import { getMonthsOutstandingBracket } from '../utils/formatter';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate file upload with progress
export const uploadExcelFile = async (
  _file: File, 
  onProgress: (progress: number) => void
): Promise<{ success: boolean; message: string }> => {
  // Simulate file upload with progress updates
  for (let progress = 0; progress <= 100; progress += 10) {
    onProgress(progress);
    await delay(300); // Simulate network delay
  }
  
  return { success: true, message: 'File uploaded successfully' };
};


export const getDebtData = async (filters: FilterParams): Promise<{ 
  summary: SummaryData; 
  debt: DebtData;
}> => {
  // Simulate API call delay
  await delay(1000);
  
  // Apply business area filter
  let filteredDebtByStation = mockDebtData.debtByStation;
  let filteredAccClassDebtSummary = mockDebtData.accClassDebtSummary;
  let filteredAccDefinitionDebt = mockDebtData.accDefinitionDebt;
  let filteredStaffDebt = mockDebtData.staffDebt;
  let filteredDetailedCustomerData = mockDebtData.detailedCustomerData;
  
  // Apply business area filter
  if (filters.businessArea !== 'all') {
    filteredDebtByStation = filteredDebtByStation.filter(
      item => item.businessArea === filters.businessArea
    );
    
    filteredAccClassDebtSummary = filteredAccClassDebtSummary.filter(
      item => item.businessArea === filters.businessArea
    );
    
    filteredAccDefinitionDebt = filteredAccDefinitionDebt.filter(
      item => item.businessArea === filters.businessArea
    );
    
    filteredStaffDebt = filteredStaffDebt.filter(
      item => item.businessArea === filters.businessArea
    );
    
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(
      item => item.businessArea === filters.businessArea
    );
  }
  
  // Apply account status filter
  if (filters.accStatus !== 'all') {
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(
      item => item.accStatus.toLowerCase() === filters.accStatus.toLowerCase()
    );
  }
  
  // Apply account class filter
  if (filters.accClass !== 'all') {
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(
      item => item.accClass === filters.accClass
    );
  }
  
  // Apply account definition filter
  if (filters.accDefinition !== 'all') {
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(
      item => item.accDefinition === filters.accDefinition
    );
  }
  
  // Apply positive/negative balance filter
  if (filters.netPositiveBalance !== 'all') {
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(item => {
      if (filters.netPositiveBalance === 'positive') {
        return item.totalOutstandingAmt > 0;
      } else if (filters.netPositiveBalance === 'negative') {
        return item.totalOutstandingAmt < 0;
      }
      return true; // 'all' case
    });
  }
  
  // Apply months outstanding bracket filter
  if (filters.monthsOutstandingBracket && filters.monthsOutstandingBracket !== 'all') {
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(item => {
      const bracket = getMonthsOutstandingBracket(item.monthsOutstanding);
      return bracket === filters.monthsOutstandingBracket;
    });
  }
  
  // Apply debt range filter
  if (filters.debtRange && filters.debtRange !== 'all') {
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(item => {
      const amount = Math.abs(item.totalOutstandingAmt);
      
      // Parse the debt range
      if (filters.debtRange === '100001+') {
        return amount > 100000;
      }

      const [min, max] = filters.debtRange?.split('-').map(Number) || [0, 0];
      return amount >= min && amount <= max;
    });
  }
  
  // Apply SMER segment filter
  if (filters.smerSegment && filters.smerSegment !== 'all') {
    filteredDetailedCustomerData = filteredDetailedCustomerData.filter(item => {
      if (filters.smerSegment === 'BLANK') {
        return !item.smerSegment || item.smerSegment.trim() === '';
      }
      return item.smerSegment === filters.smerSegment;
    });
  }
  
  // Create filtered data object
  const filteredData: DebtData = {
    debtByStation: filteredDebtByStation,
    accClassDebtSummary: filteredAccClassDebtSummary,
    accDefinitionDebt: filteredAccDefinitionDebt,
    staffDebt: filteredStaffDebt,
    detailedCustomerData: filteredDetailedCustomerData
  };
  
  return {
    summary: mockSummaryData,
    debt: filteredData
  };
};