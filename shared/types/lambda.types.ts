import { AWS } from '@serverless/typescript';
import {
    Handler,
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    S3Event,
    SQSEvent,
} from 'aws-lambda';
import { HttpStatusCode } from './http.types';

type Property<T, U extends keyof T> = T[U];

export type MicroserviceConfig = Property<AWS, 'functions'>;
export type LambdaConfig = Property<MicroserviceConfig, 'function'>;

export type LambdaGateway<Body = never, Query = never, Path = never> = Handler<
    APIGatewayProxyEvent & {
        body: Body;
        queryStringParameters: Query;
        pathParameters: Path;
    },
    APIGatewayProxyResult
>;

export type LambdaS3 = Handler<S3Event, { statusCode: HttpStatusCode }>;
export type LambdaSQS = Handler<SQSEvent, { statusCode: HttpStatusCode }>;
