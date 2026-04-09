import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import DynamicRouteGuard from './context/DynamicRouteGuard';
import RouteLoader from './components/system-components/RouteLoader';
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-50">
        <div className="flex flex-col items-center gap-6 relative">
          {/* Decorative background circles */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl"></div>
          
          {/* Main spinner */}
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600 absolute top-0 left-0"></div>
            
            {/* Center logo/icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">C</span>
              </div>
            </div>
          </div>
          
          {/* Loading text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 font-semibold text-lg">Loading application...</p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          
          {/* System name */}
          <div className="text-center mt-2">
            <p className="text-orange-600 text-sm font-medium">CCS PnC Profiling System</p>
            <p className="text-gray-400 text-xs mt-1">Initializing...</p>
          </div>
        </div>
      </div>
    );
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
