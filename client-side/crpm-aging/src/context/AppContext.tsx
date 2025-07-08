import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getDebtData } from '../services/api';
import type { DebtData, SummaryData, FilterOptions } from '../types/dashboard.type.ts';
import type { UploadStatus } from '../types/upload.types.ts';

interface AppContextProps {
  // Upload state
  uploadStatus: UploadStatus;
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>;
  uploadedFile: File | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
  
  // Dashboard data
  summaryData: SummaryData | null;
  debtData: DebtData | null;
  isLoading: boolean;
  
  // Filters
  filters: {
    businessArea: string;
    setBusinessArea: (value: string) => void;
    businessAreaOptions: FilterOptions[];
    
    accStatus: string;
    setAccStatus: (value: string) => void;
    accStatusOptions: FilterOptions[];
    
    netPositiveBalance: string;
    setNetPositiveBalance: (value: string) => void;
    netPositiveBalanceOptions: FilterOptions[];
    
    accClass: string;
    setAccClass: (value: string) => void;
    accClassOptions: FilterOptions[];
    
    accDefinition: string;
    setAccDefinition: (value: string) => void;
    accDefinitionOptions: FilterOptions[];
    
    governmentType: string;
    setGovernmentType: (value: string) => void;
    governmentTypeOptions: FilterOptions[];
    
    mitFilter: string;
    setMitFilter: (value: string) => void;
    mitFilterOptions: FilterOptions[];
    
    monthsOutstandingBracket: string;
    setMonthsOutstandingBracket: (value: string) => void;
    monthsOutstandingBracketOptions: FilterOptions[];
    
    // New debt range filter
    debtRange: string;
    setDebtRange: (value: string) => void;
    debtRangeOptions: FilterOptions[];
    
    // New SMER segment filter
    smerSegment: string;
    setSmerSegment: (value: string) => void;
    smerSegmentOptions: FilterOptions[];
    
    // Centralized view type
    viewType: 'tradeReceivable' | 'agedDebt';
    setViewType: (value: 'tradeReceivable' | 'agedDebt') => void;
  };
  
  // Actions
  refreshData: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Upload state
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Dashboard data
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [debtData, setDebtData] = useState<DebtData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Filters
  const [businessArea, setBusinessArea] = useState<string>('all');
  const [accStatus, setAccStatus] = useState<string>('all');
  const [netPositiveBalance, setNetPositiveBalance] = useState<string>('all');
  const [accClass, setAccClass] = useState<string>('all');
  const [accDefinition, setAccDefinition] = useState<string>('all');
  const [governmentType, setGovernmentType] = useState<string>('all');
  const [mitFilter, setMitFilter] = useState<string>('all');
  const [monthsOutstandingBracket, setMonthsOutstandingBracket] = useState<string>('all');
  // Add new filters
  const [debtRange, setDebtRange] = useState<string>('all');
  const [smerSegment, setSmerSegment] = useState<string>('all');
  const [viewType, setViewType] = useState<'tradeReceivable' | 'agedDebt'>('agedDebt');
  
  // Filter options
  const businessAreaOptions: FilterOptions[] = [
    { value: 'all', label: 'All Business Areas' },
    { value: '6210', label: 'TNB IPOH' },
    { value: '6211', label: 'TNB KAMPAR' },
    { value: '6212', label: 'TNB BIDOR' },
    { value: '6213', label: 'TNB TANJONG MALIM' },
    { value: '6218', label: 'TNB SERI ISKANDAR' },
    { value: '6219', label: 'TNB ULU KINTA' },
    { value: '6220', label: 'TNB TAIPING' },
    { value: '6221', label: 'TNB BATU GAJAH' },
    { value: '6222', label: 'TNB KUALA KANGSAR' },
    { value: '6223', label: 'TNB GERIK' },
    { value: '6224', label: 'TNB BAGAN SERAI' },
    { value: '6225', label: 'TNB SG. SIPUT' },
    { value: '6227', label: 'TNB SRI MANJUNG' },
    { value: '6250', label: 'TNB TELUK INTAN' },
    { value: '6252', label: 'TNB HUTAN MELINTANG' },
  ];
  
  const accStatusOptions: FilterOptions[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
  
  const netPositiveBalanceOptions: FilterOptions[] = [
    { value: 'all', label: 'All Balances' },
    { value: 'positive', label: 'Positive Balance' },
    { value: 'negative', label: 'Negative Balance' },
  ];
  
  const accClassOptions: FilterOptions[] = [
    { value: 'all', label: 'All Classes' },
    { value: 'LPCG', label: 'LPCG' },
    { value: 'LPCN', label: 'LPCN' },
    { value: 'OPCG', label: 'OPCG' },
    { value: 'OPCN', label: 'OPCN' },
  ];
  
  const accDefinitionOptions: FilterOptions[] = [
    { value: 'all', label: 'All' },
    { value: 'AG', label: 'AG' },
    { value: 'CM', label: 'CM' },
    { value: 'DM', label: 'DM' },
    { value: 'IN', label: 'IN' },
    { value: 'SL', label: 'SL' },
    { value: 'MN', label: 'MN' },
  ];
  
  const governmentTypeOptions: FilterOptions[] = [
    { value: 'all', label: 'All Types' },
    { value: 'government', label: 'Government' },
    { value: 'non-government', label: 'Non-Government' },
  ];
  
  const mitFilterOptions: FilterOptions[] = [
    { value: 'all', label: 'All' },
    { value: 'mit', label: 'MIT' },
    { value: 'non-mit', label: 'Non-MIT' },
  ];
  
  const monthsOutstandingBracketOptions: FilterOptions[] = [
    { value: 'all', label: 'All Ranges' },
    { value: '0-3', label: '0-3 Months' },
    { value: '3-6', label: '3-6 Months' },
    { value: '6-9', label: '6-9 Months' },
    { value: '9-12', label: '9-12 Months' },
    { value: '>12', label: '>12 Months' },
  ];
  
  // Add new filter options
  const debtRangeOptions: FilterOptions[] = [
    { value: 'all', label: 'All Debt Ranges' },
    { value: '0.01-200', label: 'RM0.01 - RM200' },
    { value: '201-500', label: 'RM201 - RM500' },
    { value: '501-1000', label: 'RM501 - RM1,000' },
    { value: '1001-3000', label: 'RM1,001 - RM3,000' },
    { value: '3001-5000', label: 'RM3,001 - RM5,000' },
    { value: '5001-10000', label: 'RM5,001 - RM10,000' },
    { value: '10001-30000', label: 'RM10,001 - RM30,000' },
    { value: '30001-50000', label: 'RM30,001 - RM50,000' },
    { value: '50001-100000', label: 'RM50,001 - RM100,000' },
    { value: '100001+', label: 'RM100,000+' },
  ];
  
  const smerSegmentOptions: FilterOptions[] = [
    { value: 'all', label: 'All Segments' },
    { value: 'EMRB', label: 'EMRB' },
    { value: 'GNLA', label: 'GNLA' },
    { value: 'HRES', label: 'HRES' },
    { value: 'MASR', label: 'MASR' },
    { value: 'MEDB', label: 'MEDB' },
    { value: 'MICB', label: 'MICB' },
    { value: 'SMLB', label: 'SMLB' },
    { value: 'BLANK', label: 'BLANKS' },
  ];
  
  // Load data when component mounts or when filters change
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getDebtData({
          businessArea,
          accStatus,
          netPositiveBalance,
          accClass,
          accDefinition,
          monthsOutstandingBracket,
          debtRange, // Add new filter
          smerSegment, // Add new filter
        });
        
        setSummaryData(data.summary);
        setDebtData(data.debt);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [
    businessArea, accStatus, netPositiveBalance, accClass, 
    accDefinition, governmentType, mitFilter, monthsOutstandingBracket,
    debtRange, smerSegment // Add new dependencies
  ]);
  
  // Refresh data function
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await getDebtData({
        businessArea,
        accStatus,
        netPositiveBalance,
        accClass,
        accDefinition,
        monthsOutstandingBracket,
        debtRange, // Add new filter
        smerSegment, // Add new filter
      });
      
      setSummaryData(data.summary);
      setDebtData(data.debt);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    // Upload state
    uploadStatus,
    setUploadStatus,
    uploadedFile,
    setUploadedFile,
    
    // Dashboard data
    summaryData,
    debtData,
    isLoading,
    
    // Filters
    filters: {
      businessArea,
      setBusinessArea,
      businessAreaOptions,
      
      accStatus,
      setAccStatus,
      accStatusOptions,
      
      netPositiveBalance,
      setNetPositiveBalance,
      netPositiveBalanceOptions,
      
      accClass,
      setAccClass,
      accClassOptions,
      
      accDefinition,
      setAccDefinition,
      accDefinitionOptions,
      
      governmentType,
      setGovernmentType,
      governmentTypeOptions,
      
      mitFilter,
      setMitFilter,
      mitFilterOptions,
      
      monthsOutstandingBracket,
      setMonthsOutstandingBracket,
      monthsOutstandingBracketOptions,
      
      // Add new filters
      debtRange,
      setDebtRange,
      debtRangeOptions,
      
      smerSegment,
      setSmerSegment,
      smerSegmentOptions,
      
      // Centralized view type
      viewType,
      setViewType,
    },
    
    // Actions
    refreshData,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};