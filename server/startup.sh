#!/bin/bash
set -e

echo "Starting Laravel application..."

# Generate application key if not set
php artisan key:generate --force

# Generate JWT secret if not set  
php artisan jwt:secret --force

# Run database migrations
php artisan migrate --force

# Cache configuration for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel setup completed!"

# Start Apache
apache2-foreground