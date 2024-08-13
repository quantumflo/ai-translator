@echo off

:: Set the virtual environment directory
set VENV_DIR=venv

:: Check if the virtual environment already exists
if not exist %VENV_DIR% (
    :: Create the virtual environment
    python -m venv %VENV_DIR%
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

:: Activate the virtual environment
call %VENV_DIR%\Scripts\activate

pip3 install -r requirements.txt --index-url https://download.pytorch.org/whl/cu124

echo All packages installed successfully.
pause
