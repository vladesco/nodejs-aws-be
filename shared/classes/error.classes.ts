import { HttpError, HttpStatusCode } from '../types';

export class ValidationError extends Error implements HttpError {
    public getStatusCode() {
        return HttpStatusCode.BAD_REQUEST;
    }

    public getMessage(): string {
        return `[Validation]: ${this.message}`;
    }
}

export class NotFoundError extends Error implements HttpError {
    public getStatusCode() {
        return HttpStatusCode.NOT_FOUND;
    }
    public getMessage(): string {
        return `[Not Found]: ${this.message}`;
    }
}

export class BadRequestError extends Error implements HttpError {
    public getStatusCode() {
        return HttpStatusCode.BAD_REQUEST;
    }
    public getMessage(): string {
        return `[Bad Request]: ${this.message}`;
    }
}
