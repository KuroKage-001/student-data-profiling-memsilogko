/**
 * Format a number with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format GPA to 2 decimal places
 * @param {number} gpa - The GPA value
 * @returns {string} Formatted GPA string
 */
export const formatGPA = (gpa) => {
  if (gpa === null || gpa === undefined) return '0.00';
  return parseFloat(gpa).toFixed(2);
};

/**
 * Format date to readable string
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format date to short format (without time)
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get status badge color based on status
 * @param {string} status - The status value
 * @returns {object} Object with background and text color classes
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: { bg: 'bg-green-100', text: 'text-green-800' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
    suspended: { bg: 'bg-red-100', text: 'text-red-800' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    enrolled: { bg: 'bg-green-100', text: 'text-green-800' },
    dropped: { bg: 'bg-red-100', text: 'text-red-800' },
  };
  
  return statusColors[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

/**
 * Calculate percentage
 * @param {number} value - The current value
 * @param {number} total - The total value
 * @returns {number} Percentage value
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};
