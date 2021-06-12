export interface Repository<T> {
    create(item: T): Promise<T>;
    update(id: string, item: T): Promise<T>;
    delete(id: string): Promise<T>;
    findOne(id: string): Promise<T>;
    find(pattern?: Partial<T>): Promise<T[]>;
}
