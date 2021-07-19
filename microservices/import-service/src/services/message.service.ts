import { SQS } from 'aws-sdk';
import { MessageServiceConfig } from '../types';

export class MessageService {
    constructor(private queueService: SQS, private config: MessageServiceConfig) {}

    public async publish<T>(data: T): Promise<SQS.SendMessageResult> {
        const { sqsUrl } = this.config;

        return this.queueService
            .sendMessage({ QueueUrl: sqsUrl, MessageBody: JSON.stringify(data) })
            .promise();
    }
}
