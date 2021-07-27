import { BadRequestError } from '@nodejs/aws-be/classes';
import AWS, { S3 } from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { FileService } from '../../services';
import { FileServiceConfig } from '../../types';

const withAWSCallback =
    (fn: Function) => (params: any, callback: (err: any, data: any) => void) => {
        console.log(params, callback, fn(params));
        callback(false, fn(params));
    };

describe('file service', () => {
    AWSMock.setSDKInstance(AWS);

    const fileServiceConfig: FileServiceConfig = {
        bucketName: 'test bucket name',
        fileExtension: 'test',
        uploadFilesFolder: 'test upload files folder',
        parsedFilesFolder: 'test parsed files folder',
        linkExpiredTimeInSec: 0,
    };

    let fileSevice: FileService;
    let getSignedUrlPromiseSpy: jest.Mock;
    let getObjectSpy: jest.Mock;
    let copyObjectSpy: jest.Mock;
    let deleteObjectSpy: jest.Mock;

    beforeEach(() => {
        getSignedUrlPromiseSpy = jest.fn();
        getObjectSpy = jest.fn();
        copyObjectSpy = jest.fn();
        deleteObjectSpy = jest.fn();

        AWSMock.mock('S3', 'getSignedUrlPromise', getSignedUrlPromiseSpy);
        AWSMock.mock('S3', 'getObject', withAWSCallback(getObjectSpy));
        AWSMock.mock('S3', 'copyObject', withAWSCallback(copyObjectSpy));
        AWSMock.mock('S3', 'deleteObject', withAWSCallback(deleteObjectSpy));

        fileSevice = new FileService(new S3(), fileServiceConfig);
    });

    afterEach(() => {
        AWSMock.restore('S3');
    });

    describe('createUploadFileLink method', () => {
        it('should call s3 getSignedUrlPromise method with correct params', async () => {
            const { fileExtension, bucketName, linkExpiredTimeInSec, uploadFilesFolder } =
                fileServiceConfig;
            const testFilename = `test.${fileExtension}`;

            await fileSevice.createUploadFileLink(testFilename);

            const [action, linkParams] = getSignedUrlPromiseSpy.mock.calls[0];

            expect(action).toBe('putObject');
            expect(linkParams).toEqual({
                Bucket: bucketName,
                Expires: linkExpiredTimeInSec,
                ContentType: `text/${fileExtension}`,
                Key: `${uploadFilesFolder}/${testFilename}`,
            });
        });

        it('should throw an error if filename is incorrect', async () => {
            const { fileExtension } = fileServiceConfig;
            const testFilename = `test.not-${fileExtension}`;

            try {
                await fileSevice.createUploadFileLink(testFilename);
            } catch (error) {
                expect(error instanceof BadRequestError).toBeTruthy();
            }
        });
    });

    describe('moveFileFromFirstFolderToSecond method', () => {
        it('should call S3 copyObject and deleteObject with correct params and in correct way', async () => {
            const { bucketName, uploadFilesFolder, parsedFilesFolder } =
                fileServiceConfig;
            const testFileKey = 'test file key';

            await fileSevice.moveFileToStashFolder(`${uploadFilesFolder}/${testFileKey}`);

            expect(copyObjectSpy).toHaveBeenCalledWith({
                Bucket: bucketName,
                CopySource: `${bucketName}/${uploadFilesFolder}/${testFileKey}`,
                Key: `${parsedFilesFolder}/${testFileKey}`,
            });

            expect(deleteObjectSpy).toHaveBeenCalledWith({
                Bucket: bucketName,
                Key: `${uploadFilesFolder}/${testFileKey}`,
            });

            const [copyObjectMethodCallOrder] = copyObjectSpy.mock.invocationCallOrder;
            const [deleteObjectMethodCallOrder] =
                deleteObjectSpy.mock.invocationCallOrder;

            expect(copyObjectMethodCallOrder).toBeLessThan(deleteObjectMethodCallOrder);
        });
    });

    describe('logFileContent method', () => {
        it('should call S3 getObject', async () => {
            const testFileKey = 'test file key';
            const testFileContent = 'test file content';

            getObjectSpy.mockReturnValue({ Body: testFileContent });
            await fileSevice.parseFileContent(testFileKey);

            const [fileParams] = getObjectSpy.mock.calls[0];

            expect(fileParams).toEqual({
                Bucket: fileServiceConfig.bucketName,
                Key: testFileKey,
            });
        });
    });
});
