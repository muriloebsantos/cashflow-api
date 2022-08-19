import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
  import CategoryServices from "../services/categories-service";
  import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId:string = getUserId(event);
    const result = await new CategoryServices().getCategories(userId);
    
    return defaultResult(200, result);
}