#!/usr/bin/env bash

echo "Starting PHP-FPM..."
# Start PHP-FPM in the background
php-fpm -D

echo "Starting Nginx..."
# Start Nginx in the foreground
nginx -g "daemon off;"