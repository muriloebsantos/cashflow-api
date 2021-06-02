import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const entryId = event.pathParameters.entryId;
    const userId = getUserId(event);
    
    const result = await new EntryService().commitSingleEntry(userId, entryId);
    
    return defaultResult(200, result);
}