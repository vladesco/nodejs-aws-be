import 'source-map-support/register';
import { formatJSONResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { ProductService } from '../../services';

const lambaConstructor: (
    service: ProductService
) => LambdaGateway<never, never, { id: string }> = (service: ProductService) =>
    async function getProductLamda(event) {
        const productId = event.pathParameters.id;
        const product = await service.getProductById(productId);

        return formatJSONResponse(product);
    };

export const initGetProductLambda = (service: ProductService) =>
    middyfy(lambaConstructor(service));
