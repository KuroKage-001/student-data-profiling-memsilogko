#!/bin/bash
set -e

echo "Starting Laravel application..."

# Copy .env.example to .env if .env doesn't exist
if [ ! -f /var/www/html/.env ]; then
    echo "Creating .env file from .env.example..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

# Update .env with environment variables
echo "Updating .env with environment variables..."
sed -i "s|APP_NAME=.*|APP_NAME=\"${APP_NAME:-Laravel}\"|g" /var/www/html/.env
sed -i "s|APP_ENV=.*|APP_ENV=${APP_ENV:-production}|g" /var/www/html/.env
sed -i "s|APP_KEY=.*|APP_KEY=${APP_KEY}|g" /var/www/html/.env
sed -i "s|APP_DEBUG=.*|APP_DEBUG=${APP_DEBUG:-false}|g" /var/www/html/.env
sed -i "s|APP_URL=.*|APP_URL=${APP_URL}|g" /var/www/html/.env

sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=${DB_CONNECTION:-pgsql}|g" /var/www/html/.env
sed -i "s|DB_HOST=.*|DB_HOST=${DB_HOST}|g" /var/www/html/.env
sed -i "s|DB_PORT=.*|DB_PORT=${DB_PORT:-5432}|g" /var/www/html/.env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_DATABASE}|g" /var/www/html/.env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USERNAME}|g" /var/www/html/.env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD}|g" /var/www/html/.env

sed -i "s|JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|g" /var/www/html/.env
sed -i "s|LOG_LEVEL=.*|LOG_LEVEL=${LOG_LEVEL:-error}|g" /var/www/html/.env

echo ".env file updated successfully"

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
php artisan migrate --force --no-interaction

# Show migration status for verification
echo "Migration status:"
php artisan migrate:status

# Run database seeders only if SEED_DATABASE environment variable is set to true
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Running database seeders..."
    php artisan db:seed --force --no-interaction
    echo "Database seeding completed!"
else
    echo "Skipping database seeders (set SEED_DATABASE=true to enable)"
fi

# Clear all caches first
echo "Clearing all caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cache configuration for production
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel setup completed!"

# Start Apache
echo "Starting Apache server..."
apache2-foreground