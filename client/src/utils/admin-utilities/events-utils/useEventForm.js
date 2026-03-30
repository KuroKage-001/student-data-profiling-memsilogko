import { useState } from 'react';
import { INITIAL_FORM_DATA } from './eventConstants';
import { formatEventForForm, parseInputValue } from './eventHelpers';

/**
 * Custom hook for managing event form state
 * @returns {object} Form state and handlers
 */
export const useEventForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInputValue(name, value),
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setEditingEvent(null);
  };

  const loadEventForEdit = (event) => {
    setEditingEvent(event);
    setFormData(formatEventForForm(event));
  };

  const setFormDate = (date) => {
    setFormData(prev => ({
      ...prev,
      date,
    }));
  };

  return {
    formData,
    editingEvent,
    handleInputChange,
    resetForm,
    loadEventForEdit,
    setFormDate,
  };
};
