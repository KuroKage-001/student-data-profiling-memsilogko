import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import DynamicRouteGuard from './context/DynamicRouteGuard';
import RouteLoader from './components/system-components/RouteLoader';
import LoadingPage from './components/system-components/LoadingPage';
import { useDynamicRoutes } from './hooks/useDynamicRoutes';
import { specialRoutes } from './config/routeConfig';

// Create a client with professional caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 2, // Retry failed requests twice
      staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnMount: false, // Don't refetch on component mount if data is fresh
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
  },
});

// Dynamic Routes Component
const DynamicRoutes = () => {
  const { routes, loading } = useDynamicRoutes();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      {/* Dynamically generated routes */}
      {routes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={
            <DynamicRouteGuard route={route}>
              <RouteLoader>
                <route.component />
              </RouteLoader>
            </DynamicRouteGuard>
          }
        />
      ))}

      {/* Special routes - redirects */}
      <Route 
        path={specialRoutes.adminRedirect.from} 
        element={<Navigate to={specialRoutes.adminRedirect.to} replace />} 
      />
      <Route 
        path={specialRoutes.facultyRedirect.from} 
        element={<Navigate to={specialRoutes.facultyRedirect.to} replace />} 
      />
      
      {/* Catch all route */}
      <Route 
        path={specialRoutes.notFound.from} 
        element={<Navigate to={specialRoutes.notFound.to} replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <DynamicRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
