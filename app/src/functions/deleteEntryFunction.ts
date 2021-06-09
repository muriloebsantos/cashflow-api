import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event);
    const entryId = event.pathParameters.id;
    const deleteAll = event.queryStringParameters?.deleteAll || 0;
    
    await new EntryService().delete(userId, entryId, Number(deleteAll));

    return defaultResult(200);
}