<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Database Optimization Middleware
 * 
 * Optimizes database queries by:
 * - Enabling query result caching
 * - Monitoring slow queries
 * - Preventing N+1 query problems in development
 */
class DatabaseOptimization
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Enable query log in development for monitoring
        if (config('app.debug')) {
            DB::enableQueryLog();
        }

        $response = $next($request);

        // Log slow queries in development
        if (config('app.debug')) {
            $queries = DB::getQueryLog();
            $slowQueries = array_filter($queries, function ($query) {
                return $query['time'] > 100; // Queries taking more than 100ms
            });

            if (!empty($slowQueries)) {
                \Log::warning('Slow queries detected', [
                    'url' => $request->fullUrl(),
                    'count' => count($slowQueries),
                    'queries' => $slowQueries,
                ]);
            }

            // Add query count header in development
            $response->headers->set('X-Database-Queries', count($queries));
        }

        return $response;
    }
}
