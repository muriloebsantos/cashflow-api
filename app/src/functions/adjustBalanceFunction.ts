import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import UserService from "../services/user-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBalance = JSON.parse(event.body).newBalance;
    const userId = getUserId(event);
    
    await new UserService().adjustBalance(userId, newBalance);
    
    return defaultResult(201);
}