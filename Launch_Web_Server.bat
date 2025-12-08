@echo off
REM ============================================
REM MobileBanks Web Server Launcher
REM ============================================
REM This batch file launches the Python web server script
REM It can be placed on the Desktop for easy access

title MobileBanks Web Server Launcher

REM Change to the script directory
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

REM Clear screen and launch the Python script
cls
python launch_web_server.py

REM Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo An error occurred. Press any key to close...
    pause >nul
)
