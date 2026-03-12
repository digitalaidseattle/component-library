/**
 *  EntityService.ts
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

export interface EntityService<T extends Entity> {

    getAll(count?: number, select?: string, mapper?: (json: any) => T,): Promise<T[]>;

    getById(id: Identifier, select?: string, mapper?: (json: any) => T,): Promise<T | null>;

    batchInsert(entities: T[], select?: string, mapper?: (json: any) => T, user?: User): Promise<T[]>;

    insert(entity: T, select?: string, mapper?: (json: any) => T, user?: User): Promise<T>;

    update(id: Identifier, changes: Partial<T>, select?: string, mapper?: (json: any) => T, user?: User): Promise<T>;

    delete(id: Identifier, user?: User): Promise<void>;

    upsert(entity: T, select?: string, mapper?: (json: any) => T, user?: User): Promise<T>;

    mapJson(json: any): T;

}
