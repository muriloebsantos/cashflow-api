import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import UserService from "../services/user-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { newBalance, newSavings, createEntry } = JSON.parse(event.body);
    const userId = getUserId(event);
    
    await new UserService().adjustBalance(userId, newBalance, newSavings, createEntry);
    
    return defaultResult(201);
}