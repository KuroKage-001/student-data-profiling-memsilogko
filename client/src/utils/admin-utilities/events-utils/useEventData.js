import { useState, useEffect } from 'react';
import { INITIAL_STATISTICS } from './eventConstants';
import { fetchEvents, fetchStatistics } from './eventHandlers';

/**
 * Custom hook for managing event data fetching
 * @param {string} filterStatus - Filter status value
 * @param {string} searchTerm - Search term
 * @returns {object} Events data and loading state
 */
export const useEventData = (filterStatus, searchTerm) => {
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState(INITIAL_STATISTICS);
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    fetchEvents(filterStatus, searchTerm, setEvents, setLoading);
  };

  const loadStatistics = () => {
    fetchStatistics(setStatistics);
  };

  const refreshData = () => {
    loadEvents();
    loadStatistics();
  };

  useEffect(() => {
    loadEvents();
    loadStatistics();
  }, [filterStatus, searchTerm]);

  return {
    events,
    statistics,
    loading,
    refreshData,
  };
};
