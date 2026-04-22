import { toast } from 'react-toastify';
import { eventsAPI } from '../../../services/system-service/apiService';
import { buildQueryParams } from './eventHelpers';

/**
 * Fetch events from API
 * @param {string} filterStatus - Filter status value
 * @param {string} searchTerm - Search term
 * @param {function} setEvents - State setter for events
 * @param {function} setLoading - State setter for loading
 */
export const fetchEvents = async (filterStatus, searchTerm, setEvents, setLoading) => {
  try {
    setLoading(true);
    const params = buildQueryParams(filterStatus, searchTerm);
    
    const response = await eventsAPI.getAll(params);
    if (response.success) {
      setEvents(response.data);
    }
  } catch (error) {
    toast.error('Failed to load events');
  } finally {
    setLoading(false);
  }
};

/**
 * Fetch event statistics from API
 * @param {function} setStatistics - State setter for statistics
 */
export const fetchStatistics = async (setStatistics) => {
  try {
    const response = await eventsAPI.getStatistics();
    if (response.success) {
      setStatistics(response.data);
    }
  } catch (error) {
    // Silently handle statistics fetch error
  }
};

/**
 * Handle event submission (create or update)
 * @param {object} params - Handler parameters
 * @returns {Promise<boolean>} Success status
 */
export const handleEventSubmit = async ({
  event,
  formData,
  editingEvent,
  setSubmitting,
  onSuccess,
}) => {
  event.preventDefault();
  setSubmitting(true);

  try {
    if (editingEvent) {
      const response = await eventsAPI.update(editingEvent.id, formData);
      if (response.success) {
        toast.success('Event updated successfully');
        onSuccess();
        return true;
      }
    } else {
      const response = await eventsAPI.create(formData);
      if (response.success) {
        toast.success('Event created successfully');
        onSuccess();
        return true;
      }
    }
    return false;
  } catch (error) {
    toast.error(error.message || 'Failed to save event');
    return false;
  } finally {
    setSubmitting(false);
  }
};

/**
 * Handle event deletion
 * @param {string|number} eventId - Event ID to delete
 * @param {function} onSuccess - Success callback
 * @returns {Promise<boolean>} Success status
 */
export const handleEventDelete = async (eventId, onSuccess) => {
  if (!window.confirm('Are you sure you want to delete this event?')) {
    return false;
  }

  try {
    const response = await eventsAPI.delete(eventId);
    if (response.success) {
      toast.success('Event deleted successfully');
      onSuccess();
      return true;
    }
    return false;
  } catch (error) {
    toast.error('Failed to delete event');
    return false;
  }
};
