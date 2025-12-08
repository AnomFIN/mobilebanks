@echo off
REM ============================================
REM MobileBanks Local Server (Quick Launch)
REM ============================================
REM This launches the local server directly without showing the menu

title MobileBanks - Local Server

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed
    pause
    exit /b 1
)

cls
echo.
echo ================================================
echo    MobileBanks - Starting Local Server...
echo ================================================
echo.

REM Launch with --local flag
python launch_web_server.py --local

pause
