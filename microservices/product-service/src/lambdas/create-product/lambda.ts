import 'source-map-support/register';
import { formatJSONResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { ProductService } from '../../services';
import { ProductDTO } from '../../types';

const lambaConstructor: (
    productService: ProductService
) => LambdaGateway<ProductDTO, never, never> = (productService: ProductService) =>
    async function createProductLambda(event) {
        const productDTO = event.body;
        const product = await productService.createProduct(productDTO);

        return formatJSONResponse(product);
    };

export const initCreateProductLambda = (productService: ProductService) =>
    middyfy(lambaConstructor(productService));
