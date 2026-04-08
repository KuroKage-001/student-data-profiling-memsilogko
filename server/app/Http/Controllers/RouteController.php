<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RouteController extends Controller
{
    /**
     * Get available routes based on user role
     * This is optional - can be used for database-driven routing
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user ? $user->role : null;

        $routes = $this->getRoutesByRole($role);

        return response()->json([
            'success' => true,
            'routes' => $routes,
            'role' => $role,
        ]);
    }

    /**
     * Get route configuration by role
     */
    private function getRoutesByRole($role)
    {
        $allRoutes = [
            [
                'id' => 'home',
                'path' => '/',
                'component' => 'HomePage',
                'isPublic' => true,
                'title' => 'Home',
                'roles' => ['*'],
            ],
            [
                'id' => 'login',
                'path' => '/admin/login',
                'component' => 'LoginPage',
                'isPublic' => true,
                'title' => 'Login',
                'roles' => ['*'],
            ],
            [
                'id' => 'profile-settings',
                'path' => '/profile/settings',
                'component' => 'UserProfileSettings',
                'isPublic' => false,
                'title' => 'Profile Settings',
                'roles' => ['admin', 'faculty', 'student'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'admin-dashboard',
                'path' => '/admin/dashboard',
                'component' => 'AdminDashboard',
                'isPublic' => false,
                'title' => 'Dashboard',
                'roles' => ['admin'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'user-management',
                'path' => '/admin/user-management',
                'component' => 'UserManagement',
                'isPublic' => false,
                'title' => 'User Management',
                'roles' => ['admin'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'student-profiles',
                'path' => '/admin/students',
                'component' => 'StudentProfiles',
                'isPublic' => false,
                'title' => 'Student Profiles',
                'roles' => ['admin', 'faculty'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'faculty-profiles',
                'path' => '/admin/faculty',
                'component' => 'FacultyProfiles',
                'isPublic' => false,
                'title' => 'Faculty Profiles',
                'roles' => ['admin'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'events',
                'path' => '/admin/events',
                'component' => 'Events',
                'isPublic' => false,
                'title' => 'Events',
                'roles' => ['admin', 'faculty'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'scheduling',
                'path' => '/admin/scheduling',
                'component' => 'Scheduling',
                'isPublic' => false,
                'title' => 'Scheduling',
                'roles' => ['admin', 'faculty'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'research',
                'path' => '/admin/research',
                'component' => 'Research',
                'isPublic' => false,
                'title' => 'Research',
                'roles' => ['admin', 'faculty'],
                'requiresAuth' => true,
            ],
            [
                'id' => 'instructions',
                'path' => '/admin/instructions',
                'component' => 'InstructionsPage',
                'isPublic' => false,
                'title' => 'Instructions',
                'roles' => ['admin'],
                'requiresAuth' => true,
            ],
        ];

        // Filter routes based on role
        if (!$role) {
            return array_filter($allRoutes, function($route) {
                return $route['isPublic'];
            });
        }

        return array_filter($allRoutes, function($route) use ($role) {
            return in_array('*', $route['roles']) || in_array($role, $route['roles']);
        });
    }

    /**
     * Check if user has access to a specific route
     */
    public function checkAccess(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $user = Auth::user();
        $role = $user ? $user->role : null;
        $path = $request->input('path');

        $routes = $this->getRoutesByRole($role);
        $hasAccess = collect($routes)->contains('path', $path);

        return response()->json([
            'success' => true,
            'hasAccess' => $hasAccess,
            'role' => $role,
        ]);
    }
}
