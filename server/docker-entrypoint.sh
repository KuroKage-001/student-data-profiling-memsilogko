#!/bin/bash
set -e

echo "Starting Laravel application setup..."

# Wait for database to be ready
echo "Waiting for database connection..."
until php artisan migrate:status > /dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done

# Generate application key if not set
echo "Generating application key..."
php artisan key:generate --force

# Generate JWT secret if not set
echo "Generating JWT secret..."
php artisan jwt:secret --force

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear and cache config for production
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel setup completed successfully!"

# Start the application
echo "Starting web server..."
exec ./render-start.sh