import AWS, { SNS } from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { NotificationService } from '../../services';
import { NotificationServiceConfig } from '../../types';

const withAWSCallback =
    (fn: Function) => (params: any, callback: (err: any, data: any) => void) => {
        console.log(params, callback, fn(params));
        callback(false, fn(params));
    };

describe('notification service', () => {
    AWSMock.setSDKInstance(AWS);

    const notificationServiceConfig: NotificationServiceConfig = {
        snsArn: 'testSnsUrl',
    };

    let notificationService: NotificationService;
    let publishSpy: jest.Mock;

    beforeEach(() => {
        publishSpy = jest.fn();

        AWSMock.mock('SNS', 'publish', withAWSCallback(publishSpy));

        notificationService = new NotificationService(
            new SNS(),
            notificationServiceConfig
        );
    });

    afterEach(() => {
        AWSMock.restore('SNS');
    });

    describe('publish method', () => {
        it('should call sns sendMessage method with correct params', async () => {
            const { snsArn } = notificationServiceConfig;
            const testSubject = 'test subject';
            const testData = {
                test: 'test',
            };
            const testMessageAttributes = {};

            await notificationService.notificate(
                testSubject,
                testData,
                testMessageAttributes
            );

            expect(publishSpy).toHaveBeenCalledWith({
                Subject: testSubject,
                Message: JSON.stringify(testData),
                TopicArn: snsArn,
                MessageAttributes: testMessageAttributes,
            });
        });
    });
});
