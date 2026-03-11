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
