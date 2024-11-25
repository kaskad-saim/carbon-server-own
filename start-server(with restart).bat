@echo off
:: Команда для сворачивания командной строки
powershell -command "(new-object -com 'shell.application').minimizeall()"
cd /d "C:\web\carbon-server-own"

:loop
:: Попробуем найти процесс, использующий порт 3002, и убить его, если он существует
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    if "%%a" NEQ "0" (
        taskkill /F /PID %%a
    )
)

:: Пауза для завершения процесса
timeout /t 2 /nobreak >nul

:: Запуск сервера Node.js в скрытом режиме
start /min "" "C:\Program Files\nodejs\node.exe" src/server.js

:: Ждем 12 часов перед перезапуском
timeout /t 43200 /nobreak >nul

:: Перезапуск сервера, возвращаемся к началу цикла
goto loop
