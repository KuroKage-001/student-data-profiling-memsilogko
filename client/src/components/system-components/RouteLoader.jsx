import { Suspense, memo } from 'react';
import LoadingPage from './LoadingPage';

/**
 * Optimized Route Loader Component
 * - Memoized to prevent unnecessary re-renders
 * - Handles lazy loading with intelligent fallback
 * - Supports custom loading states
 */
const RouteLoader = memo(({ children, fallback, message, subMessage }) => {
  const defaultFallback = (
    <LoadingPage 
      message={message || "Loading page..."} 
      subMessage={subMessage || "Please wait..."} 
    />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
});

RouteLoader.displayName = 'RouteLoader';

export default RouteLoader;
