// Route Configuration
// This file defines all available routes in the application
// Routes can be loaded dynamically and filtered based on user roles

import { lazy } from 'react';

// Lazy load components for better performance
const HomePage = lazy(() => import('../pages/system-page/HomePage'));
const LoginPage = lazy(() => import('../pages/system-page/LoginPage'));
const UserProfileSettings = lazy(() => import('../pages/system-page/UserProfileSettings'));
const AdminDashboard = lazy(() => import('../pages/admin-pages/AdminDashboard'));
const StudentDashboard = lazy(() => import('../pages/student-pages/StudentDashboard'));
const StudentProfiles = lazy(() => import('../pages/admin-pages/StudentProfiles'));
const FacultyProfiles = lazy(() => import('../pages/admin-pages/FacultyProfiles'));
const Events = lazy(() => import('../pages/admin-pages/Events'));
const Scheduling = lazy(() => import('../pages/admin-pages/Scheduling'));
const Research = lazy(() => import('../pages/admin-pages/Research'));
const InstructionsPage = lazy(() => import('../pages/admin-pages/InstructionsPage'));
const UserManagement = lazy(() => import('../pages/admin-pages/UserManagement'));

// Route definitions with metadata
export const routeConfig = [
  {
    id: 'home',
    path: '/',
    component: HomePage,
    isPublic: true,
    title: 'Home',
    roles: ['*'], // * means all roles including unauthenticated
  },
  {
    id: 'login',
    path: '/admin/login',
    component: LoginPage,
    isPublic: true,
    title: 'Admin Login',
    roles: ['*'],
  },
  {
    id: 'student-login',
    path: '/login',
    component: LoginPage,
    isPublic: true,
    title: 'Student Login',
    roles: ['*'],
  },
  {
    id: 'profile-settings',
    path: '/profile/settings',
    component: UserProfileSettings,
    isPublic: false,
    title: 'Profile Settings',
    roles: ['admin', 'dept_chair', 'faculty', 'student'],
    requiresAuth: true,
  },
  {
    id: 'admin-dashboard',
    path: '/admin/dashboard',
    component: AdminDashboard,
    isPublic: false,
    title: 'Dashboard',
    roles: ['admin', 'dept_chair', 'faculty'],
    requiresAuth: true,
  },
  {
    id: 'student-dashboard',
    path: '/student/dashboard',
    component: StudentDashboard,
    isPublic: false,
    title: 'Student Dashboard',
    roles: ['student'],
    requiresAuth: true,
  },
  {
    id: 'user-management',
    path: '/admin/user-management',
    component: UserManagement,
    isPublic: false,
    title: 'User Management',
    roles: ['admin'],
    requiresAuth: true,
  },
  {
    id: 'student-profiles',
    path: '/admin/students',
    component: StudentProfiles,
    isPublic: false,
    title: 'Student Profiles',
    roles: ['admin', 'faculty'],
    requiresAuth: true,
  },
  {
    id: 'faculty-profiles',
    path: '/admin/faculty',
    component: FacultyProfiles,
    isPublic: false,
    title: 'Faculty Profiles',
    roles: ['admin', 'dept_chair'],
    requiresAuth: true,
  },
  {
    id: 'events',
    path: '/admin/events',
    component: Events,
    isPublic: false,
    title: 'Events',
    roles: ['admin', 'faculty'],
    requiresAuth: true,
  },
  {
    id: 'scheduling',
    path: '/admin/scheduling',
    component: Scheduling,
    isPublic: false,
    title: 'Scheduling',
    roles: ['admin', 'dept_chair', 'faculty'],
    requiresAuth: true,
  },
  {
    id: 'research',
    path: '/admin/research',
    component: Research,
    isPublic: false,
    title: 'Research',
    roles: ['admin', 'faculty'],
    requiresAuth: true,
  },
  {
    id: 'instructions',
    path: '/admin/instructions',
    component: InstructionsPage,
    isPublic: false,
    title: 'Instructions',
    roles: ['admin'],
    requiresAuth: true,
  },
];

// Special routes (redirects, catch-all)
export const specialRoutes = {
  adminRedirect: {
    from: '/admin',
    to: '/admin/login',
  },
  notFound: {
    from: '*',
    to: '/',
  },
};

// Helper function to get routes by role
export const getRoutesByRole = (userRole) => {
  if (!userRole) {
    return routeConfig.filter(route => route.isPublic);
  }
  
  return routeConfig.filter(route => 
    route.roles.includes('*') || route.roles.includes(userRole)
  );
};

// Helper function to check if user has access to a route
export const hasRouteAccess = (routePath, userRole) => {
  const route = routeConfig.find(r => r.path === routePath);
  if (!route) return false;
  
  if (route.isPublic) return true;
  if (!userRole) return false;
  
  return route.roles.includes('*') || route.roles.includes(userRole);
};
