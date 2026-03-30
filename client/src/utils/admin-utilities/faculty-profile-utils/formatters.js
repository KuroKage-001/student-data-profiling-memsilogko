import { FACULTY_STATUS_LABELS, FACULTY_STATUS_COLORS, DATE_FORMAT_OPTIONS } from './constants';

// Format faculty data for display
export const formatFacultyForDisplay = (faculty) => {
  if (!faculty) return null;
  
  return {
    id: faculty.id,
    faculty_id: faculty.faculty_id || faculty.id,
    name: faculty.name || 'N/A',
    email: faculty.email || 'N/A',
    phone: faculty.phone || 'N/A',
    department: faculty.department || 'N/A',
    position: faculty.position || 'N/A',
    specialization: faculty.specialization || 'N/A',
    office: faculty.office || 'N/A',
    status: faculty.status || 'active',
    hire_date: faculty.hire_date || faculty.hireDate || 'N/A',
    address: faculty.address || 'N/A',
    notes: faculty.notes || 'No notes',
    created_at: faculty.created_at || new Date().toISOString(),
    updated_at: faculty.updated_at || new Date().toISOString()
  };
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Get status color classes
export const getStatusColor = (status) => {
  return FACULTY_STATUS_COLORS[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Get status label
export const getStatusLabel = (status) => {
  return FACULTY_STATUS_LABELS[status?.toLowerCase()] || 'Unknown';
};

// Format faculty for Excel export
export const formatFacultyForExport = (faculty, index) => {
  return {
    'No.': index + 1,
    'Faculty ID': faculty.faculty_id || faculty.id,
    'Name': faculty.name,
    'Email': faculty.email || 'N/A',
    'Phone': faculty.phone || 'N/A',
    'Department': faculty.department || 'N/A',
    'Position': faculty.position || 'N/A',
    'Specialization': faculty.specialization || 'N/A',
    'Office': faculty.office || 'N/A',
    'Status': faculty.status ? faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1) : 'N/A',
    'Hire Date': formatDate(faculty.hire_date || faculty.hireDate),
    'Address': faculty.address || 'N/A',
    'Notes': faculty.notes || 'N/A'
  };
};

// Format phone number (optional enhancement)
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};
