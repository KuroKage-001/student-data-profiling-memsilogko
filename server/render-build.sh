#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting Laravel build process..."

# Install PHP dependencies
echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Generate application key if not set
echo "Generating application key..."
php artisan key:generate --force

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear and cache config
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Generate JWT secret if not set
echo "Generating JWT secret..."
php artisan jwt:secret --force

echo "Build process completed successfully!"