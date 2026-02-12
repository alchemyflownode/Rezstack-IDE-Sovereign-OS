@echo off
setlocal

if "%1"=="" (
    set PORT=3000
) else (
    set PORT=%1
)

echo 🔍 Finding process on port %PORT%...

set PID=
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT%') do (
    set PID=%%a
)

if "%PID%"=="" (
    echo ✅ No process found on port %PORT%
) else (
    echo ✅ Found process with PID: %PID%
    echo 🔪 Killing process %PID%...
    taskkill /F /PID %PID% >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Successfully killed process %PID%
    ) else (
        echo ❌ Failed to kill process %PID%
    )
)

echo.
echo 🚀 You can now run: npm run dev
echo.
pause