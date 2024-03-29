import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const ids = JSON.parse(event.body);
    const userId = getUserId(event);
    
    const result = await new EntryService().commitMany(userId, ids);
    
    return defaultResult(200, result);
}