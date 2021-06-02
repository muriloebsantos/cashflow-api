import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const entriesInfo = JSON.parse(event.body);
    const userId = getUserId(event);
    
    await new EntryService().add(entriesInfo, userId);
    
    return defaultResult(201);
}