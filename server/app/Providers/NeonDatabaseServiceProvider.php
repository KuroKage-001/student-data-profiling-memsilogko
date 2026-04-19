<?php

namespace App\Providers;

use App\Database\NeonPostgresConnector;
use Illuminate\Database\Connection;
use Illuminate\Support\ServiceProvider;

class NeonDatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register the custom Neon PostgreSQL connector
        Connection::resolverFor('pgsql', function ($connection, $database, $prefix, $config) {
            $connector = new NeonPostgresConnector();
            $pdo = $connector->connect($config);
            
            return new Connection($pdo, $database, $prefix, $config);
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
