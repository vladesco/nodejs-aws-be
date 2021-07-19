export type FileServiceConfig = {
    bucketName: string;
    fileExtension: string;
    linkExpiredTimeInSec: number;
    uploadFilesFolder: string;
    parsedFilesFolder: string;
};
