import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
  import CategoryServices from "../services/categories-service";
  import { defaultResult, getUserId } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // todo: fix => get id from route param
    const categoryData:ICategory = JSON.parse(event.body)
    const userId:string = getUserId(event);
    const result = await new CategoryServices().deleteCategory(categoryData, userId)
    
    return defaultResult(200, result);
}