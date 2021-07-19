import { AWS } from '@serverless/typescript';

const resourcesConfiguration: AWS = {
    service: 'file-storage',
    frameworkVersion: '2',
    provider: { name: 'aws', region: 'eu-west-1' },
    plugins: ['serverless-export-outputs'],
    custom: {
        exportOutputs: {
            include: ['BUCKET'],
            output: {
                file: '../../.env',
                format: 'toml',
            },
        },
    },
    resources: {
        Resources: {
            filesStore: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                AllowedHeaders: ['*'],
                                AllowedOrigins: ['*'],
                                AllowedMethods: ['GET', 'PUT', 'POST'],
                                MaxAge: '3600',
                            },
                        ],
                    },
                },
            },
        },
        Outputs: {
            BUCKET: {
                Value: {
                    Ref: 'filesStore',
                },
                Description: 'Name of the S3 bucket which stores files',
            },
        },
    },
};

module.exports = resourcesConfiguration;
