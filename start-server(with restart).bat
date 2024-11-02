@echo off
cd /d "C:\web\carbon-server-own"

:loop
:: Попробуем найти процесс, использующий порт 3001, и убить его, если он существует
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    if "%%a" NEQ "0" (
        taskkill /F /PID %%a
    )
)

:: Пауза для завершения процесса
timeout /t 2 /nobreak >nul

:: Запуск сервера
start "" "C:\Program Files\nodejs\node.exe" src/server.js

:: Ждем 30 минут перед перезапуском
timeout /t 180 /nobreak >nul

:: Перезапуск сервера, возвращаемся к началу цикла
goto loop
