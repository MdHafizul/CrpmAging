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
    { value: 'all', label: 'All Definitions' },
    { value: 'AG', label: 'AG' },
    { value: 'CM', label: 'CM' },
    { value: 'DM', label: 'DM' },
    { value: 'IN', label: 'IN' },
    { value: 'SL', label: 'SL' },
    { value: 'MN', label: 'MN' },
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
          accDefinition
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
  }, [businessArea, accStatus, netPositiveBalance, accClass, accDefinition]);
  
  // Refresh data function
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await getDebtData({
        businessArea,
        accStatus,
        netPositiveBalance,
        accClass,
        accDefinition
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