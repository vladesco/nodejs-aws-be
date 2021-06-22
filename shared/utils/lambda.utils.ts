import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { isHttpError } from '../types';
import { formatErrorResponse } from './apiGateway.utils';

const errroHandler: middy.MiddlewareFunction<any, any> = (request, next) => {
    const error = request.error;

    if (isHttpError(error)) {
        request.response = formatErrorResponse(error.getMessage(), error.getStatusCode());
        next();
    } else {
        request.response = formatErrorResponse(error.message);
        next();
    }
};

export const middyfy = (handler) => {
    return middy(handler).use(middyJsonBodyParser()).use({ onError: errroHandler });
};
