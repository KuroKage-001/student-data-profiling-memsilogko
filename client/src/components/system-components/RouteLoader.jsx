import { Suspense } from 'react';

/**
 * Route Loader Component
 * Handles lazy loading of route components with loading fallback
 */
const RouteLoader = ({ children, fallback }) => {
  const defaultFallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading page...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default RouteLoader;
