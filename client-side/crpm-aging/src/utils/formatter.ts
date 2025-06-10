/**
 * Format a number as currency (RM)
 */
export const formatCurrency = (value: number, minimumFractionDigits = 2, maximumFractionDigits = 2): string => {
  return `RM ${value.toLocaleString('en-MY', {
    minimumFractionDigits,
    maximumFractionDigits
  })}`;
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

/**
 * Format a large number with k/M/B suffix
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format account status
 */
export const formatAccountStatus = (status: string): string => {
  if (!status) return '-';
  
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};