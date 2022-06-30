import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult 
  } from "aws-lambda";
import UserService from "../services/user-service";
import { defaultResult } from "./index"
  
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createdUserFormInfo = JSON.parse(event.body) as IUser;
    const user = {
       name: createdUserFormInfo.name,
       email: createdUserFormInfo.email,
       password: createdUserFormInfo.password
    } as IUser;

    const result = await new UserService().createUser(user);

    return defaultResult(201, result);
}