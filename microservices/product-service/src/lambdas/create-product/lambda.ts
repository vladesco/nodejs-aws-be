import 'source-map-support/register';
import { formatJSONResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { ProductService } from '../../services';
import { ProductDTO } from '../../types';

const lambaConstructor: (
    service: ProductService
) => LambdaGateway<ProductDTO, never, never> = (service: ProductService) =>
    async function createProductLambda(event) {
        const productDTO = event.body;
        const product = await service.createProduct(productDTO);

        return formatJSONResponse(product);
    };

export const initCreateProductLambda = (service: ProductService) =>
    middyfy(lambaConstructor(service));
