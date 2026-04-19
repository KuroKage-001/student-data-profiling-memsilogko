# Neon Database Connection Fix

## Issue
Laravel couldn't connect to Neon PostgreSQL database due to missing endpoint ID parameter required for SNI support.

**Error:**
```
SQLSTATE[08006] [7] ERROR: Endpoint ID is not specified. 
Either please upgrade the postgres client library (libpq) for SNI support 
or pass the endpoint ID (first part of the domain name) as a parameter: 
'?options=endpoint%3D<endpoint-id>'.
```

## Solution
Created a custom PostgreSQL connector that adds the endpoint ID to the DSN connection string.

### Files Modified/Created:

1. **server/app/Database/NeonPostgresConnector.php** (Updated)
   - Custom connector that overrides `getDsn()` method
   - Adds `options='endpoint={endpoint_id}'` to connection string

2. **server/.env** (Updated)
   - Added `DB_ENDPOINT=ep-wispy-truth-a1nim5i2`
   - Added `USE_NEON_CONNECTOR=true`

3. **server/config/database.php** (Updated)
   - Added `'endpoint' => env('DB_ENDPOINT')` to pgsql connection

4. **server/app/Providers/NeonDatabaseServiceProvider.php** (Already existed)
   - Registers custom connector when `USE_NEON_CONNECTOR=true`

### Configuration:

**.env file:**
```env
DB_CONNECTION=pgsql
DB_HOST=ep-wispy-truth-a1nim5i2-pooler.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_fEZ4b9rxdGPm
DB_SSLMODE=require
DB_ENDPOINT=ep-wispy-truth-a1nim5i2
USE_NEON_CONNECTOR=true
```

**NeonPostgresConnector.php:**
```php
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
```

## Result
✅ Migrations ran successfully  
✅ Class sections table created  
✅ Faculty class assignments table created  
✅ Sample data seeded  

## Testing
```bash
# Clear config cache
php artisan config:clear

# Run migrations
php artisan migrate

# Seed sample data
php artisan db:seed --class=ClassSectionSeeder
```

## How It Works
1. Laravel loads the NeonDatabaseServiceProvider
2. When `USE_NEON_CONNECTOR=true`, it registers the custom connector
3. The custom connector adds the endpoint ID to the DSN string
4. Neon recognizes the endpoint and routes the connection correctly
5. Database operations work normally

## Notes
- The endpoint ID is extracted from the host: `ep-wispy-truth-a1nim5i2`
- This is required for Neon's connection pooling with SNI
- The fix is transparent to the rest of the application
- All Laravel database features work normally

---

**Fixed:** April 19, 2026  
**Status:** ✅ Working
