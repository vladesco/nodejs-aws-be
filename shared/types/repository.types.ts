export interface Repository<T, U> {
    create(item: T): Promise<U>;
    update(id: string, item: T): Promise<U>;
    delete(id: string): Promise<U>;
    findOne(id: string): Promise<U>;
    findAll(): Promise<U[]>;
}
