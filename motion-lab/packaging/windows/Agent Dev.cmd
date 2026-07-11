@echo off
cd /d "%~dp0"
set "PATH=%~dp0runtime\node;%PATH%"
if not exist ".agent-dev-ready" (
  echo Installing locked development dependencies for the first time...
  call "%~dp0runtime\node\npm.cmd" ci || exit /b 1
  type nul > ".agent-dev-ready"
)
call "%~dp0runtime\node\npm.cmd" run dev
