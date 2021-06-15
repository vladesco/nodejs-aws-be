import { Repository } from '@nodejs/aws-be/types';
import { Client } from 'pg';
import { Product, ProductDTO } from '../types';

export class ProductRepository implements Repository<ProductDTO, Product> {
    private connection: Promise<Client>;

    constructor(client: Client) {
        this.connection = client.connect().then(() => client);
    }

    public async create(newProduct: ProductDTO): Promise<Product> {
        const client = await this.connection;

        try {
            await client.query('BEGIN');
            const { title, description, image, price, count } = newProduct;

            const {
                rows: [productInfo],
            } = await client.query<Omit<Product, 'count'>>({
                text: `
                    INSERT INTO Products (title, description, image, price)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                `,
                values: [title, description, image, price],
            });

            const {
                rows: [stockInfo],
            } = await client.query<Pick<Product, 'count'>>({
                text: `
                INSERT INTO Stocks (product_id, count)
                VALUES ($1, $2)
                RETURNING *
            `,
                values: [productInfo.id, count],
            });

            await client.query('COMMIT');

            return {
                ...productInfo,
                count: stockInfo.count,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
    }

    public async update(id: string, newProduct: ProductDTO): Promise<Product> {
        const client = await this.connection;
        try {
            await client.query('BEGIN');
            const { title, description, image, price, count } = newProduct;
            const {
                rows: [productInfo],
            } = await client.query<Product>({
                text: `
                UPDATE Products
                SET title = $2, description = $3, image = $4, price = $5, count = $6 
                WHERE id = $1
                `,
                values: [title, description, image, price, count, id],
            });

            const {
                rows: [stockInfo],
            } = await client.query<Pick<Product, 'count'>>({
                text: `
                UPDATE Stocks
                SET count = $2 
                WHERE id = $1
            `,
                values: [id, count],
            });

            await client.query('COMMIT');

            return {
                ...productInfo,
                count: stockInfo.count,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
    }

    public async delete(productId: string): Promise<Product> {
        const client = await this.connection;
        try {
            await client.query('BEGIN');
            const {
                rows: [stockInfo],
            } = await client.query<Pick<Product, 'count'>>({
                text: `
                DELETE FROM Stocks
                WHERE product_id = $1
                RETURNING count
                `,
                values: [productId],
            });

            const {
                rows: [productInfo],
            } = await client.query<Product>({
                text: `
                DELETE FROM Products
                WHERE id = $1
                RETURNING *
            `,
                values: [productId],
            });

            await client.query('COMMIT');

            return {
                ...productInfo,
                count: stockInfo.count,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
    }

    public async findOne(productId: string): Promise<Product> {
        const client = await this.connection;
        const {
            rows: [product],
        } = await client.query<Product>({
            text: `
                SELECT p.id, p.title, p.description, p.image, p.price, s.count  
                FROM Products p INNER JOIN Stocks s
                ON p.id = s.product_id 
                WHERE id = $1
                `,
            values: [productId],
        });

        return product;
    }

    public async findAll(): Promise<Product[]> {
        const client = await this.connection;
        const { rows: products } = await client.query<Product>(
            `
            SELECT p.id, p.title, p.description, p.image, p.price, s.count 
            FROM Products p INNER JOIN Stocks s
            ON p.id = s.product_id
            `
        );

        return products;
    }
}
