// Calculate faculty statistics
export const calculateFacultyStats = (faculty) => {
  if (!faculty || faculty.length === 0) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      onLeave: 0,
      retired: 0,
      byDepartment: {},
      byPosition: {},
      averageYearsOfService: 0
    };
  }

  const stats = {
    total: faculty.length,
    active: 0,
    inactive: 0,
    onLeave: 0,
    retired: 0,
    byDepartment: {},
    byPosition: {},
    averageYearsOfService: 0
  };

  let totalYearsOfService = 0;
  let yearsCount = 0;

  faculty.forEach(member => {
    // Count by status
    switch (member.status?.toLowerCase()) {
      case 'active':
        stats.active++;
        break;
      case 'inactive':
        stats.inactive++;
        break;
      case 'on_leave':
        stats.onLeave++;
        break;
      case 'retired':
        stats.retired++;
        break;
    }

    // Count by department
    if (member.department) {
      stats.byDepartment[member.department] = (stats.byDepartment[member.department] || 0) + 1;
    }

    // Count by position
    if (member.position) {
      stats.byPosition[member.position] = (stats.byPosition[member.position] || 0) + 1;
    }

    // Calculate years of service
    if (member.hire_date || member.hireDate) {
      const hireDate = new Date(member.hire_date || member.hireDate);
      const today = new Date();
      const years = (today - hireDate) / (1000 * 60 * 60 * 24 * 365.25);
      
      if (years >= 0) {
        totalYearsOfService += years;
        yearsCount++;
      }
    }
  });

  // Calculate average years of service
  if (yearsCount > 0) {
    stats.averageYearsOfService = (totalYearsOfService / yearsCount).toFixed(1);
  }

  return stats;
};

// Get faculty count by department
export const getFacultyCountByDepartment = (faculty) => {
  if (!faculty || faculty.length === 0) return {};

  return faculty.reduce((acc, member) => {
    const dept = member.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
};

// Get faculty count by position
export const getFacultyCountByPosition = (faculty) => {
  if (!faculty || faculty.length === 0) return {};

  return faculty.reduce((acc, member) => {
    const pos = member.position || 'Unknown';
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {});
};

// Get faculty count by status
export const getFacultyCountByStatus = (faculty) => {
  if (!faculty || faculty.length === 0) return {};

  return faculty.reduce((acc, member) => {
    const status = member.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
};

// Calculate years of service for a faculty member
export const calculateYearsOfService = (hireDate) => {
  if (!hireDate) return 0;

  const hire = new Date(hireDate);
  const today = new Date();
  const years = (today - hire) / (1000 * 60 * 60 * 24 * 365.25);

  return years >= 0 ? Math.floor(years) : 0;
};
