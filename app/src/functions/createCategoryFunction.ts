import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
  import CategoryServices from "../services/categories-service";
  import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const categoryData: ICategory = JSON.parse(event.body);
    const userId: string = getUserId(event);
    const result = await new CategoryServices().createCategory(categoryData, userId);
    
    if(result && result.error) {
        return defaultResult(result.status, result.error);
    }

    return defaultResult(201, result);
}