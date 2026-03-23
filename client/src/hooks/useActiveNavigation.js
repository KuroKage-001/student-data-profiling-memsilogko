import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for managing active navigation state
 * @returns {Object} Active navigation state and setter
 */
export const useActiveNavigation = () => {
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/user-management')) return 'user-management';
    if (path.includes('/students')) return 'student-profile';
    if (path.includes('/faculty')) return 'faculty-profile';
    if (path.includes('/events')) return 'events';
    if (path.includes('/scheduling')) return 'scheduling';
    if (path.includes('/research')) return 'college-research';
    if (path.includes('/instructions')) return 'instructions';
    return 'dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Update active item when location changes
  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  return {
    activeItem,
    setActiveItem
  };
};