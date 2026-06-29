@echo off
setlocal
set SRC=%USERPROFILE%\.cursor\projects\C-Users-Darren-AppData-Local-Temp-53031d33-3864-4bb4-b6a4-e36b925afdcd\assets\apis-avatar.png
set DST=%~dp0..\public\images\apis-avatar.png
if not exist "%~dp0..\public\images" mkdir "%~dp0..\public\images"
if exist "%SRC%" (
  copy /Y "%SRC%" "%DST%" >nul
  echo Copied generated avatar to public\images\apis-avatar.png
) else (
  echo Source not found. Save your APIS avatar as public\images\apis-avatar.png
)
if exist "%DST%" (echo READY) else (echo MISSING)
