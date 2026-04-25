<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OptimizeResponse
{
    /**
     * Handle an incoming request and optimize the response
     * 
     * Optimizations include:
     * - Security headers
     * - Compression hints
     * - Caching headers for static content
     * - Performance monitoring headers
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Enable compression hint
        if (!$response->headers->has('Content-Encoding')) {
            $response->headers->set('Vary', 'Accept-Encoding');
        }

        // Add caching headers for successful GET requests
        if ($request->isMethod('GET') && $response->isSuccessful()) {
            // Cache static API responses for 5 minutes
            if ($this->isStaticEndpoint($request)) {
                $response->headers->set('Cache-Control', 'public, max-age=300, s-maxage=300');
            } else {
                // Dynamic content - validate cache
                $response->headers->set('Cache-Control', 'no-cache, must-revalidate');
            }
        }

        // Add ETag for GET requests to enable conditional requests
        if ($request->isMethod('GET') && $response->isSuccessful()) {
            $content = $response->getContent();
            if ($content && strlen($content) < 1048576) { // Only for responses < 1MB
                $etag = md5($content);
                $response->headers->set('ETag', '"' . $etag . '"');
                
                // Check if client has cached version
                if ($request->header('If-None-Match') === '"' . $etag . '"') {
                    return response('', 304)->withHeaders($response->headers->all());
                }
            }
        }

        // Performance timing header (for monitoring)
        if (defined('LARAVEL_START')) {
            $executionTime = round((microtime(true) - LARAVEL_START) * 1000, 2);
            $response->headers->set('X-Response-Time', $executionTime . 'ms');
        }

        // Compress JSON responses if not already compressed
        if ($response->headers->get('Content-Type') === 'application/json' 
            && !$response->headers->has('Content-Encoding')
            && function_exists('gzencode')) {
            
            $content = $response->getContent();
            if ($content && strlen($content) > 1024) { // Only compress if > 1KB
                $acceptEncoding = $request->header('Accept-Encoding', '');
                
                if (str_contains($acceptEncoding, 'gzip')) {
                    $compressed = gzencode($content, 6); // Level 6 compression
                    if ($compressed !== false) {
                        $response->setContent($compressed);
                        $response->headers->set('Content-Encoding', 'gzip');
                        $response->headers->set('Content-Length', strlen($compressed));
                    }
                }
            }
        }

        return $response;
    }

    /**
     * Determine if the endpoint serves static/cacheable data
     */
    private function isStaticEndpoint(Request $request): bool
    {
        $staticPatterns = [
            '/api/departments',
            '/api/programs',
            '/api/roles',
            '/api/academic-years',
            '/api/semesters',
        ];

        $path = $request->path();
        foreach ($staticPatterns as $pattern) {
            if (str_starts_with($path, ltrim($pattern, '/'))) {
                return true;
            }
        }

        return false;
    }
}
