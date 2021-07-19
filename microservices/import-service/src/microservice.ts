import { S3, SQS } from 'aws-sdk';
import { FileService, MessageService } from './services';
import { initUploadFileLambda } from './lambdas/import-file';
import { initParseFileLambda } from './lambdas/import-file-parser';
import { FileServiceConfig, MessageServiceConfig } from './types';

const fileServiceConfig: FileServiceConfig = {
    bucketName: process.env.BUCKET,
    fileExtension: process.env.FILE_EXTENSION,
    linkExpiredTimeInSec: Number(process.env.LINK_EXPIRED_TIME_IN_SEC),
    uploadFilesFolder: process.env.UPLOAD_FILES_FOLDER,
    parsedFilesFolder: process.env.PARSED_FILES_FOLDER,
};

const messageServiceConfig: MessageServiceConfig = {
    sqsUrl: process.env.SQS_URL,
};

const s3Bucket = new S3({ region: 'eu-west-1', signatureVersion: 'v4' });
const messageQueue = new SQS({ region: 'eu-west-1' });

const fileService = new FileService(s3Bucket, fileServiceConfig);
const messageService = new MessageService(messageQueue, messageServiceConfig);

export const uploadFileLambda = initUploadFileLambda(fileService);
export const parseFileLambda = initParseFileLambda(fileService, messageService);
