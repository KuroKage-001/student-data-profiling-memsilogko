import api from './api';

/**
 * Student Event API Service
 * MVP: Basic event viewing and registration
 */
export const studentEventAPI = {
  /**
   * Get student's registered events
   */
  getMyEvents: async () => {
    const response = await api.get('/student/my-events');
    return response.data;
  },

  /**
   * Get all events (for students to view)
   */
  getAllEvents: async (params = {}) => {
    const response = await api.get('/student/all-events', { params });
    return response.data;
  },

  /**
   * Register student for event (Admin/Faculty only)
   */
  registerStudent: async (eventId, studentId) => {
    const response = await api.post(`/events/${eventId}/register-student`, { student_id: studentId });
    return response.data;
  },

  /**
   * Unregister student from event (Admin/Faculty only)
   */
  unregisterStudent: async (eventId, studentId) => {
    const response = await api.delete(`/events/${eventId}/unregister-student/${studentId}`);
    return response.data;
  },

  /**
   * Mark attendance (Admin/Faculty only)
   */
  markAttendance: async (eventId, studentId, attendanceStatus) => {
    const response = await api.post(`/events/${eventId}/mark-attendance`, {
      student_id: studentId,
      attendance_status: attendanceStatus,
    });
    return response.data;
  },

  /**
   * Get event attendees (Admin/Faculty only)
   */
  getEventAttendees: async (eventId) => {
    const response = await api.get(`/events/${eventId}/attendees`);
    return response.data;
  },

  /**
   * Bulk register students (Admin/Faculty only)
   */
  bulkRegister: async (eventId, studentIds) => {
    const response = await api.post(`/events/${eventId}/bulk-register`, { student_ids: studentIds });
    return response.data;
  },
};

export default studentEventAPI;
