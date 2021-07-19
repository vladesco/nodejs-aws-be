import { BadRequestError } from '@nodejs/aws-be/classes';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';

import { FileServiceConfig } from '../types';
import { isFilenameValid } from '../validation';

export class FileService {
    constructor(private storageService: S3, private config: FileServiceConfig) {}

    public async createUploadFileLink(filename: string): Promise<string> {
        const { bucketName, linkExpiredTimeInSec, fileExtension, uploadFilesFolder } =
            this.config;

        if (!isFilenameValid(filename, fileExtension)) {
            throw new BadRequestError(`filename should have ${fileExtension} extension`);
        }

        const fullFilename = `${uploadFilesFolder}/${filename}`;

        const uploadFileLink = await this.storageService.getSignedUrlPromise(
            'putObject',
            {
                Bucket: bucketName,
                Key: fullFilename,
                Expires: linkExpiredTimeInSec,
                ContentType: `text/${fileExtension}`,
            }
        );

        return uploadFileLink;
    }

    public async moveFileToStashFolder(fileKey: string): Promise<void> {
        const { bucketName, uploadFilesFolder, parsedFilesFolder } = this.config;

        await this.storageService
            .copyObject({
                Bucket: bucketName,
                CopySource: `${bucketName}/${fileKey}`,
                Key: fileKey.replace(uploadFilesFolder, parsedFilesFolder),
            })
            .promise();

        await this.storageService
            .deleteObject({ Bucket: bucketName, Key: fileKey })
            .promise();
    }

    public async parseFileContent<T>(fileKey: string): Promise<T[]> {
        const { bucketName } = this.config;
        const file = this.storageService.getObject({ Bucket: bucketName, Key: fileKey });
        const content: T[] = [];

        const waitingPromise = new Promise<T[]>((resolve, reject) =>
            file
                .createReadStream()
                .pipe(csv())
                .on('data', (row: T) => content.push(row))
                .on('end', () => resolve(content))
                .on('error', reject)
        );

        return waitingPromise;
    }
}
