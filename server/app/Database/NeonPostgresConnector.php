<?php

namespace App\Database;

use Illuminate\Database\Connectors\PostgresConnector;
use PDO;

class NeonPostgresConnector extends PostgresConnector
{
    /**
     * Create a new PDO connection.
     *
     * @param  string  $dsn
     * @param  array  $config
     * @param  array  $options
     * @return \PDO
     */
    public function createConnection($dsn, array $config, array $options)
    {
        // Extract endpoint from host if it contains 'neon.tech'
        if (isset($config['host']) && str_contains($config['host'], 'neon.tech')) {
            // Extract endpoint ID from host (e.g., ep-wispy-truth-a1nim5i2)
            // Remove -pooler suffix if present
            $host = str_replace('-pooler', '', $config['host']);
            preg_match('/^(ep-[^.]+)/', $host, $matches);
            if (!empty($matches[1])) {
                $endpoint = $matches[1];
                // Add endpoint to DSN options - use proper format without -c
                $dsn .= ";options='endpoint={$endpoint}'";
            }
        }

        return parent::createConnection($dsn, $config, $options);
    }
}
