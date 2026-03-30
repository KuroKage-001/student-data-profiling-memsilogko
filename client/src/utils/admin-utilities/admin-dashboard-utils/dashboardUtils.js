/**
 * Format number with commas for better readability
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatDashboardNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {object} Object with percentage and type (increase/decrease)
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) {
    return { percentage: '0%', type: 'neutral' };
  }
  
  const change = ((current - previous) / previous) * 100;
  const roundedChange = Math.round(change);
  
  return {
    percentage: `${roundedChange > 0 ? '+' : ''}${roundedChange}%`,
    type: roundedChange > 0 ? 'increase' : roundedChange < 0 ? 'decrease' : 'neutral'
  };
};

/**
 * Format statistics data for dashboard display
 * @param {object} statsData - Raw statistics data from API
 * @returns {object} Formatted statistics
 */
export const formatDashboardStats = (statsData) => {
  if (!statsData) return null;
  
  return {
    totalStudents: statsData.total_students || 0,
    activeStudents: statsData.active_students || 0,
    inactiveStudents: statsData.inactive_students || 0,
    suspendedStudents: statsData.suspended_students || 0,
    averageGPA: statsData.average_gpa ? parseFloat(statsData.average_gpa).toFixed(2) : '0.00',
    byProgram: statsData.by_program || [],
    byYearLevel: statsData.by_year_level || []
  };
};
