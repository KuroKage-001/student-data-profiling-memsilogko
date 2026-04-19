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
        // Bind the custom Neon PostgreSQL connector
        $this->app->bind('db.connector.pgsql', function () {
            return new NeonPostgresConnector();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
