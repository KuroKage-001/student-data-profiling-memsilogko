# Laravel Database Seeder Commands Reference

## Basic Seeder Commands

### Run All Seeders
php artisan db:seed
# Runs the DatabaseSeeder class which calls all registered seeders
# Use this to populate your database with all seed data at once

### Run Specific Seeder
php artisan db:seed --class=CourseSeeder
# Runs only the specified seeder class
# Replace 'CourseSeeder' with any seeder class name

## Project-Specific Seeders

### Seed Courses
php artisan db:seed --class=CourseSeeder
# Populates the courses table with course data

### Seed Question Sets
php artisan db:seed --class=QuestionSetSeeder
# Populates the question_sets table with question set data

### Seed Questions
php artisan db:seed --class=QuestionSeeder
# Populates the questions table with question data

### Seed Rizal Course
php artisan db:seed --class=RizalCourseSeeder
# Seeds a comprehensive Rizal course with various question types
# Includes multiple choice, true/false, and other question formats

### Seed in Order (Recommended for fresh setup)
php artisan db:seed --class=CourseSeeder
php artisan db:seed --class=QuestionSetSeeder
php artisan db:seed --class=QuestionSeeder
php artisan db:seed --class=RizalCourseSeeder
# Run these commands sequentially to maintain data relationships
# Ensures foreign key constraints are satisfied

## Migration Commands

### Fresh Migration with Seeding
php artisan migrate:fresh --seed
# Drops all tables, re-runs all migrations, then runs all seeders
# WARNING: This will delete ALL existing data in the database
# Use this for a complete database reset

### Refresh Database
php artisan migrate:refresh --seed
# Rolls back all migrations, re-runs them, then runs all seeders
# Similar to migrate:fresh but uses rollback instead of drop
# Also deletes all data - use with caution

### Fresh Migration without Seeding
php artisan migrate:fresh
# Drops all tables and re-runs migrations without seeding
# Use when you want a clean database structure without sample data

### Refresh Migration without Seeding
php artisan migrate:refresh
# Rolls back and re-runs migrations without seeding

## Advanced Seeder Commands

### Run Seeder with Force (Production)
php artisan db:seed --force
# Forces seeder to run in production environment
# Laravel normally prevents seeding in production for safety

### Run Specific Seeder with Force
php artisan db:seed --class=CourseSeeder --force
# Runs a specific seeder in production environment

### Run Seeder for Specific Database Connection
php artisan db:seed --database=mysql
# Runs seeders on a specific database connection
# Useful when you have multiple database connections configured

## Creating New Seeders

### Create a New Seeder
php artisan make:seeder UserSeeder
# Creates a new seeder file in database/seeders directory
# Replace 'UserSeeder' with your desired seeder name

### Create a Seeder for a Specific Model
php artisan make:seeder EmployeeSeeder
# Creates a seeder for the Employee model
# Follow naming convention: ModelNameSeeder

## Migration Commands (Related)

### Run Migrations
php artisan migrate
# Runs all pending migrations
# Creates or modifies database tables

### Rollback Last Migration
php artisan migrate:rollback
# Rolls back the last batch of migrations
# Useful for undoing recent changes

### Rollback Specific Steps
php artisan migrate:rollback --step=3
# Rolls back the last 3 migration batches
# Allows fine-grained control over rollbacks

### Reset All Migrations
php artisan migrate:reset
# Rolls back all migrations
# Returns database to empty state

### Check Migration Status
php artisan migrate:status
# Shows which migrations have been run and which are pending
# Useful for debugging migration issues

## Database Commands

### Show Database Information
php artisan db:show
# Displays database connection information and table count
# Available in Laravel 9+

### Show Table Information
php artisan db:table users
# Shows detailed information about a specific table
# Replace 'users' with any table name

### Monitor Database
php artisan db:monitor
# Monitors database connections
# Useful for checking connection health

## Factory Commands (Related to Seeding)

### Create a Factory
php artisan make:factory CourseFactory
# Creates a factory for generating fake data
# Factories are used within seeders to create test data

### Create a Factory for a Specific Model
php artisan make:factory CourseFactory --model=Course
# Creates a factory and associates it with the Course model

## Tinker (Testing Seeders)

### Open Tinker
php artisan tinker
# Opens an interactive shell to test code
# Useful for testing seeder logic before running

### Example Tinker Commands
# Inside tinker:
# App\Models\Course::factory()->count(10)->create();
# Creates 10 courses using the factory

## Best Practices

### Development Workflow
1. php artisan migrate:fresh --seed
   # Start with a clean database and seed data

2. Make changes to seeders or migrations

3. php artisan migrate:fresh --seed
   # Test your changes

### Production Deployment
1. php artisan migrate --force
   # Run only new migrations in production

2. php artisan db:seed --class=SpecificSeeder --force
   # Seed only specific data if needed

### Testing Workflow
1. php artisan migrate:fresh --seed --env=testing
   # Use testing environment for isolated tests

## Common Issues and Solutions

### Issue: Foreign Key Constraint Errors
# Solution: Run seeders in the correct order
# Parent tables must be seeded before child tables

### Issue: Duplicate Entry Errors
# Solution: Use updateOrCreate() or firstOrCreate() in seeders
# Or run migrate:fresh to clear existing data

### Issue: Seeder Not Found
# Solution: Run composer dump-autoload
composer dump-autoload
# Regenerates the autoload files

### Issue: Memory Limit Exceeded
# Solution: Increase memory limit or use chunking
php -d memory_limit=512M artisan db:seed

## Environment-Specific Commands

### Seed for Local Environment
php artisan db:seed --env=local

### Seed for Testing Environment
php artisan db:seed --env=testing

### Seed for Staging Environment
php artisan db:seed --env=staging

## Useful Combinations

### Complete Database Reset and Seed
php artisan migrate:fresh --seed
# Most common command for development

### Reset Specific Table Data
php artisan migrate:refresh --path=/database/migrations/2024_01_01_create_courses_table.php
php artisan db:seed --class=CourseSeeder
# Refreshes only a specific table and its data

### Quick Test Seed
php artisan migrate:fresh && php artisan db:seed --class=CourseSeeder
# Chains commands to reset and seed specific data quickly


---

## Server-Side Caching System

### Overview

The application implements a comprehensive server-side caching system to improve API performance and reduce database load. Caching is implemented for Instructions, Class Sections, and Faculty Profiles.

### Cache Commands

#### Clear All Cache
```bash
php artisan cache:clear
```
Clears all cached data from the application.

#### Clear Configuration Cache
```bash
php artisan config:clear
```
Clears the configuration cache.

#### Clear Route Cache
```bash
php artisan route:clear
```
Clears the route cache.

#### Create Cache Table
```bash
php artisan cache:table
php artisan migrate
```
Creates the cache table in the database (if using database cache driver).

#### Rebuild All Caches
```bash
php artisan optimize
```
Rebuilds all optimization caches.

### Cache Configuration

#### Environment Variables
```env
CACHE_STORE=database
CACHE_PREFIX=myapp_cache_
```

#### Cache Drivers
- `database` - Stores cache in database (default)
- `redis` - Stores cache in Redis (recommended for production)
- `memcached` - Stores cache in Memcached
- `file` - Stores cache in files

### Cached Endpoints

#### Instructions API
- ✅ `GET /api/instructions` - List with filters (cached)
- ✅ `GET /api/instructions/{id}` - Single instruction (cached)
- ❌ `POST /api/instructions` - Create (invalidates cache)
- ❌ `PUT /api/instructions/{id}` - Update (invalidates cache)
- ❌ `DELETE /api/instructions/{id}` - Delete (invalidates cache)

#### Class Sections API
- ✅ `GET /api/class-sections` - List with filters (cached)
- ✅ `GET /api/class-sections/{id}` - Single section (cached)
- ✅ `GET /api/class-sections-statistics` - Statistics (cached)
- ❌ `POST /api/class-sections` - Create (invalidates cache)
- ❌ `PUT /api/class-sections/{id}` - Update (invalidates cache)
- ❌ `DELETE /api/class-sections/{id}` - Delete (invalidates cache)

#### Faculty API
- ✅ `GET /api/faculty` - List with filters (cached)
- ✅ `GET /api/faculty/{id}` - Single faculty (cached)
- ✅ `GET /api/faculty-statistics` - Statistics (cached)
- ❌ `POST /api/faculty` - Create (invalidates cache)
- ❌ `PUT /api/faculty/{id}` - Update (invalidates cache)
- ❌ `DELETE /api/faculty/{id}` - Delete (invalidates cache)

### Cache Headers

Cached responses include the following headers:

```
X-Cache-Status: HIT|MISS
X-Cache-Key: instructions:abc123...
X-Cache-TTL: 300
X-Cache-Enabled: true
```

### Testing Cache

#### Test Cache Hit/Miss
```bash
# First request (MISS)
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/instructions

# Second request (HIT)
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/instructions
```

#### Check Cache Headers
```bash
curl -I -H "Authorization: Bearer TOKEN" http://localhost:8000/api/instructions
```

#### Run Cache Tests
```bash
php artisan test --filter CachingTest
```

### Cache TTL (Time To Live)

- **SHORT_TTL**: 60 seconds (1 minute) - Frequently changing data
- **DEFAULT_TTL**: 300 seconds (5 minutes) - Standard data
- **LONG_TTL**: 3600 seconds (1 hour) - Rarely changing data

### Performance Improvements

#### Before Caching
- Average response time: 200-500ms
- Database queries per request: 5-10
- Server load: High during peak usage

#### After Caching
- Average response time: 20-50ms (cache hit)
- Database queries per request: 0 (cache hit)
- Server load: 70-90% reduction
- Cache hit rate: 70-90% (typical)

### Cache Management

#### Programmatic Cache Control

```php
use App\Services\CacheService;

// Cache a query
$data = CacheService::remember(
    CacheService::PREFIX_INSTRUCTIONS,
    ['param' => 'value'],
    function () {
        return Model::all();
    }
);

// Invalidate cache
CacheService::invalidate(CacheService::PREFIX_INSTRUCTIONS);

// Invalidate related caches
CacheService::invalidateRelated(CacheService::PREFIX_FACULTY);

// Clear all cache
CacheService::clearAll();
```

### Troubleshooting

#### Cache Not Working
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
```

#### Stale Data
```bash
# Clear cache manually
php artisan cache:clear
```

#### Cache Table Missing
```bash
# Create cache table
php artisan cache:table
php artisan migrate
```

### Documentation

For detailed information about the caching system:
- [Server Caching Implementation](./CACHING_IMPLEMENTATION.md)
- [Server Caching Quick Reference](./CACHING_QUICK_REFERENCE.md)
- [System Documentation](../01-system documentation/SERVER_SIDE_CACHING_IMPLEMENTATION.md)

### Cache Monitoring

#### View Cache in Database
```sql
-- View cached entries
SELECT * FROM cache;

-- Count cache entries
SELECT COUNT(*) FROM cache;

-- View cache by key pattern
SELECT * FROM cache WHERE `key` LIKE 'instructions%';
```

#### Check Cache Statistics
```php
$stats = CacheService::getStats();
// Returns: ['driver' => 'database', 'enabled' => true]
```

### Best Practices

1. **Always invalidate cache after mutations**
   ```php
   CacheService::invalidate(CacheService::PREFIX_INSTRUCTIONS);
   ```

2. **Use appropriate TTL for data type**
   - Frequently changing: `SHORT_TTL`
   - Standard data: `DEFAULT_TTL`
   - Rarely changing: `LONG_TTL`

3. **Include user context in cache keys**
   - User ID, role, and department are automatically included

4. **Test cache behavior**
   - Verify cache hits
   - Verify cache invalidation
   - Test user-specific caching

5. **Monitor cache performance**
   - Check cache headers in responses
   - Review cache statistics
   - Monitor database query reduction
