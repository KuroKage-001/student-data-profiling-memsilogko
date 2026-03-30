import axiosInstance from '../login-service/axiosConfig';

// Helper function to normalize faculty data
const normalizeFacultyData = (faculty) => {
  if (!faculty) return null;
  
  return {
    ...faculty,
    faculty_id: faculty.faculty_id || faculty.id,
    phone: faculty.phone || null,
    address: faculty.address || null,
    department: faculty.department || null,
    position: faculty.position || null,
    specialization: faculty.specialization || null,
    office: faculty.office || null,
    hire_date: faculty.hire_date || faculty.hireDate || null,
    notes: faculty.notes || null,
    status: faculty.status?.toLowerCase() || 'active'
  };
};

const facultyService = {
  // Get all faculty members with optional filters
  getFaculty: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/faculty', { params });
      
      // Normalize faculty data
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          response.data.data = response.data.data.map(normalizeFacultyData);
        } else if (response.data.data.data) {
          response.data.data.data = response.data.data.data.map(normalizeFacultyData);
        }
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Faculty endpoint not found. Please ensure the backend server is running.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch faculty'
      };
    }
  },

  // Get single faculty member by ID
  getFacultyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/faculty/${id}`);
      
      // Normalize faculty data
      if (response.data.success && response.data.data) {
        response.data.data = normalizeFacultyData(response.data.data);
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Faculty member not found'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch faculty'
      };
    }
  },

  // Create new faculty member
  createFaculty: async (facultyData) => {
    try {
      const response = await axiosInstance.post('/faculty', facultyData);
      
      // Check if response indicates success
      if (response.data && response.data.success) {
        // Normalize faculty data if present
        if (response.data.data) {
          response.data.data = normalizeFacultyData(response.data.data);
        }
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Faculty created successfully'
        };
      }
      
      // Fallback for unexpected response format
      return {
        success: false,
        message: response.data?.message || 'Unexpected response format',
        errors: response.data?.errors
      };
    } catch (error) {
      // Handle 404 specifically
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Faculty endpoint not found. Please ensure the backend server is running.',
          errors: null
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create faculty',
        errors: error.response?.data?.errors
      };
    }
  },

  // Update faculty member
  updateFaculty: async (id, facultyData) => {
    try {
      const response = await axiosInstance.put(`/faculty/${id}`, facultyData);
      
      // Check if response indicates success
      if (response.data && response.data.success) {
        // Normalize faculty data if present
        if (response.data.data) {
          response.data.data = normalizeFacultyData(response.data.data);
        }
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Faculty updated successfully'
        };
      }
      
      // Fallback for unexpected response format
      return {
        success: false,
        message: response.data?.message || 'Unexpected response format',
        errors: response.data?.errors
      };
    } catch (error) {
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return {
          success: false,
          message: 'Server timeout. Please ensure the Laravel backend server is running (php artisan serve).',
          errors: null
        };
      }
      
      // Handle 404 specifically
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Faculty member not found or endpoint not available. Please check if the backend server is running.',
          errors: null
        };
      }
      
      // Handle network errors
      if (!error.response) {
        return {
          success: false,
          message: error.message || 'Cannot connect to backend server. Please ensure the Laravel server is running.',
          errors: null
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update faculty',
        errors: error.response?.data?.errors
      };
    }
  },

  // Delete faculty member
  deleteFaculty: async (id) => {
    try {
      const response = await axiosInstance.delete(`/faculty/${id}`);
      
      return {
        success: true,
        message: response.data.message || 'Faculty deleted successfully'
      };
    } catch (error) {
      // Handle 404 specifically
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Faculty member not found'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete faculty'
      };
    }
  },

  // Get faculty statistics
  getFacultyStatistics: async () => {
    try {
      const response = await axiosInstance.get('/faculty-statistics');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch faculty statistics'
      };
    }
  },

  // Generate faculty ID
  generateFacultyId: () => {
    const prefix = 'FAC';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear().toString().slice(-2);
    return `${prefix}${year}${randomNum}`;
  },

  // Get available departments
  getDepartments: () => {
    return [
      'Computer Science',
      'Information Technology',
      'Computer Engineering',
      'Data Science',
      'Software Engineering',
      'Information Systems',
      'Cybersecurity',
      'Artificial Intelligence',
      'Computer Networks',
      'Web Development'
    ];
  },

  // Get available positions
  getPositions: () => {
    return [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Lecturer',
      'Instructor',
      'Adjunct Professor',
      'Department Head',
      'Dean'
    ];
  },

  // Get available statuses
  getStatuses: () => {
    return ['active', 'inactive', 'on leave'];
  },

  // Format faculty data for display
  formatFacultyForDisplay: (faculty) => {
    return {
      ...faculty,
      formattedHireDate: faculty.hire_date || faculty.hireDate
        ? new Date(faculty.hire_date || faculty.hireDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'N/A',
      statusLabel: faculty.status ? faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1) : 'Unknown'
    };
  }
};

export default facultyService;
