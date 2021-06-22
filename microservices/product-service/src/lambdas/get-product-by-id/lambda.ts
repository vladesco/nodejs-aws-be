import 'source-map-support/register';
import { formatJSONResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { ProductService } from '../../services';

const lambaConstructor: (
    service: ProductService
) => LambdaGateway<never, never, { id: string }> =
    (service: ProductService) => async (event) => {
        const productId = event.pathParameters.id;
        const product = await service.getProductById(productId);

        return formatJSONResponse(product);
    };

export const createProductLambda = (service: ProductService) =>
    middyfy(lambaConstructor(service));
