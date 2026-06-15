@echo off
REM Put a shortcut to this file in:  shell:startup
REM (Win+R -> shell:startup -> paste shortcut)
REM Runs the daily fleet heartbeat for this machine, then exits.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0heartbeat.ps1"
