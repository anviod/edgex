@echo off
REM Edge Gateway Sync Quick Start for Windows
REM This script launches Git Bash and runs the setup wizard

echo ==========================================
echo Edge Gateway Sync Setup
echo ==========================================
echo.

REM Check if Git Bash is installed
if exist "C:\Program Files\Git\bin\bash.exe" (
    set BASH_PATH="C:\Program Files\Git\bin\bash.exe"
) else if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    set BASH_PATH="C:\Program Files (x86)\Git\bin\bash.exe"
) else (
    echo [ERROR] Git Bash not found!
    echo Please install Git for Windows from:
    echo https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Found Git Bash at: %BASH_PATH%
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0

echo Starting setup wizard...
echo.

REM Launch Git Bash with the setup script
%BASH_PATH% --login -i -c "cd '%SCRIPT_DIR%' && bash setup-sync.sh"

pause