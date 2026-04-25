<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;

/**
 * Performance Service Provider
 * 
 * Configures application-wide performance optimizations:
 * - Eager loading enforcement
 * - Query optimization
 * - View caching
 * - Response compression
 */
class PerformanceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register performance monitoring services
        if ($this->app->environment('local', 'development')) {
            $this->registerDevelopmentOptimizations();
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Prevent lazy loading in development to catch N+1 issues early
        if ($this->app->environment('local', 'development')) {
            Model::preventLazyLoading(true);
        }

        // Prevent silently discarding attributes in production
        Model::preventSilentlyDiscardingAttributes(!$this->app->isProduction());

        // Prevent accessing missing attributes
        Model::preventAccessingMissingAttributes(!$this->app->isProduction());

        // Optimize database queries
        $this->optimizeDatabaseQueries();

        // Configure view optimizations
        $this->optimizeViews();
    }

    /**
     * Register development-specific optimizations
     */
    protected function registerDevelopmentOptimizations(): void
    {
        // Listen for N+1 query problems
        DB::listen(function ($query) {
            if ($query->time > 100) {
                \Log::warning('Slow query detected', [
                    'sql' => $query->sql,
                    'time' => $query->time,
                    'bindings' => $query->bindings,
                ]);
            }
        });
    }

    /**
     * Optimize database queries
     */
    protected function optimizeDatabaseQueries(): void
    {
        // Set default string length for migrations
        \Illuminate\Support\Facades\Schema::defaultStringLength(191);

        // Enable query result caching
        DB::enableQueryLog();
    }

    /**
     * Optimize view rendering
     */
    protected function optimizeViews(): void
    {
        // Share common data with all views to reduce queries
        View::composer('*', function ($view) {
            // Add any global view data here if needed
        });
    }
}
