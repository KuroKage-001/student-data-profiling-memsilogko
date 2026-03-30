// Filter faculty by search term
export const filterBySearchTerm = (faculty, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return faculty;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return faculty.filter(member => 
    member.name?.toLowerCase().includes(term) ||
    member.email?.toLowerCase().includes(term) ||
    member.faculty_id?.toLowerCase().includes(term) ||
    member.department?.toLowerCase().includes(term) ||
    member.position?.toLowerCase().includes(term) ||
    member.specialization?.toLowerCase().includes(term)
  );
};

// Apply multiple filters to faculty list
export const applyFacultyFilters = (faculty, filters) => {
  let filtered = [...faculty];

  // Department filter
  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter(f => f.department === filters.department);
  }

  // Position filter
  if (filters.position && filters.position !== 'all') {
    filtered = filtered.filter(f => f.position === filters.position);
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(f => f.status === filters.status);
  }

  return filtered;
};

// Get unique departments from faculty list
export const getUniqueDepartments = (faculty) => {
  if (!faculty || faculty.length === 0) return [];
  
  const departments = faculty
    .map(f => f.department)
    .filter(Boolean)
    .filter((dept, index, self) => self.indexOf(dept) === index)
    .sort();
  
  return departments;
};

// Get unique positions from faculty list
export const getUniquePositions = (faculty) => {
  if (!faculty || faculty.length === 0) return [];
  
  const positions = faculty
    .map(f => f.position)
    .filter(Boolean)
    .filter((pos, index, self) => self.indexOf(pos) === index)
    .sort();
  
  return positions;
};

// Get unique statuses from faculty list
export const getUniqueStatuses = (faculty) => {
  if (!faculty || faculty.length === 0) return [];
  
  const statuses = faculty
    .map(f => f.status)
    .filter(Boolean)
    .filter((status, index, self) => self.indexOf(status) === index)
    .sort();
  
  return statuses;
};

// Sort faculty by field
export const sortFaculty = (faculty, sortBy = 'name', sortOrder = 'asc') => {
  const sorted = [...faculty].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Handle null/undefined values
    if (aVal == null) aVal = '';
    if (bVal == null) bVal = '';

    // Convert to lowercase for string comparison
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};
