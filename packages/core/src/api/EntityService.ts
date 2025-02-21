/**
 *  EntityService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { User } from "./AuthService";

export type Identifier = string | number;

export interface Entity {
    id: Identifier | undefined;
}

export interface EntityService<T extends Entity> {

    getAll(count?: number, select?: string): Promise<T[]>;

    getById(id: Identifier, select?: string): Promise<T | null>;

    batchInsert(entities: T[], select?: string, user?: User): Promise<T[]>;

    insert(entity: T, select?: string, user?: User): Promise<T>;

    update(id: Identifier, changes: Partial<T>, select?: string, user?: User): Promise<T>;

    delete(id: Identifier, user?: User): Promise<void>;

}
