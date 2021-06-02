cd app
call npm run build
cd ..
call sam build 
call sam deploy
pause