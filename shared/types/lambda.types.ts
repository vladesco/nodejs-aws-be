import { AWS } from '@serverless/typescript';
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type MicroserviceConfig = Pick<AWS, 'functions'>['functions'];
export type LambdaConfig = MicroserviceConfig['function'];

export type LambdaGateway<Body = never, Query = never, Path = never> = Handler<
    APIGatewayProxyEvent & {
        body: Body;
        queryStringParameters: Query;
        pathParameters: Path;
    },
    APIGatewayProxyResult
>;
