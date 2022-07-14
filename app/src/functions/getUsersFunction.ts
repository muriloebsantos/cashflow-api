import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import UserService from "../services/user-service";
import { defaultResult, getIsAdmin, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if(!getIsAdmin(event)){
        return defaultResult(403);
    }

    const users = await new UserService().listUsers();
    
    return defaultResult(200, users);
}