// Event form initial state
export const INITIAL_FORM_DATA = {
  title: '',
  date: '',
  time: '',
  location: '',
  type: 'Academic',
  status: 'Upcoming',
  attendees: 0,
  description: '',
};

// Event statistics initial state
export const INITIAL_STATISTICS = {
  total: 0,
  upcoming: 0,
  completed: 0,
  totalAttendees: 0,
};

// Event types
export const EVENT_TYPES = [
  { value: 'Academic', label: 'Academic' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Competition', label: 'Competition' },
  { value: 'Social', label: 'Social' },
  { value: 'Other', label: 'Other' },
];

// Event statuses
export const EVENT_STATUSES = [
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

// Filter options
export const FILTER_OPTIONS = [
  { value: 'All', label: 'All Status' },
  ...EVENT_STATUSES,
];

// View modes
export const VIEW_MODES = {
  CALENDAR: 'calendar',
  LIST: 'list',
};
