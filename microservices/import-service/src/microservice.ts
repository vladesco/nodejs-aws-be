import { S3 } from 'aws-sdk';
import { FileService } from './services';
import { initUploadFileLambda } from './lambdas/import-file';
import { initParseFileLambda } from './lambdas/import-file-parser';
import { FileServiceConfig } from './types';

const uploadFilesFolder = process.env.UPLOAD_FILES_FOLDER;
const parsedFilesFolder = process.env.PARSED_FILES_FOLDER;

const fileServiceConfig: FileServiceConfig = {
    bucketName: process.env.BUCKET,
    fileExtension: process.env.FILE_EXTENSION,
    linkExpiredTimeInSec: Number(process.env.LINK_EXPIRED_TIME_IN_SEC),
};

const s3Bucket = new S3({ region: 'eu-west-1', signatureVersion: 'v4' });
const fileService = new FileService(s3Bucket, fileServiceConfig);

export const uploadFileLambda = initUploadFileLambda(fileService, uploadFilesFolder);
export const parseFileLambda = initParseFileLambda(
    fileService,
    uploadFilesFolder,
    parsedFilesFolder
);
