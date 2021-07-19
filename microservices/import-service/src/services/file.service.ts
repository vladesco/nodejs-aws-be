import { BadRequestError } from '@nodejs/aws-be/classes';
import { S3 } from 'aws-sdk';
import csv from 'csv-parser';

import { FileServiceConfig } from '../types';
import { isFilenameValid } from '../validation';

export class FileService {
    constructor(private storageService: S3, private config: FileServiceConfig) {}

    public async createUploadFileLink(filename: string, folder: string): Promise<string> {
        const { bucketName, linkExpiredTimeInSec, fileExtension } = this.config;

        if (!isFilenameValid(filename, fileExtension)) {
            throw new BadRequestError(`filename should have ${fileExtension} extension`);
        }

        const fullFilename = `${folder}/${filename}`;

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

    public async moveFileFromFirstFolderToSecond(
        fileKey: string,
        sourceFolder: string,
        targetFolder: string
    ): Promise<void> {
        const { bucketName } = this.config;

        await this.storageService
            .copyObject({
                Bucket: bucketName,
                CopySource: `${bucketName}/${fileKey}`,
                Key: fileKey.replace(sourceFolder, targetFolder),
            })
            .promise();

        await this.storageService
            .deleteObject({ Bucket: bucketName, Key: fileKey })
            .promise();
    }

    public async logFileContent(fileKey: string): Promise<void> {
        const { bucketName } = this.config;
        const file = this.storageService.getObject({ Bucket: bucketName, Key: fileKey });

        const waitingPromise = new Promise<void>((resolve, reject) =>
            file
                .createReadStream()
                .pipe(csv())
                .on('data', console.log)
                .on('end', resolve)
                .on('error', reject)
        );

        return waitingPromise;
    }
}
