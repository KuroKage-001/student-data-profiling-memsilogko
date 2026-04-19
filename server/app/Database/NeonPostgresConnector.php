<?php

namespace App\Database;

use Illuminate\Database\Connectors\PostgresConnector;
use PDO;

class NeonPostgresConnector extends PostgresConnector
{
    /**
     * Get the DSN string for a host / port configuration.
     *
     * @param  array  $config
     * @return string
     */
    protected function getDsn(array $config)
    {
        $host = $config['host'] ?? null;
        $port = $config['port'] ?? 5432;

        $dsn = "pgsql:host={$host};port={$port};dbname={$config['database']}";

        // Add endpoint as options parameter for Neon
        if (isset($config['endpoint'])) {
            $dsn .= ";options='endpoint={$config['endpoint']}'";
        }

        if (isset($config['sslmode'])) {
            $dsn .= ";sslmode={$config['sslmode']}";
        }

        return $this->addSslOptions($dsn, $config);
    }
}
