import { SNS } from 'aws-sdk';
import { NotificationServiceConfig } from '../types';

export class NotificationService {
    constructor(
        private notificationQueue: SNS,
        private config: NotificationServiceConfig
    ) {}

    public async notificate<T>(
        subject: string,
        data: T,
        attributes?: Record<string, any>
    ): Promise<SNS.PublishResponse> {
        const { snsArn } = this.config;

        return this.notificationQueue
            .publish({
                Subject: subject,
                Message: JSON.stringify(data),
                TopicArn: snsArn,
                MessageAttributes: attributes,
            })
            .promise();
    }
}
