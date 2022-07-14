import { APIGatewayProxyEvent } from "aws-lambda"

export function defaultResult(defaultStatusCode: number, result?: any) {
    const headers = {
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type'
    }

    if(!result) {
        return { statusCode: defaultStatusCode, body: null, headers: headers };
    }

    if(!result.error) {
       return {
            body: JSON.stringify(result),
            statusCode: defaultStatusCode,
            headers: headers
        }
    } else {
        return {
            body: JSON.stringify({ error: result.error }),
            statusCode: result.status,
            headers: headers
        }
    }
}

export function getUserId(event: APIGatewayProxyEvent): string {
    return event.requestContext.authorizer.userId;
}

export function getIsAdmin(event: APIGatewayProxyEvent): boolean {
    return event.requestContext.authorizer.isAdmin == "true";
}