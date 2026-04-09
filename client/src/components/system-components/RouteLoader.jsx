import { Suspense } from 'react';
import LoadingPage from './LoadingPage';

/**
 * Route Loader Component
 * Handles lazy loading of route components with loading fallback
 */
const RouteLoader = ({ children, fallback }) => {
  const defaultFallback = <LoadingPage message="Loading page..." subMessage="Please wait..." />;

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default RouteLoader;
