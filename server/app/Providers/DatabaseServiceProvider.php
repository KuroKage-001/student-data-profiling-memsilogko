<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Connection;
use App\Database\NeonPostgresConnector;

class DatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Connection::resolverFor('pgsql', function ($connection, $database, $prefix, $config) {
            $connector = new NeonPostgresConnector();
            $pdo = $connector->connect($config);
            
            return new Connection($pdo, $database, $prefix, $config);
        });
    }
}
