import { ProductService } from '../../services';
import { ProductRepository } from '../../repositories';
import { BadRequestError, NotFoundError, ValidationError } from '@nodejs/aws-be/classes';
import { Product, ProductDTO } from '../../types';

jest.mock('../../repositories/product.repository');

describe('product service', () => {
    let productService: ProductService;
    let mockProductRepository: jest.Mocked<ProductRepository>;

    beforeEach(() => {
        (ProductRepository as any).mockClear();

        productService = new ProductService(new ProductRepository(null));
        [mockProductRepository] = (ProductRepository as any).mock.instances;
    });

    describe('getProductById method', () => {
        it('should call findOne repository method and return product', async () => {
            const testProductId = '6b4b1635-9369-448f-bb26-368b5209036d';
            const testProduct: Product = {
                id: testProductId,
                title: 'test',
                description: 'test',
                image: 'test',
                price: 0,
                count: 0,
            };

            mockProductRepository.findOne.mockResolvedValue(testProduct);

            const product = await productService.getProductById(testProductId);

            expect(product).toEqual(testProduct);
            expect(mockProductRepository.findOne).toBeCalledWith(testProductId);
        });

        it('should throw bad request error if id is invalid UUID', async () => {
            const testProductId = 'test product id';
            try {
                await productService.getProductById(testProductId);
            } catch (error) {
                expect(error instanceof BadRequestError).toBeTruthy();
            }
        });

        it('should throw not fount error if there are no poduct with such id', async () => {
            const testProductId = '6b4b1635-9369-448f-bb26-368b5209036d';

            mockProductRepository.findOne.mockResolvedValue(null);

            try {
                await productService.getProductById(testProductId);
            } catch (error) {
                expect(error instanceof NotFoundError).toBeTruthy();
            }
        });
    });

    describe('getProducts method', () => {
        it('should call find repository method and return products', async () => {
            const testProducts: Product[] = [
                {
                    id: 'test id',
                    title: 'test',
                    description: 'test',
                    image: 'test',
                    price: 0,
                    count: 0,
                },
            ];

            mockProductRepository.findAll.mockResolvedValue(testProducts);

            const products = await productService.getProducts();

            expect(products).toEqual(testProducts);
            expect(mockProductRepository.findAll).toBeCalled();
        });

        it('should throw not fount error if there are no poducts', async () => {
            mockProductRepository.findAll.mockResolvedValue(null);

            try {
                await productService.getProducts();
            } catch (error) {
                expect(error instanceof NotFoundError).toBeTruthy();
            }
        });
    });

    describe('createProduct method', () => {
        it('should call create repository method and return created product', async () => {
            const testProductDTO: ProductDTO = {
                title: 'test',
                description: 'test',
                image: 'https://test.com',
                price: 0,
                count: 0,
            };

            const createdTestProduct: Product = {
                id: 'test id',
                ...testProductDTO,
            };

            mockProductRepository.create.mockResolvedValue(createdTestProduct);

            const createdProduct = await productService.createProduct(testProductDTO);

            expect(createdProduct).toEqual(createdTestProduct);
            expect(mockProductRepository.create).toBeCalledWith(testProductDTO);
        });

        it('should throw validation error if prodcut dto is invalid', async () => {
            try {
                await productService.createProduct(null);
            } catch (error) {
                expect(error instanceof ValidationError).toBeTruthy();
            }
        });
    });
});
