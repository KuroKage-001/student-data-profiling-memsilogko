import { FACULTY_ID_PREFIX } from './constants';

// Generate unique faculty ID
export const generateFacultyId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${FACULTY_ID_PREFIX}${year}${randomNum}`;
};

// Generate filename with timestamp
export const generateExportFilename = (prefix = 'Faculty_List') => {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}.xlsx`;
};

// Generate report filename for individual faculty
export const generateReportFilename = (facultyName) => {
  const sanitizedName = facultyName.replace(/[^a-z0-9]/gi, '_');
  const date = new Date().toISOString().split('T')[0];
  return `Faculty_Report_${sanitizedName}_${date}.pdf`;
};
