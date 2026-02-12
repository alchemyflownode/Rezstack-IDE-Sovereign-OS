@echo off
echo 🔍 Finding process on port 3000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo ✅ Found process with PID: %%a
    echo 🔪 Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Successfully killed process %%a
    ) else (
        echo ❌ Failed to kill process %%a
    )
)

echo.
echo 🚀 You can now run: npm run dev
echo.
pause