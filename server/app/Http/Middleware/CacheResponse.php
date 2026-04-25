<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Handle an incoming request.
     * 
     * This middleware caches GET requests to improve performance.
     * Cache is automatically invalidated on mutations (POST, PUT, DELETE).
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, int $ttl = 300): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Generate cache key based on URL, query parameters, and user
        $cacheKey = $this->generateCacheKey($request);

        // Try to get from cache
        $cachedResponse = Cache::get($cacheKey);
        
        if ($cachedResponse !== null) {
            // Return cached response with cache headers
            return response()->json($cachedResponse)
                ->header('X-Cache-Status', 'HIT')
                ->header('X-Cache-Key', $cacheKey);
        }

        // Process request
        $response = $next($request);

        // Only cache successful JSON responses
        if ($response->isSuccessful() && $response->headers->get('Content-Type') === 'application/json') {
            $content = json_decode($response->getContent(), true);
            
            // Cache the response content
            Cache::put($cacheKey, $content, $ttl);
            
            // Add cache headers
            $response->header('X-Cache-Status', 'MISS')
                    ->header('X-Cache-Key', $cacheKey)
                    ->header('X-Cache-TTL', $ttl);
        }

        return $response;
    }

    /**
     * Generate a unique cache key for the request
     */
    private function generateCacheKey(Request $request): string
    {
        $user = auth('api')->user();
        $userId = $user ? $user->id : 'guest';
        $userRole = $user ? $user->role : 'guest';
        $userDept = $user && isset($user->department) ? $user->department : 'all';
        
        // Include URL path, query parameters, user ID, role, and department
        $queryString = http_build_query($request->query());
        $path = $request->path();
        
        return sprintf(
            'api_cache:%s:%s:%s:%s:%s',
            $path,
            md5($queryString),
            $userId,
            $userRole,
            $userDept
        );
    }
}
