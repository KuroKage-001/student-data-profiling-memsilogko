import axiosInstance from '../login-service/axiosConfig';

// Helper function to normalize student data
const normalizeStudentData = (student) => {
  if (!student) return null;
  
  return {
    ...student,
    gpa: student.gpa ? parseFloat(student.gpa) : null,
    student_id: student.student_id || student.id,
    phone: student.phone || null,
    address: student.address || null,
    program: student.program || null,
    year_level: student.year_level || null,
    enrollment_date: student.enrollment_date || null,
    graduation_date: student.graduation_date || null,
    guardian_name: student.guardian_name || null,
    guardian_phone: student.guardian_phone || null,
    notes: student.notes || null,
    status: student.status || 'active',
    // Convert skills array to comma-separated string
    skills: student.skills && Array.isArray(student.skills) 
      ? student.skills.map(s => s.skill_name).join(', ') 
      : (student.skills || null),
    // Convert activities array to comma-separated string
    extracurricular_activities: student.activities && Array.isArray(student.activities)
      ? student.activities.map(a => a.activity_name).join(', ')
      : (student.extracurricular_activities || null)
  };
};

const studentService = {
  // Get all students with optional filters
  getStudents: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/students', { params });
      // Normalize student data
      if (response.data.success && response.data.data.data) {
        response.data.data.data = response.data.data.data.map(normalizeStudentData);
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students'
      };
    }
  },

  // Get single student by ID
  getStudentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      // Normalize student data
      if (response.data.success && response.data.data) {
        response.data.data = normalizeStudentData(response.data.data);
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student'
      };
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    try {
      // Transform skills and activities from text to array format if needed
      const transformedData = {
        ...studentData,
        skills: studentData.skills && studentData.skills.trim() 
          ? studentData.skills.split(',')
              .map(skill => skill.trim())
              .filter(skill => skill.length > 0)
              .map(skill => ({
                skill_name: skill,
                proficiency_level: 'intermediate',
                description: null
              }))
          : [],
        activities: studentData.extracurricular_activities && studentData.extracurricular_activities.trim()
          ? studentData.extracurricular_activities.split(',')
              .map(activity => activity.trim())
              .filter(activity => activity.length > 0)
              .map(activity => ({
                activity_name: activity,
                activity_type: 'extracurricular',
                organization: null,
                role: null,
                start_date: null,
                end_date: null,
                description: null
              }))
          : []
      };

      // Remove the text field
      delete transformedData.extracurricular_activities;

      const response = await axiosInstance.post('/students', transformedData);
      // Normalize student data
      if (response.data.success && response.data.data) {
        response.data.data = normalizeStudentData(response.data.data);
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create student',
        errors: error.response?.data?.errors
      };
    }
  },

  // Update student
  updateStudent: async (id, studentData) => {
    try {
      // Transform skills and activities from text to array format if needed
      const transformedData = {
        ...studentData,
        skills: studentData.skills && studentData.skills.trim()
          ? studentData.skills.split(',')
              .map(skill => skill.trim())
              .filter(skill => skill.length > 0)
              .map(skill => ({
                skill_name: skill,
                proficiency_level: 'intermediate',
                description: null
              }))
          : [],
        activities: studentData.extracurricular_activities && studentData.extracurricular_activities.trim()
          ? studentData.extracurricular_activities.split(',')
              .map(activity => activity.trim())
              .filter(activity => activity.length > 0)
              .map(activity => ({
                activity_name: activity,
                activity_type: 'extracurricular',
                organization: null,
                role: null,
                start_date: null,
                end_date: null,
                description: null
              }))
          : []
      };

      // Remove the text field
      delete transformedData.extracurricular_activities;

      const response = await axiosInstance.put(`/students/${id}`, transformedData);
      // Normalize student data
      if (response.data.success && response.data.data) {
        response.data.data = normalizeStudentData(response.data.data);
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student',
        errors: error.response?.data?.errors
      };
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/students/${id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete student'
      };
    }
  },

  // Get student statistics
  getStudentStatistics: async () => {
    try {
      const response = await axiosInstance.get('/students-statistics');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student statistics'
      };
    }
  },

  // Generate student ID
  generateStudentId: () => {
    const prefix = 'STU';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear().toString().slice(-2);
    return `${prefix}${year}${randomNum}`;
  },

  // Get available programs
  getPrograms: () => {
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

  // Get available year levels
  getYearLevels: () => {
    return ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
  },

  // Get available statuses
  getStatuses: () => {
    return ['active', 'inactive', 'suspended'];
  },

  // Format student data for display
  formatStudentForDisplay: (student) => {
    return {
      ...student,
      formattedGPA: student.gpa ? student.gpa.toFixed(2) : 'N/A',
      formattedEnrollmentDate: student.enrollment_date 
        ? new Date(student.enrollment_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'N/A',
      formattedGraduationDate: student.graduation_date 
        ? new Date(student.graduation_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Not set',
      statusLabel: student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Unknown'
    };
  }
};

export default studentService;