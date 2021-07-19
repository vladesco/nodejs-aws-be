import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { isHttpError } from '../types';
import { formatErrorResponse } from './apiGateway.utils';

const errorMiddleware: middy.MiddlewareFunction<any, any> = (request, next) => {
    const error = request.error;

    console.error(`error :${error.message}\nstack:${error.stack}`);

    request.response = isHttpError(error)
        ? formatErrorResponse(error.message, error.statusCode)
        : formatErrorResponse(error.message);
    next();
};

const createLogMiddleware: (handlerName: string) => middy.MiddlewareFunction<any, any> =
    (handlerName: string) => (event, next) => {
        console.log(`${handlerName} called with event ${JSON.stringify(event)}\n`);
        next();
    };

export const middyfy = (handler) => {
    return middy(handler)
        .use(middyJsonBodyParser())
        .use({ onError: errorMiddleware, before: createLogMiddleware(handler.name) });
};
