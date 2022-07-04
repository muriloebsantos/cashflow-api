import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event);
    const initialDate:Date = new Date(event.queryStringParameters?.initDate);
    const endDate:Date = new Date(event.queryStringParameters?.endDate);
    const result = await new EntryService().getEntries(userId, initialDate, endDate);
    
    return defaultResult(200, result);
}