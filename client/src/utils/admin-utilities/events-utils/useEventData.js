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
  const [statsLoading, setStatsLoading] = useState(true);

  const loadEvents = () => {
    fetchEvents(filterStatus, searchTerm, setEvents, setLoading);
  };

  const loadStatistics = async () => {
    setStatsLoading(true);
    await fetchStatistics(setStatistics);
    setStatsLoading(false);
  };

  const refreshData = () => {
    loadEvents();
    loadStatistics();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setStatsLoading(true);
      
      // Load both events and statistics in parallel
      await Promise.all([
        fetchEvents(filterStatus, searchTerm, setEvents, () => {}),
        fetchStatistics(setStatistics)
      ]);
      
      setLoading(false);
      setStatsLoading(false);
    };

    loadData();
  }, [filterStatus, searchTerm]);

  return {
    events,
    statistics,
    loading: loading || statsLoading, // Loading is true if either is loading
    refreshData,
  };
};
