<?php

namespace App\Providers;

use App\Database\NeonPostgresConnector;
use Illuminate\Support\ServiceProvider;

class NeonDatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Only use custom connector if explicitly enabled
        if (env('USE_NEON_CONNECTOR', false)) {
            $this->app->bind('db.connector.pgsql', function () {
                return new NeonPostgresConnector();
            });
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
