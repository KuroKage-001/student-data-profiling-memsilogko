// Admin utility functions for the CCS Comprehensive Profiling System

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return '0.00';
  
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  
  const totalPoints = grades.reduce((sum, grade) => sum + (gradePoints[grade] || 0), 0);
  return (totalPoints / grades.length).toFixed(2);
};

export const getStatusColor = (status) => {
  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-red-100 text-red-800',
    'Suspended': 'bg-yellow-100 text-yellow-800',
    'On Leave': 'bg-blue-100 text-blue-800',
    'Graduated': 'bg-purple-100 text-purple-800'
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const filterStudents = (students, searchTerm, filters = {}) => {
  let filtered = students;
  
  // Apply search term filter
  if (searchTerm) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply additional filters
  if (filters.program) {
    filtered = filtered.filter(student => student.program === filters.program);
  }
  
  if (filters.year) {
    filtered = filtered.filter(student => student.year === filters.year);
  }
  
  if (filters.status) {
    filtered = filtered.filter(student => student.status === filters.status);
  }
  
  return filtered;
};

export const filterFaculty = (faculty, searchTerm, filters = {}) => {
  let filtered = faculty;
  
  // Apply search term filter
  if (searchTerm) {
    filtered = filtered.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply additional filters
  if (filters.department) {
    filtered = filtered.filter(member => member.department === filters.department);
  }
  
  if (filters.position) {
    filtered = filtered.filter(member => member.position === filters.position);
  }
  
  if (filters.status) {
    filtered = filtered.filter(member => member.status === filters.status);
  }
  
  return filtered;
};

export const generateStudentReport = (student) => {
  return {
    id: student.id,
    name: student.name,
    program: student.program,
    year: student.year,
    gpa: student.gpa,
    status: student.status,
    enrollmentDate: student.enrollmentDate,
    generatedAt: new Date().toISOString(),
    reportType: 'Student Profile Summary'
  };
};

export const generateFacultyReport = (faculty) => {
  return {
    id: faculty.id,
    name: faculty.name,
    department: faculty.department,
    position: faculty.position,
    specialization: faculty.specialization,
    status: faculty.status,
    hireDate: faculty.hireDate,
    courses: faculty.courses,
    generatedAt: new Date().toISOString(),
    reportType: 'Faculty Profile Summary'
  };
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const generateStudentId = (program, year) => {
  const programCode = program.substring(0, 2).toUpperCase();
  const yearCode = year.toString().slice(-2);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${programCode}${yearCode}${randomNum}`;
};

export const generateFacultyId = (department) => {
  const deptCode = department.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FAC${deptCode}${randomNum}`;
};