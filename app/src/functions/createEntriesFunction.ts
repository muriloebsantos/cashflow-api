import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import EntryService from "../services/entry-service";
import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const entriesInfo = JSON.parse(event.body);
    const userId = getUserId(event);
    
   const response = await new EntryService().add(entriesInfo, userId);

   if(response && response.error){
     return defaultResult(response.status, response.error);
   }
    
    return defaultResult(201);
}