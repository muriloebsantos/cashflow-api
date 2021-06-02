import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import CreditCardService from "../services/credit-card-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const creditCardInfo = JSON.parse(event.body);
    const userId = getUserId(event);
    const result = await new CreditCardService().create(creditCardInfo, userId);
    
    return defaultResult(201, result);
}