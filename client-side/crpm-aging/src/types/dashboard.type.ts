// Filter option interface
export interface FilterOptions {
  value: string;
  label: string;
}

// Filter parameters for API requests
export interface FilterParams {
  businessArea: string;
  accStatus: string;
  netPositiveBalance: string;
  accClass: string;
  accDefinition: string;
  monthsOutstandingBracket?: string; // New filter for months outstanding bracket
  debtRange?: string; // New filter for debt range
  smerSegment?: string; // New filter for SMER segment
}

// Summary data structure
export interface SummaryData {
  totalOutstandingAmt: number;
  totalOutstandingAmtChange: number;
  totalOutstandingNumOfAccounts: number;
  active: number;
  activeNumOfAccounts: number;
  inactive: number;
  inactiveNumOfAccounts: number;
  netProfit: number;
  netProfitChange: number;
  netProfitNumOfAccounts: number;
  positiveBalance: number;
  positiveBalanceNumOfAccounts: number;
  negativeBalance: number;
  negativeBalanceNumOfAccounts: number;
  zeroBalance: number;
  zeroBalanceNumOfAccounts: number;
  mit: number;
  mitNumOfAccounts: number;
  totalUnpaid: number;
  totalUnpaidNumOfAccounts: number;
  currentMonthUnpaid: number;
  currentMonthUnpaidNumOfAccounts: number;
  totalUndue: number;
  totalUndueNumOfAccounts: number;
}

// Debt by station data structure
export interface DebtByStationData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
  // Additional fields for Trade Receivable view
  totalUndue?: number;
  curMthUnpaid?: number;
  ttlOsAmt?: number;
  totalUnpaid?: number;
}

// Account class debt summary
export interface AccClassDebtSummaryData extends DebtByStationData {
  accClass: string;
}

// Account definition debt
export interface AccDefinitionDebtData extends DebtByStationData {
  accDefinition: string;
}

// Staff debt data
export interface StaffDebtData extends DebtByStationData {}

// Detailed customer data
export interface DetailedCustomerData {
  bpNo: string;
  contractAcc: string;
  contractAccountName: string;
  businessArea: string;
  station: string;
  accStatus: string;
  accClass: string;
  accDefinition: string;
  totalOutstandingAmt: number;
  lastPymtDate: string | null;
  lastPymtAmt: number;
  monthsOutstanding: number; // New field for months outstanding
  staffId: string; // New field for staff ID
  mit: number; // New field for MIT amount
  smerSegment?: string; // Add SMER segment field
  // Additional fields for Trade Receivable view
  totalUndue?: number;
  curMthUnpaid?: number;
  ttlOsAmt?: number;
  totalUnpaid?: number;
}

// Complete debt data structure
export interface DebtData {
  debtByStation: DebtByStationData[];
  accClassDebtSummary: AccClassDebtSummaryData[];
  accDefinitionDebt: AccDefinitionDebtData[];
  staffDebt: StaffDebtData[];
  detailedCustomerData: DetailedCustomerData[];
}