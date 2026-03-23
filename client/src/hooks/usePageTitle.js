import { useEffect } from 'react';

/**
 * Custom hook to dynamically update the page title
 * @param {string} title - The title to set for the page
 * @param {string} suffix - Optional suffix (defaults to "CCS PROFILING SYSTEM")
 */
const usePageTitle = (title, suffix = 'CCS PROFILING SYSTEM') => {
  useEffect(() => {
    const previousTitle = document.title;
    
    if (title) {
      document.title = `${title} | ${suffix}`;
    } else {
      document.title = suffix;
    }

    // Cleanup: restore previous title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

export default usePageTitle;
