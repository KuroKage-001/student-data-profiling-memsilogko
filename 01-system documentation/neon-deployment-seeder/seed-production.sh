#!/bin/bash

# Production Student Seeder Script
# This script seeds 1000 student accounts (500 IT + 500 CS) to Neon database

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Production Student Account Seeder for Neon DB         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please make sure you're in the server directory."
    exit 1
fi

# Backup current .env
echo "📦 Creating backup of current .env..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"
echo ""

# Check if user wants to proceed
echo "⚠️  WARNING: This will create 1000 student accounts in your database."
echo ""
echo "Current configuration:"
grep "^DB_CONNECTION=" .env
grep "^DB_HOST=" .env
grep "^DB_DATABASE=" .env
echo ""
read -p "Do you want to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Seeding cancelled."
    exit 0
fi

echo ""
echo "🚀 Starting production seeding..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run the seeder
php artisan db:seed --class=ProductionStudentSeeder

# Check if seeding was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Production seeding completed successfully!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📊 Next Steps:"
    echo "   1. Verify accounts in your admin portal"
    echo "   2. Test login with sample accounts"
    echo "   3. Begin profile completion process"
    echo ""
else
    echo ""
    echo "❌ Seeding failed! Check the error messages above."
    echo "Your database should be unchanged due to transaction rollback."
    exit 1
fi
