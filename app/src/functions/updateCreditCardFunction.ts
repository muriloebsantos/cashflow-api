import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import CreditCardService from "../services/credit-card-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const creditCard = JSON.parse(event.body) as ICreditCard
    const userId = getUserId(event)
    await new CreditCardService().update(userId, creditCard)
    return defaultResult(200);
}