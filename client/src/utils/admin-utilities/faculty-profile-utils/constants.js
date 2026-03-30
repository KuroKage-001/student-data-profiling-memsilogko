// Faculty Profile Constants

// Faculty Status Options
export const FACULTY_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  RETIRED: 'retired'
};

// Faculty Status Labels
export const FACULTY_STATUS_LABELS = {
  [FACULTY_STATUSES.ACTIVE]: 'Active',
  [FACULTY_STATUSES.INACTIVE]: 'Inactive',
  [FACULTY_STATUSES.ON_LEAVE]: 'On Leave',
  [FACULTY_STATUSES.RETIRED]: 'Retired'
};

// Faculty Status Colors (Tailwind classes)
export const FACULTY_STATUS_COLORS = {
  [FACULTY_STATUSES.ACTIVE]: 'bg-green-100 text-green-800',
  [FACULTY_STATUSES.INACTIVE]: 'bg-red-100 text-red-800',
  [FACULTY_STATUSES.ON_LEAVE]: 'bg-yellow-100 text-yellow-800',
  [FACULTY_STATUSES.RETIRED]: 'bg-gray-100 text-gray-800'
};

// Department Options
export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Engineering',
  'Business Administration',
  'Education',
  'Arts and Sciences',
  'Nursing',
  'Other'
];

// Position/Rank Options
export const POSITIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Instructor',
  'Lecturer',
  'Adjunct Faculty',
  'Visiting Professor',
  'Research Fellow'
];

// Search Debounce Delay (ms)
export const SEARCH_DEBOUNCE_DELAY = 500;

// Excel Export Column Widths
export const EXCEL_COLUMN_WIDTHS = {
  NO: 5,
  FACULTY_ID: 12,
  NAME: 25,
  EMAIL: 30,
  PHONE: 15,
  DEPARTMENT: 25,
  POSITION: 20,
  SPECIALIZATION: 25,
  OFFICE: 12,
  STATUS: 10,
  HIRE_DATE: 15,
  ADDRESS: 30,
  NOTES: 40
};

// Date Format Options
export const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

// Faculty ID Prefix
export const FACULTY_ID_PREFIX = 'FAC';
