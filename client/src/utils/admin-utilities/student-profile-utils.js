import * as XLSX from 'xlsx';

// Student Profile Utility Functions

// Format student data for display
export const formatStudentForDisplay = (student) => {
  if (!student) return null;
  
  return {
    id: student.id,
    name: student.name || 'N/A',
    email: student.email || 'N/A',
    student_id: student.student_id || 'N/A',
    phone: student.phone || 'N/A',
    address: student.address || 'N/A',
    program: student.program || 'N/A',
    year_level: student.year_level || 'N/A',
    gpa: student.gpa ? student.gpa.toFixed(2) : 'N/A',
    status: student.status || 'active',
    enrollment_date: student.enrollment_date || 'N/A',
    graduation_date: student.graduation_date || 'N/A',
    guardian_name: student.guardian_name || 'N/A',
    guardian_phone: student.guardian_phone || 'N/A',
    notes: student.notes || 'No notes',
    created_at: student.created_at || new Date().toISOString(),
    updated_at: student.updated_at || new Date().toISOString()
  };
};

// Calculate student statistics
export const calculateStudentStats = (students) => {
  if (!students || students.length === 0) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      suspended: 0,
      averageGPA: 0,
      byProgram: {},
      byYearLevel: {}
    };
  }

  const stats = {
    total: students.length,
    active: 0,
    inactive: 0,
    suspended: 0,
    averageGPA: 0,
    byProgram: {},
    byYearLevel: {}
  };

  let totalGPA = 0;
  let gpaCount = 0;

  students.forEach(student => {
    // Count by status
    switch (student.status?.toLowerCase()) {
      case 'active':
        stats.active++;
        break;
      case 'inactive':
        stats.inactive++;
        break;
      case 'suspended':
        stats.suspended++;
        break;
    }

    // Count by program
    if (student.program) {
      stats.byProgram[student.program] = (stats.byProgram[student.program] || 0) + 1;
    }

    // Count by year level
    if (student.year_level) {
      stats.byYearLevel[student.year_level] = (stats.byYearLevel[student.year_level] || 0) + 1;
    }

    // Calculate GPA average
    if (student.gpa) {
      totalGPA += parseFloat(student.gpa) || 0;
      gpaCount++;
    }
  });

  // Calculate average GPA
  if (gpaCount > 0) {
    stats.averageGPA = (totalGPA / gpaCount).toFixed(2);
  }

  return stats;
};

// Validate student data
export const validateStudentData = (studentData) => {
  const errors = {};

  if (!studentData.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!studentData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!studentData.student_id?.trim()) {
    errors.student_id = 'Student ID is required';
  }

  if (!studentData.program?.trim()) {
    errors.program = 'Program is required';
  }

  if (!studentData.year_level?.trim()) {
    errors.year_level = 'Year level is required';
  }

  if (studentData.gpa !== undefined) {
    const gpa = parseFloat(studentData.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
      errors.gpa = 'GPA must be between 0 and 4.0';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generate student ID
export const generateStudentId = () => {
  const prefix = 'STU';
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${year}${randomNum}`;
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get status color
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get status label
export const getStatusLabel = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'suspended':
      return 'Suspended';
    default:
      return 'Unknown';
  }
};

// Get year level label
export const getYearLevelLabel = (yearLevel) => {
  const yearMap = {
    '1st': '1st Year',
    '2nd': '2nd Year',
    '3rd': '3rd Year',
    '4th': '4th Year',
    '5th': '5th Year'
  };
  return yearLevel ? (yearMap[yearLevel] || yearLevel) : 'N/A';
};

// Export student data to CSV
export const exportToCSV = (students, filename = 'students.csv') => {
  if (!students || students.length === 0) return;

  const headers = ['ID', 'Name', 'Email', 'Student ID', 'Program', 'Year Level', 'GPA', 'Status'];
  const csvData = [
    headers,
    ...students.map(student => [
      student.id,
      student.name,
      student.email,
      student.student_id,
      student.program,
      student.year_level,
      student.gpa || 'N/A',
      student.status
    ])
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Export student data to Excel (XLSX)
export const exportToExcel = (students, filename = 'students.xlsx') => {
  if (!students || students.length === 0) return;

  try {
    // Prepare data with all fields
    const data = students.map(student => ({
      'ID': student.id || '',
      'Student ID': student.student_id || '',
      'Name': student.name || '',
      'Email': student.email || '',
      'Phone': student.phone || '',
      'Address': student.address || '',
      'Program': student.program || '',
      'Year Level': student.year_level || '',
      'GPA': student.gpa || '',
      'Status': student.status || '',
      'Enrollment Date': student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : '',
      'Graduation Date': student.graduation_date ? new Date(student.graduation_date).toLocaleDateString() : '',
      'Guardian Name': student.guardian_name || '',
      'Guardian Phone': student.guardian_phone || '',
      'Skills': student.skills || '',
      'Extracurricular Activities': student.extracurricular_activities || '',
      'Notes': student.notes || ''
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = [
      { wch: 8 },  // ID
      { wch: 15 }, // Student ID
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 30 }, // Address
      { wch: 25 }, // Program
      { wch: 12 }, // Year Level
      { wch: 8 },  // GPA
      { wch: 10 }, // Status
      { wch: 15 }, // Enrollment Date
      { wch: 15 }, // Graduation Date
      { wch: 20 }, // Guardian Name
      { wch: 15 }, // Guardian Phone
      { wch: 30 }, // Skills
      { wch: 30 }, // Extracurricular Activities
      { wch: 40 }  // Notes
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    throw new Error('Failed to export to Excel');
  }
};

// Filter and sort students
export const filterAndSortStudents = (students, filters, sortBy = 'name', sortOrder = 'asc') => {
  let filtered = [...students];

  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.student_id.toLowerCase().includes(searchTerm) ||
      student.program.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.program && filters.program !== 'all') {
    filtered = filtered.filter(student => student.program === filters.program);
  }

  if (filters.yearLevel && filters.yearLevel !== 'all') {
    filtered = filtered.filter(student => student.year_level === filters.yearLevel);
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(student => student.status === filters.status);
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'program':
        aVal = a.program.toLowerCase();
        bVal = b.program.toLowerCase();
        break;
      case 'gpa':
        aVal = a.gpa || 0;
        bVal = b.gpa || 0;
        break;
      default:
        aVal = a[sortBy];
        bVal = b[sortBy];
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};