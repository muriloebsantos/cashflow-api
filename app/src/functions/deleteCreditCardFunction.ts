import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import CreditCardService from "../services/credit-card-service";
import { defaultResult, getUserId } from "./index"

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const creditCardId = event.pathParameters.id;

    const errorResponse = await new CreditCardService().delete(userId, creditCardId);

    return defaultResult(errorResponse?.status || 200, errorResponse?.error);
}