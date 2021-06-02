import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import UserService from "../services/user-service";
import { defaultResult } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authPayload = JSON.parse(event.body);
    
    const authData = await new UserService().authenticate(authPayload);
    
    return defaultResult(200, authData);
}