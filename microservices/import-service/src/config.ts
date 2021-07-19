import { MicroserviceConfig } from '@nodejs/aws-be/types';
import { addPathToLambdaConfig } from '@nodejs/aws-be/utils';
import { uploadFileLambdaConfig } from './lambdas/import-file';
import { parseFileLambdaConfig } from './lambdas/import-file-parser';

export const microseviceConfig: MicroserviceConfig = {
    uploadFileLambda: addPathToLambdaConfig(
        uploadFileLambdaConfig,
        `${__dirname}/microservice.uploadFileLambda`
    ),
    parseFileLambda: addPathToLambdaConfig(
        parseFileLambdaConfig,
        `${__dirname}/microservice.parseFileLambda`
    ),
};
