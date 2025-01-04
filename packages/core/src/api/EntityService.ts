import { User } from "./AuthService";


export interface EntityService<T> {

    getAll(count?: number): Promise<T[]>;

    getById(id: string): Promise<T>;

    create(user: User, entity: T): Promise<T>;

    update(user: User, entity: T, changes: Map<string, unknown>): Promise<T>;

}
