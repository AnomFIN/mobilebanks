@echo off
REM ============================================
REM MobileBanks Public Server with Ngrok
REM ============================================
REM This launches the server with ngrok for public access

title MobileBanks - Public Server (Ngrok)

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed
    pause
    exit /b 1
)

REM Check ngrok
ngrok version >nul 2>&1
if errorlevel 1 (
    echo ERROR: ngrok is not installed
    echo.
    echo Please install ngrok from: https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

cls
echo.
echo ================================================
echo    MobileBanks - Starting Public Server...
echo ================================================
echo.

REM Launch with --ngrok flag
python launch_web_server.py --ngrok

pause
