import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import HomePage from './pages/system-page/HomePage';
import LoginPage from './pages/system-page/LoginPage';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
import StudentProfiles from './pages/admin-pages/StudentProfiles';
import FacultyProfiles from './pages/admin-pages/FacultyProfiles';
import Events from './pages/admin-pages/Events';
import Scheduling from './pages/admin-pages/Scheduling';
import Research from './pages/admin-pages/Research';
import InstructionsPage from './pages/admin-pages/InstructionsPage';
import UserManagement from './pages/admin-pages/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* System Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/user-management" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute>
              <StudentProfiles />
            </ProtectedRoute>
          } />
          <Route path="/admin/faculty" element={
            <ProtectedRoute>
              <FacultyProfiles />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/admin/scheduling" element={
            <ProtectedRoute>
              <Scheduling />
            </ProtectedRoute>
          } />
          <Route path="/admin/research" element={
            <ProtectedRoute>
              <Research />
            </ProtectedRoute>
          } />
          <Route path="/admin/instructions" element={
            <ProtectedRoute>
              <InstructionsPage />
            </ProtectedRoute>
          } />
          
          {/* Redirect /admin to /admin/login */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
