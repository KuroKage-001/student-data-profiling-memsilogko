/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format GPA to 2 decimal places
 */
export const formatGPA = (gpa) => {
  if (gpa === null || gpa === undefined) return '0.00';
  return parseFloat(gpa).toFixed(2);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get academic year label
 */
export const getAcademicYearLabel = (year) => {
  const yearMap = {
    1: '1st Year',
    2: '2nd Year',
    3: '3rd Year',
    4: '4th Year',
    5: '5th Year'
  };
  return yearMap[year] || `${year}th Year`;
};

/**
 * Get semester label
 */
export const getSemesterLabel = (semester) => {
  const semesterMap = {
    1: '1st Semester',
    2: '2nd Semester',
    3: 'Summer'
  };
  return semesterMap[semester] || `Semester ${semester}`;
};

/**
 * Calculate completion percentage
 */
export const calculateCompletionPercentage = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};
