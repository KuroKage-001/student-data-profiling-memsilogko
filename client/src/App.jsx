import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/system-page/HomePage';
import AdminLogin from './pages/admin-pages/AdminLogin';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
import StudentProfiles from './pages/admin-pages/StudentProfiles';
import FacultyProfiles from './pages/admin-pages/FacultyProfiles';
import Events from './pages/admin-pages/Events';
import Scheduling from './pages/admin-pages/Scheduling';
import Research from './pages/admin-pages/Research';
import Instructions from './pages/admin-pages/Instructions';

function App() {
  return (
    <Router>
      <Routes>
        {/* System Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentProfiles />} />
        <Route path="/admin/faculty" element={<FacultyProfiles />} />
        <Route path="/admin/events" element={<Events />} />
        <Route path="/admin/scheduling" element={<Scheduling />} />
        <Route path="/admin/research" element={<Research />} />
        <Route path="/admin/instructions" element={<Instructions />} />
        
        {/* Redirect /admin to /admin/login */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
