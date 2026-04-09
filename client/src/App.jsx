import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import DynamicRouteGuard from './context/DynamicRouteGuard';
import RouteLoader from './components/system-components/RouteLoader';
import LoadingPage from './components/system-components/LoadingPage';
import { useDynamicRoutes } from './hooks/useDynamicRoutes';
import { specialRoutes } from './config/routeConfig';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
