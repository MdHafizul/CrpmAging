import type { SummaryData, DebtData } from '../types/dashboard.type.ts';

// Generate a random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random currency amount with decimal places
const randomAmount = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

// Generate mock summary data
export const mockSummaryData: SummaryData = {
  totalOutstandingAmt: randomAmount(5000000, 8000000),
  totalOutstandingAmtChange: randomNumber(-5, 10),
  active: randomAmount(3000000, 5000000),
  inactive: randomAmount(1000000, 2000000),
  netProfit: randomAmount(800000, 1500000),
  netProfitChange: randomNumber(1, 15),
  positiveBalance: randomAmount(400000, 800000),
  mit: randomAmount(300000, 600000)
};

// Mock data for business areas and stations
const businessAreas = [
  { code: '6210', name: 'TNB IPOH' },
  { code: '6211', name: 'TNB KAMPAR' },
  { code: '6212', name: 'TNB BIDOR' },
  { code: '6213', name: 'TNB TANJONG MALIM' },
  { code: '6218', name: 'TNB SERI ISKANDAR' },
  { code: '6219', name: 'TNB ULU KINTA' },
  { code: '6220', name: 'TNB TAIPING' },
  { code: '6221', name: 'TNB BATU GAJAH' },
  { code: '6222', name: 'TNB KUALA KANGSAR' },
  { code: '6223', name: 'TNB GERIK' },
  { code: '6224', name: 'TNB BAGAN SERAI' },
  { code: '6225', name: 'TNB SG. SIPUT' },
  { code: '6227', name: 'TNB SRI MANJUNG' },
  { code: '6250', name: 'TNB TELUK INTAN' },
  { code: '6252', name: 'TNB HUTAN MELINTANG' }
];

// Generate debt by station data
const generateDebtByStationData = () => {
  return businessAreas.map(area => ({
    businessArea: area.code,
    station: area.name,
    numOfAccounts: randomNumber(100, 2000),
    debtAmount: randomAmount(100000, 800000)
  }));
};

// Generate account class data
const generateAccClassDebtSummary = () => {
  const accClasses = ['LPCG', 'LPCN', 'OPCG', 'OPCN'];
  
  const result = [];
  
  for (const area of businessAreas) {
    for (const accClass of accClasses) {
      if (Math.random() > 0.3) { // Add some randomness to the data
        result.push({
          businessArea: area.code,
          station: area.name,
          accClass,
          numOfAccounts: randomNumber(20, 500),
          debtAmount: randomAmount(10000, 200000)
        });
      }
    }
  }
  
  return result;
};

// Generate account definition debt data
const generateAccDefinitionDebt = () => {
  const accDefinitions = ['AG', 'CM', 'DM', 'IN', 'SL', 'MN'];
  
  const result = [];
  
  for (const area of businessAreas) {
    for (const accDefinition of accDefinitions) {
      if (Math.random() > 0.4) { // Add some randomness to the data
        result.push({
          businessArea: area.code,
          station: area.name,
          accDefinition,
          numOfAccounts: randomNumber(15, 400),
          debtAmount: randomAmount(8000, 150000)
        });
      }
    }
  }
  
  return result;
};

// Generate staff debt data
const generateStaffDebt = () => {
  return businessAreas.map(area => ({
    businessArea: area.code,
    station: area.name,
    numOfAccounts: randomNumber(10, 100),
    debtAmount: randomAmount(5000, 100000)
  }));
};

// Generate detailed customer data
const generateDetailedCustomerData = () => {
  const result = [];
  const accClasses = ['LPCG', 'LPCN', 'OPCG', 'OPCN'];
  const accDefinitions = ['AG', 'CM', 'DM', 'IN', 'SL', 'MN'];
  const accStatuses = ['Active', 'Inactive'];
  
  // Generate 100 random detailed records
  for (let i = 0; i < 100; i++) {
    const area = businessAreas[randomNumber(0, businessAreas.length - 1)];
    const lastPaymentDate = Math.random() > 0.2 ? 
      new Date(Date.now() - randomNumber(1, 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
      null;
    
    result.push({
      bpNo: `BP${randomNumber(10000, 99999)}`,
      contractAcc: `CA${randomNumber(100000, 999999)}`,
      contractAccountName: `Customer ${i + 1}`,
      businessArea: area.code,
      station: area.name,
      accStatus: accStatuses[randomNumber(0, 1)],
      accClass: accClasses[randomNumber(0, accClasses.length - 1)],
      accDefinition: accDefinitions[randomNumber(0, accDefinitions.length - 1)],
      totalOutstandingAmt: Math.random() > 0.7 ? randomAmount(-10000, -100) : randomAmount(100, 20000),
      lastPymtDate: lastPaymentDate,
      lastPymtAmt: lastPaymentDate ? randomAmount(50, 5000) : 0
    });
  }
  
  return result;
};

// Create mock debt data
export const mockDebtData: DebtData = {
  debtByStation: generateDebtByStationData(),
  accClassDebtSummary: generateAccClassDebtSummary(),
  accDefinitionDebt: generateAccDefinitionDebt(),
  staffDebt: generateStaffDebt(),
  detailedCustomerData: generateDetailedCustomerData()
};