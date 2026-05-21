@echo off 
cd /d C:\Users\titus\Desktop\travel-app 
echo ======================================== 
echo   Starting TravelGo Flight System 
echo ======================================== 
echo [1/2] Starting Backend... 
start "Backend" cmd /k "cd backend && mvnw spring-boot:run" 
timeout /t 5 
echo [2/2] Starting Frontend... 
start "Frontend" cmd /k "cd client && npm start" 
timeout /t 8 
start http://localhost:3000 
echo Done! Close this window when done. 
pause 
