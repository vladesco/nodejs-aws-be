import { HttpError, HttpStatusCode } from '../types';

export class NotFoundError extends Error implements HttpError {
    get statusCode() {
        return HttpStatusCode.NOT_FOUND;
    }

    get message(): string {
        return `[Not Found]: ${this.message}`;
    }
}

export class BadRequestError extends Error implements HttpError {
    get statusCode() {
        return HttpStatusCode.BAD_REQUEST;
    }

    get message(): string {
        return `[Bad Request]: ${this.message}`;
    }
}

export class UnauthorizedError extends Error implements HttpError {
    get statusCode() {
        return HttpStatusCode.UNAUTHORIZED;
    }

    get message(): string {
        return `[Unauthorized]: ${this.message}`;
    }
}

export class ForbiddenError extends Error implements HttpError {
    get statusCode() {
        return HttpStatusCode.FORBIDDEN;
    }

    get message(): string {
        return `[Forbidden]: ${this.message}`;
    }
}
