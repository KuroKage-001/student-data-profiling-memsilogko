<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CacheService
{
    /**
     * Cache TTL in seconds
     */
    const DEFAULT_TTL = 300; // 5 minutes
    const SHORT_TTL = 60;    // 1 minute
    const LONG_TTL = 3600;   // 1 hour

    /**
     * Cache key prefixes for different resources
     */
    const PREFIX_INSTRUCTIONS = 'instructions';
    const PREFIX_CLASS_SECTIONS = 'class_sections';
    const PREFIX_FACULTY = 'faculty';
    const PREFIX_STATISTICS = 'statistics';

    /**
     * Remember a value in cache with automatic key generation
     */
    public static function remember(string $prefix, array $params, callable $callback, int $ttl = self::DEFAULT_TTL)
    {
        $key = self::generateKey($prefix, $params);
        
        try {
            return Cache::remember($key, $ttl, $callback);
        } catch (\Exception $e) {
            Log::error("Cache remember failed for key: {$key}", [
                'error' => $e->getMessage()
            ]);
            // Fallback to direct execution if cache fails
            return $callback();
        }
    }

    /**
     * Invalidate all cache entries for a specific resource
     */
    public static function invalidate(string $prefix): void
    {
        try {
            // For database cache driver, we need to manually clear entries
            // since it doesn't support tags
            $cacheDriver = config('cache.default');
            
            if ($cacheDriver === 'database') {
                // Clear cache entries by prefix using database query
                \DB::table(config('cache.stores.database.table', 'cache'))
                    ->where('key', 'like', config('cache.prefix') . $prefix . '%')
                    ->delete();
            } else {
                // For Redis/Memcached, use tags
                Cache::tags([$prefix])->flush();
            }
            
            Log::info("Cache invalidated for prefix: {$prefix}");
        } catch (\Exception $e) {
            Log::error("Cache invalidation failed for prefix: {$prefix}", [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Invalidate a specific cache entry
     */
    public static function forget(string $prefix, array $params): void
    {
        try {
            $key = self::generateKey($prefix, $params);
            Cache::forget($key);
            
            Log::info("Cache entry forgotten: {$key}");
        } catch (\Exception $e) {
            Log::error("Cache forget failed for key: {$key}", [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Invalidate all related caches for a resource
     * This includes the resource itself and its statistics
     */
    public static function invalidateRelated(string $prefix): void
    {
        self::invalidate($prefix);
        self::invalidate(self::PREFIX_STATISTICS . '_' . $prefix);
    }

    /**
     * Generate a cache key from prefix and parameters
     */
    private static function generateKey(string $prefix, array $params): string
    {
        // Sort params for consistent key generation
        ksort($params);
        
        // Create a hash of the parameters
        $paramsHash = md5(json_encode($params));
        
        return sprintf('%s:%s', $prefix, $paramsHash);
    }

    /**
     * Get cache statistics
     */
    public static function getStats(): array
    {
        try {
            // This is a basic implementation
            // For production, you might want to use Redis or Memcached for better stats
            return [
                'driver' => config('cache.default'),
                'enabled' => true,
            ];
        } catch (\Exception $e) {
            return [
                'driver' => 'unknown',
                'enabled' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Warm up cache for common queries
     */
    public static function warmUp(string $prefix, array $queries): void
    {
        foreach ($queries as $params => $callback) {
            try {
                self::remember($prefix, (array)$params, $callback);
            } catch (\Exception $e) {
                Log::error("Cache warm-up failed for prefix: {$prefix}", [
                    'params' => $params,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    /**
     * Clear all application cache
     */
    public static function clearAll(): void
    {
        try {
            Cache::flush();
            Log::info("All cache cleared");
        } catch (\Exception $e) {
            Log::error("Failed to clear all cache", [
                'error' => $e->getMessage()
            ]);
        }
    }
}
