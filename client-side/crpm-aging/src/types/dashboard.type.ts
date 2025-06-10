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
}

// Summary data structure
export interface SummaryData {
  totalOutstandingAmt: number;
  totalOutstandingAmtChange: number;
  active: number;
  inactive: number;
  netProfit: number;
  netProfitChange: number;
  positiveBalance: number;
  mit: number;
}

// Debt by station data structure
export interface DebtByStationData {
  businessArea: string;
  station: string;
  numOfAccounts: number;
  debtAmount: number;
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
}

// Complete debt data structure
export interface DebtData {
  debtByStation: DebtByStationData[];
  accClassDebtSummary: AccClassDebtSummaryData[];
  accDefinitionDebt: AccDefinitionDebtData[];
  staffDebt: StaffDebtData[];
  detailedCustomerData: DetailedCustomerData[];
}