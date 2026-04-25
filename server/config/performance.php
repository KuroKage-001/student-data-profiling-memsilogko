<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Response Compression
    |--------------------------------------------------------------------------
    |
    | Enable or disable automatic response compression. When enabled, JSON
    | responses larger than the threshold will be gzip compressed.
    |
    */

    'compression' => [
        'enabled' => env('RESPONSE_COMPRESSION', true),
        'threshold' => env('COMPRESSION_THRESHOLD', 1024), // bytes
        'level' => env('COMPRESSION_LEVEL', 6), // 1-9, higher = more compression
    ],

    /*
    |--------------------------------------------------------------------------
    | Query Optimization
    |--------------------------------------------------------------------------
    |
    | Configure database query optimization settings including slow query
    | detection and N+1 query prevention.
    |
    */

    'database' => [
        'slow_query_threshold' => env('SLOW_QUERY_THRESHOLD', 100), // milliseconds
        'log_slow_queries' => env('LOG_SLOW_QUERIES', true),
        'prevent_lazy_loading' => env('PREVENT_LAZY_LOADING', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Configure caching behavior for static endpoints and responses.
    |
    */

    'cache' => [
        'static_endpoints' => [
            'enabled' => env('CACHE_STATIC_ENDPOINTS', true),
            'ttl' => env('CACHE_STATIC_TTL', 300), // seconds (5 minutes)
            'patterns' => [
                'api/departments',
                'api/programs',
                'api/roles',
                'api/academic-years',
                'api/semesters',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Response Headers
    |--------------------------------------------------------------------------
    |
    | Configure security and performance headers added to all responses.
    |
    */

    'headers' => [
        'security' => [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'X-XSS-Protection' => '1; mode=block',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
        ],
        'performance' => [
            'X-Response-Time' => true, // Add response time header
            'X-Database-Queries' => env('APP_DEBUG', false), // Add query count in debug mode
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | ETag Configuration
    |--------------------------------------------------------------------------
    |
    | Configure ETag generation for conditional requests.
    |
    */

    'etag' => [
        'enabled' => env('ETAG_ENABLED', true),
        'max_size' => env('ETAG_MAX_SIZE', 1048576), // 1MB - don't generate ETags for larger responses
    ],

];
