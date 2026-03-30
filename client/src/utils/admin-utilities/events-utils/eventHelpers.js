/**
 * Get status badge color classes based on event status
 * @param {string} status - Event status
 * @returns {string} Tailwind CSS classes for status badge
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-orange-100 text-orange-800';
    case 'Ongoing':
      return 'bg-green-100 text-green-800';
    case 'Completed':
      return 'bg-gray-100 text-gray-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format event data for form
 * @param {object} event - Event object
 * @returns {object} Formatted form data
 */
export const formatEventForForm = (event) => {
  return {
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    type: event.type,
    status: event.status,
    attendees: event.attendees,
    description: event.description || '',
  };
};

/**
 * Build query parameters for API requests
 * @param {string} filterStatus - Filter status value
 * @param {string} searchTerm - Search term
 * @returns {object} Query parameters object
 */
export const buildQueryParams = (filterStatus, searchTerm) => {
  const params = {};
  if (filterStatus !== 'All') params.status = filterStatus;
  if (searchTerm) params.search = searchTerm;
  return params;
};

/**
 * Parse input value for form handling
 * @param {string} name - Input field name
 * @param {string} value - Input field value
 * @returns {string|number} Parsed value
 */
export const parseInputValue = (name, value) => {
  return name === 'attendees' ? parseInt(value) || 0 : value;
};

/**
 * Validate event form data
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result { isValid, errors }
 */
export const validateEventForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Event title is required';
  }

  if (!formData.date) {
    errors.date = 'Event date is required';
  }

  if (!formData.time) {
    errors.time = 'Event time is required';
  }

  if (!formData.location?.trim()) {
    errors.location = 'Event location is required';
  }

  if (formData.attendees < 0) {
    errors.attendees = 'Attendees cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
