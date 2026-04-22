import * as XLSX from 'xlsx';
import { EXCEL_COLUMN_WIDTHS } from './constants';
import { formatFacultyForExport } from './formatters';
import { generateExportFilename } from './generators';

// Export faculty list to Excel
export const exportFacultyToExcel = (faculty, filename = null) => {
  if (!faculty || faculty.length === 0) {
    throw new Error('No faculty data to export');
  }

  try {
    // Prepare data for export
    const exportData = faculty.map((member, index) => formatFacultyForExport(member, index));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: EXCEL_COLUMN_WIDTHS.NO },
      { wch: EXCEL_COLUMN_WIDTHS.FACULTY_ID },
      { wch: EXCEL_COLUMN_WIDTHS.NAME },
      { wch: EXCEL_COLUMN_WIDTHS.EMAIL },
      { wch: EXCEL_COLUMN_WIDTHS.PHONE },
      { wch: EXCEL_COLUMN_WIDTHS.DEPARTMENT },
      { wch: EXCEL_COLUMN_WIDTHS.POSITION },
      { wch: EXCEL_COLUMN_WIDTHS.SPECIALIZATION },
      { wch: EXCEL_COLUMN_WIDTHS.OFFICE },
      { wch: EXCEL_COLUMN_WIDTHS.STATUS },
      { wch: EXCEL_COLUMN_WIDTHS.HIRE_DATE },
      { wch: EXCEL_COLUMN_WIDTHS.ADDRESS },
      { wch: EXCEL_COLUMN_WIDTHS.NOTES }
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Faculty List');

    // Generate filename
    const exportFilename = filename || generateExportFilename();

    // Write file
    XLSX.writeFile(wb, exportFilename);

    return exportFilename;
  } catch (error) {
    throw new Error('Failed to export faculty list');
  }
};

// Export filtered faculty data
export const exportFilteredFaculty = (faculty, filters, filename = null) => {
  const filteredFaculty = applyFilters(faculty, filters);
  return exportFacultyToExcel(filteredFaculty, filename);
};

// Helper function to apply filters (used internally)
const applyFilters = (faculty, filters) => {
  let filtered = [...faculty];

  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter(f => f.department === filters.department);
  }

  if (filters.position && filters.position !== 'all') {
    filtered = filtered.filter(f => f.position === filters.position);
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(f => f.status === filters.status);
  }

  return filtered;
};
