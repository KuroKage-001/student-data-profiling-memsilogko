#!/bin/bash
set -e

echo "Starting Laravel application..."

# Complete composer setup (run the scripts that were skipped during build)
echo "Completing Composer setup..."
composer dump-autoload --optimize

# Generate application key if not set
echo "Generating application key..."
php artisan key:generate --force

# Generate JWT secret if not set  
echo "Generating JWT secret..."
php artisan jwt:secret --force

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Cache configuration for production
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel setup completed!"

# Start Apache
echo "Starting Apache server..."
apache2-foreground