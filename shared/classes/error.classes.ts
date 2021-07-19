import { HttpError, HttpStatusCode } from '../types';

export class ValidationError extends Error implements HttpError {
    get statusCode() {
        return HttpStatusCode.BAD_REQUEST;
    }

    get message(): string {
        return `[Validation]: ${this.message}`;
    }
}

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
