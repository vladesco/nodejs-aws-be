import AWS, { SQS } from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { MessageService } from '../../services';
import { MessageServiceConfig } from '../../types';

const withAWSCallback =
    (fn: Function) => (params: any, callback: (err: any, data: any) => void) => {
        console.log(params, callback, fn(params));
        callback(false, fn(params));
    };

describe('message service', () => {
    AWSMock.setSDKInstance(AWS);

    const messageServiceConfig: MessageServiceConfig = {
        sqsUrl: 'test queue url',
    };

    let messageService: MessageService;
    let sendMessageSpy: jest.Mock;

    beforeEach(() => {
        sendMessageSpy = jest.fn();

        AWSMock.mock('SQS', 'sendMessage', withAWSCallback(sendMessageSpy));

        messageService = new MessageService(new SQS(), messageServiceConfig);
    });

    afterEach(() => {
        AWSMock.restore('SQS');
    });

    describe('publish method', () => {
        it('should call sqs sendMessage method with correct params', async () => {
            const { sqsUrl } = messageServiceConfig;
            const testData = {
                test: 'test',
            };

            await messageService.publish(testData);

            expect(sendMessageSpy).toHaveBeenCalledWith({
                QueueUrl: sqsUrl,
                MessageBody: JSON.stringify(testData),
            });
        });
    });
});
