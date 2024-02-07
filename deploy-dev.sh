cd app
npm install
npm run build
cd ..
sam build 
sam deploy --stack-name CashFlowApiDev --parameter-overrides Env=dev ApiName=CashFlowDev DbConnection="$CashflowDbDev" JwtKey="$JwtKey"