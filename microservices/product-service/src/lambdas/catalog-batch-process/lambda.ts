import 'source-map-support/register';
import { middyfy } from '@nodejs/aws-be/utils';
import { HttpStatusCode, LambdaSQS } from '@nodejs/aws-be/types';
import { NotificationService, ProductService } from '../../services';
import { ProductDTO } from '../../types';

const lambaConstructor: (
    productService: ProductService,
    notificationService: NotificationService
) => LambdaSQS = (productService, notificationService) =>
    async function catalogBatchProcessLambda(event) {
        const newProducts: ProductDTO[] = event.Records.map(({ body }) =>
            JSON.parse(body)
        );
        const createdProducts = await productService.createListOfProducts(newProducts);

        createdProducts.forEach((product) =>
            notificationService.notificate('new product was created', product, {
                count: {
                    DataType: 'Number',
                    StringValue: String(product.count),
                },
            })
        );

        return { statusCode: HttpStatusCode.OK };
    };

export const initCatalogBatchProcessLambda = (
    productService: ProductService,
    notificationService: NotificationService
) => middyfy(lambaConstructor(productService, notificationService));
