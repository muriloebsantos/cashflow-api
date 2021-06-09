import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event);
    const initialMonth = event.queryStringParameters?.month || 0;
    const initialYear = event.queryStringParameters?.year || 0;
    const includeOverdue = event.queryStringParameters?.includeOverdue || 0;
    const result = await new EntryService().getPendingEntries(userId, Number(initialMonth), Number(initialYear), Number(includeOverdue));
    
    return defaultResult(200, result);
}