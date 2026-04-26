#!/bin/bash

# Force deployment script for Render
# This script helps trigger a fresh deployment

echo "=== Force Deployment Script ==="
echo ""

# Step 1: Clear Laravel caches
echo "Step 1: Clearing Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Step 2: Optimize for production
echo ""
echo "Step 2: Optimizing for production..."
php artisan config:cache
php artisan route:cache

# Step 3: Show current git status
echo ""
echo "Step 3: Current Git Status"
git log --oneline -1
echo ""
git status

echo ""
echo "=== Deployment Script Complete ==="
echo ""
echo "Next steps:"
echo "1. Go to Render Dashboard: https://dashboard.render.com"
echo "2. Find your service: student-data-profiling-memsilogko"
echo "3. Click 'Manual Deploy' -> 'Clear build cache & deploy'"
echo "4. Wait for deployment to complete"
echo "5. Test the user creation again"
