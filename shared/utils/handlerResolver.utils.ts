import { LambdaConfig } from '../types';

export const addPathToLambdaConfig = (
    lambdaConfig: LambdaConfig,
    lambdaContext: string
): LambdaConfig => {
    const lambdaPath = `${lambdaContext
        .split(process.cwd())[1]
        .substring(1)
        .replace(/\\/g, '/')}`;

    return { ...lambdaConfig, handler: lambdaPath };
};
