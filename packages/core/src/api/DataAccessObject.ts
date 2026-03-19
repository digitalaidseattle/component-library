/**
 *  DataAccessObject.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { User } from "./AuthService";

export type Identifier = string | number;

export interface Entity {
    id: Identifier | undefined | null;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
}

export type DataAccessOptions<T extends Entity> = {
    count?: number;
    select?: string;
    mapper?: (json: any) => T;
}

export interface DataAccessObject<T extends Entity> {

    getAll(opts?: DataAccessOptions<T>): Promise<T[]>;

    getById(id: Identifier, opts?: DataAccessOptions<T>): Promise<T | null>;

    batchInsert(entities: T[], opts?: DataAccessOptions<T>): Promise<T[]>;

    insert(entity: T, opts?: DataAccessOptions<T>): Promise<T>;

    update(id: Identifier, changes: Partial<T>, opts?: DataAccessOptions<T>): Promise<T>;

    delete(id: Identifier): Promise<void>;

    upsert(entity: T, opts?: DataAccessOptions<T>): Promise<T>;

    mapJson(json: any): T;

}
