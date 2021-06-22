import { HttpStatusCode } from '../types';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

export const formatJSONResponse = (
    response: Record<string, any>,
    statusCode: number = HttpStatusCode.OK
) => {
    return {
        headers: corsHeaders,
        statusCode,
        body: JSON.stringify(response),
    };
};

export const formatErrorResponse = (
    errorMessage: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR
) => {
    return {
        statusCode: statusCode,
        body: errorMessage,
        headers: {
            'Content-Type': 'text/plain',
            ...corsHeaders,
        },
    };
};
