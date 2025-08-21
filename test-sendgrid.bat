@echo off
echo 🧪 Testing SendGrid Configuration...
echo.

cd /d "C:\Users\Denny\brezcode-health"

if exist "package.json" (
    echo ✅ Found project folder
    echo 🚀 Running SendGrid test...
    echo.
    npm run test-sendgrid
    pause
) else (
    echo ❌ Project folder not found
    echo Current location: %CD%
    echo.
    echo Please make sure you're in the right folder
    pause
)



