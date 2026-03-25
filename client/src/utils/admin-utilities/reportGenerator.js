/**
 * Report Generator Utility
 * Fast and simple report generation without external dependencies
 */

/**
 * Generate a text report for a student
 * @param {Object} student - Student data object
 * @returns {string} Formatted text report
 */
export const generateStudentTextReport = (student) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatGPA = (gpa) => {
    if (!gpa && gpa !== 0) return 'N/A';
    const gpaNumber = parseFloat(gpa);
    if (isNaN(gpaNumber)) return 'N/A';
    return gpaNumber.toFixed(2);
  };

  const capitalize = (str) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return `
STUDENT PROFILE REPORT
=====================

Personal Information:
- Name: ${student.name || 'N/A'}
- Student ID: ${student.student_id || student.id || 'N/A'}
- Email: ${student.email || 'N/A'}
- Phone: ${student.phone || 'N/A'}
- Address: ${student.address || 'N/A'}

Academic Information:
- Program: ${student.program || 'N/A'}
- Year Level: ${student.year_level || 'N/A'}
- GPA: ${formatGPA(student.gpa)}
- Status: ${capitalize(student.status)}
- Enrollment Date: ${formatDate(student.enrollment_date)}
- Expected Graduation: ${formatDate(student.graduation_date)}

Guardian Information:
- Guardian Name: ${student.guardian_name || 'N/A'}
- Guardian Phone: ${student.guardian_phone || 'N/A'}

Skills & Activities:
- Skills: ${student.skills || 'N/A'}
- Extracurricular Activities: ${student.extracurricular_activities || 'N/A'}

Additional Notes:
${student.notes || 'No additional notes'}

Generated on: ${new Date().toLocaleString()}
  `.trim();
};

/**
 * Download a text report
 * @param {string} content - Report content
 * @param {string} filename - Download filename
 */
export const downloadTextReport = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate and download a student report
 * @param {Object} student - Student data object
 * @returns {string} Generated filename
 */
export const generateAndDownloadStudentReport = (student) => {
  const report = generateStudentTextReport(student);
  const filename = `student_report_${student.student_id || student.id}_${new Date().toISOString().split('T')[0]}.txt`;
  downloadTextReport(report, filename);
  return filename;
};

/**
 * Generate a CSV report for multiple students
 * @param {Array} students - Array of student objects
 * @returns {string} CSV content
 */
export const generateStudentCSVReport = (students) => {
  if (!students || students.length === 0) return '';

  const headers = [
    'ID',
    'Student ID',
    'Name',
    'Email',
    'Phone',
    'Program',
    'Year Level',
    'GPA',
    'Status',
    'Enrollment Date',
    'Skills',
    'Activities'
  ];

  const rows = students.map(student => [
    student.id || '',
    student.student_id || '',
    student.name || '',
    student.email || '',
    student.phone || '',
    student.program || '',
    student.year_level || '',
    student.gpa || '',
    student.status || '',
    student.enrollment_date || '',
    student.skills || '',
    student.extracurricular_activities || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Download a CSV report
 * @param {Array} students - Array of student objects
 * @param {string} filename - Download filename
 */
export const downloadCSVReport = (students, filename) => {
  const csvContent = generateStudentCSVReport(students);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate a summary report for multiple students
 * @param {Array} students - Array of student objects
 * @returns {string} Summary report content
 */
export const generateStudentSummaryReport = (students) => {
  if (!students || students.length === 0) {
    return 'No students to report';
  }

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const inactiveStudents = students.filter(s => s.status === 'inactive').length;
  const suspendedStudents = students.filter(s => s.status === 'suspended').length;

  // Calculate average GPA
  const validGPAs = students.filter(s => s.gpa && !isNaN(parseFloat(s.gpa)));
  const averageGPA = validGPAs.length > 0
    ? (validGPAs.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / validGPAs.length).toFixed(2)
    : 'N/A';

  // Count by program
  const programCounts = {};
  students.forEach(s => {
    if (s.program) {
      programCounts[s.program] = (programCounts[s.program] || 0) + 1;
    }
  });

  // Count by year level
  const yearLevelCounts = {};
  students.forEach(s => {
    if (s.year_level) {
      yearLevelCounts[s.year_level] = (yearLevelCounts[s.year_level] || 0) + 1;
    }
  });

  return `
STUDENT SUMMARY REPORT
=====================

Overview:
- Total Students: ${totalStudents}
- Active Students: ${activeStudents}
- Inactive Students: ${inactiveStudents}
- Suspended Students: ${suspendedStudents}
- Average GPA: ${averageGPA}

Students by Program:
${Object.entries(programCounts).map(([program, count]) => `- ${program}: ${count}`).join('\n')}

Students by Year Level:
${Object.entries(yearLevelCounts).map(([level, count]) => `- ${level}: ${count}`).join('\n')}

Generated on: ${new Date().toLocaleString()}
  `.trim();
};

/**
 * Download a summary report
 * @param {Array} students - Array of student objects
 * @param {string} filename - Download filename
 */
export const downloadSummaryReport = (students, filename) => {
  const report = generateStudentSummaryReport(students);
  downloadTextReport(report, filename);
};
