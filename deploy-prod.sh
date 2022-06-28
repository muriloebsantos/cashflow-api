cd app
npm install
npm run build
cd ..
sam build 
sam deploy --stack-name CashFlowApi --parameter-overrides ApiName="Cashflow API"