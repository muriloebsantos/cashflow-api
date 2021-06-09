import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload = JSON.parse(event.body);
    const entryId = event.pathParameters.id;
    const updateAll = event.queryStringParameters?.updateAll || 0;
    const userId = getUserId(event);
    
    await new EntryService().update(userId, entryId, payload, Number(updateAll));
    
    return defaultResult(200);
}