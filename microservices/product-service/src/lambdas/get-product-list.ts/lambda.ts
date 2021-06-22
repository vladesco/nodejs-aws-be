import 'source-map-support/register';
import { formatJSONResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { ProductService } from '../../services';

const lambaConstructor: (service: ProductService) => LambdaGateway<never, never> =
    (service: ProductService) => async () => {
        const products = await service.getProducts();

        return formatJSONResponse(products);
    };

export const createProductlistLambda = (service: ProductService) =>
    middyfy(lambaConstructor(service));
