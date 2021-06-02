import { APIGatewayProxyEvent } from "aws-lambda"

export function defaultResult(defaultStatusCode: number, result?: any) {
    if(!result) {
        return { statusCode: defaultStatusCode, body: null };
    }

    if(!result.error) {
       return {
            body: JSON.stringify(result),
            statusCode: defaultStatusCode
        }
    } else {
        return {
            body: JSON.stringify({ error: result.error }),
            statusCode: result.status
        }
    }
}

export function getUserId(event: APIGatewayProxyEvent): string {
    return event.requestContext.authorizer.userId;
}