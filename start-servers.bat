@echo off
setlocal enabledelayedexpansion

echo Starting TG Recertification System Servers...
echo.

REM Start Client Server
echo Starting Client Server...
start "Client Server" cmd /k "cd /d c:\xampp\htdocs\repo-core\tg-recertification-system\client && (if exist package.json (echo Client Server Checking: Working && npm run dev) else (echo Client Server Checking: Not Working && pause))"

REM Wait a moment before starting next server
timeout /t 2 /nobreak >nul

REM Start Laravel Server
echo Starting Laravel Server...
start "Laravel Server" cmd /k "cd /d c:\xampp\htdocs\repo-core\tg-recertification-system\server && (php artisan --version >nul 2>&1 && (echo Laravel Server Checking: Working && php artisan serve) || (echo Laravel Server Checking: Not Working && pause))"

REM Wait a moment before starting next server
timeout /t 2 /nobreak >nul

REM Start Socket Server
echo Starting Socket Server...
start "Socket Server" cmd /k "cd /d c:\xampp\htdocs\repo-core\tg-recertification-system\socket-server && (if exist package.json (echo Socket Server Checking: Working && npm start) else (echo Socket Server Checking: Not Working && pause))"

echo.
echo All servers are starting in separate windows...
echo.
echo Press Ctrl+C to stop all servers...
echo.

REM Wait indefinitely until Ctrl+C is pressed
:wait_loop
timeout /t 1 >nul
goto wait_loop

REM This section runs when Ctrl+C is pressed
:cleanup
echo.
echo Stopping all servers...
taskkill /FI "WindowTitle eq Client Server*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Laravel Server*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Socket Server*" /T /F >nul 2>&1
echo All servers stopped.
exit /b
