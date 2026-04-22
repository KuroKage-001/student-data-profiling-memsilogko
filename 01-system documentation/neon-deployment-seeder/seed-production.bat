@echo off
REM Production Student Seeder Script for Windows
REM This script seeds 1000 student accounts (500 IT + 500 CS) to Neon database

echo ================================================================
echo      Production Student Account Seeder for Neon DB
echo ================================================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo Please make sure you're in the server directory.
    pause
    exit /b 1
)

REM Backup current .env
echo [INFO] Creating backup of current .env...
copy .env .env.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2% >nul
echo [SUCCESS] Backup created
echo.

REM Show current configuration
echo [WARNING] This will create 1000 student accounts in your database.
echo.
echo Current configuration:
findstr /B "DB_CONNECTION=" .env
findstr /B "DB_HOST=" .env
findstr /B "DB_DATABASE=" .env
echo.

set /p confirm="Do you want to proceed? (yes/no): "
if /i not "%confirm%"=="yes" (
    echo [CANCELLED] Seeding cancelled.
    pause
    exit /b 0
)

echo.
echo [INFO] Starting production seeding...
echo ================================================================
echo.

REM Run the seeder
php artisan db:seed --class=ProductionStudentSeeder

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo [SUCCESS] Production seeding completed successfully!
    echo ================================================================
    echo.
    echo Next Steps:
    echo    1. Verify accounts in your admin portal
    echo    2. Test login with sample accounts
    echo    3. Begin profile completion process
    echo.
) else (
    echo.
    echo [ERROR] Seeding failed! Check the error messages above.
    echo Your database should be unchanged due to transaction rollback.
    pause
    exit /b 1
)

pause
