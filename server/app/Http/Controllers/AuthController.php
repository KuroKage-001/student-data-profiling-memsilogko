<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Login user and return JWT token (Optimized)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Fast validation
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'portal_type' => 'nullable|string|in:admin,faculty,student', // Added faculty portal type
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');
        $portalType = $request->input('portal_type');

        // Attempt authentication with optimized query
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Get user with only necessary fields for faster response
        $user = auth('api')->user();
        
        // Check user status before allowing login
        if ($user->status === 'inactive') {
            auth('api')->logout();
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact the administrator.',
                'status' => 'inactive'
            ], 403);
        }

        if ($user->status === 'suspended') {
            auth('api')->logout();
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended. Please contact the administrator.',
                'status' => 'suspended'
            ], 403);
        }

        // Portal-based role validation
        if ($portalType === 'admin') {
            // Admin portal: only admin allowed
            if ($user->role !== 'admin') {
                auth('api')->logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. This portal is for administrators only.',
                    'portal_mismatch' => true
                ], 403);
            }
        } elseif ($portalType === 'faculty') {
            // Faculty portal: only dept_chair and faculty allowed
            if (!in_array($user->role, ['dept_chair', 'faculty'])) {
                auth('api')->logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. This portal is for faculty and department chairs only.',
                    'portal_mismatch' => true
                ], 403);
            }
        } elseif ($portalType === 'student') {
            // Student portal: only students allowed
            if ($user->role !== 'student') {
                auth('api')->logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. This portal is for students only. Please use the appropriate portal for your role.',
                    'portal_mismatch' => true
                ], 403);
            }
        }
        
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'created_at' => $user->created_at,
        ];

        // Add student-specific fields if user is a student
        if ($user->role === 'student') {
            $userData['student_id'] = $user->student_id;
            $userData['student_number'] = $user->student_number;
            $userData['program'] = $user->program;
            $userData['year_level'] = $user->year_level;
            $userData['department'] = $user->department;
            $userData['phone'] = $user->phone;
            $userData['address'] = $user->address;
            $userData['gpa'] = $user->gpa;
        }

        // Add faculty-specific fields if user is faculty or dept_chair
        if (in_array($user->role, ['faculty', 'dept_chair'])) {
            $userData['department'] = $user->department;
            $userData['position'] = $user->position;
        }

        // Add admin-specific fields if user is admin
        if ($user->role === 'admin') {
            $userData['department'] = $user->department;
            $userData['position'] = $user->position;
        }
        
        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $userData
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    /**
     * Get authenticated user (Optimized)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth('api')->user();
        
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'created_at' => $user->created_at,
        ];

        // Add student-specific fields if user is a student
        if ($user->role === 'student') {
            $userData['student_id'] = $user->student_id;
            $userData['student_number'] = $user->student_number;
            $userData['program'] = $user->program;
            $userData['year_level'] = $user->year_level;
            $userData['department'] = $user->department;
            $userData['phone'] = $user->phone;
            $userData['address'] = $user->address;
            $userData['gpa'] = $user->gpa;
        }

        // Add faculty-specific fields if user is faculty or dept_chair
        if (in_array($user->role, ['faculty', 'dept_chair'])) {
            $userData['department'] = $user->department;
            $userData['position'] = $user->position;
        }

        // Add admin-specific fields if user is admin
        if ($user->role === 'admin') {
            $userData['department'] = $user->department;
            $userData['position'] = $user->position;
        }
        
        return response()->json([
            'success' => true,
            'user' => $userData
        ])->header('Cache-Control', 'private, max-age=300'); // Cache for 5 minutes
    }

    /**
     * Logout user (invalidate token)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            // Get the current token
            $token = JWTAuth::getToken();
            
            if ($token) {
                // Invalidate the token (add to blacklist)
                JWTAuth::invalidate($token);
            }
            
            // Also logout from the guard
            auth('api')->logout();

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh JWT token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure (Optimized)
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $user = auth('api')->user();
        
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'created_at' => $user->created_at,
        ];

        // Add student-specific fields if user is a student
        if ($user->role === 'student') {
            $userData['student_id'] = $user->student_id;
            $userData['student_number'] = $user->student_number;
            $userData['program'] = $user->program;
            $userData['year_level'] = $user->year_level;
            $userData['department'] = $user->department;
            $userData['phone'] = $user->phone;
            $userData['address'] = $user->address;
            $userData['gpa'] = $user->gpa;
        }

        // Add faculty-specific fields if user is faculty or dept_chair
        if (in_array($user->role, ['faculty', 'dept_chair'])) {
            $userData['department'] = $user->department;
            $userData['position'] = $user->position;
        }

        // Add admin-specific fields if user is admin
        if ($user->role === 'admin') {
            $userData['department'] = $user->department;
            $userData['position'] = $user->position;
        }
        
        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $userData
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
}
