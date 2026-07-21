/**
 * entityService.ts
 *
 * @copyright 2025 Digital Aid Seattle
 *
 */

import { Entity, EntityService, Identifier, User } from "@digitalaidseattle/core";
import { SupabaseDAO } from "./SupabaseDAO";

// @deprecated use SupabaseDAO
abstract class SupabaseEntityService<T extends Entity> implements EntityService<T> {

    dao: SupabaseDAO<T>;
    constructor(dao: SupabaseDAO<T>) {
        this.dao = dao;
    }

    getAll(count?: number, select?: string, mapper?: ((json: any) => T) | undefined): Promise<T[]> {
        return this.dao.getAll({ count, select, mapper });
    }

    getById(id: Identifier, select?: string, mapper?: ((json: any) => T) | undefined): Promise<T | null> {
        return this.dao.getById(id, { select, mapper });
    }

    batchInsert(entities: T[], select?: string, mapper?: ((json: any) => T) | undefined, user?: User): Promise<T[]> {
        return this.dao.batchInsert(entities, { select, mapper });
    }

    insert(entity: T, select?: string, mapper?: ((json: any) => T) | undefined, user?: User): Promise<T> {
        return this.dao.insert(entity, { select, mapper });
    }

    update(id: Identifier, changes: Partial<T>, select?: string, mapper?: ((json: any) => T) | undefined, user?: User): Promise<T> {
        return this.dao.update(id, changes, { select, mapper });
    }

    delete(id: Identifier): Promise<void> {
        return this.dao.delete(id);
    }
    upsert(entity: T, select?: string, mapper?: ((json: any) => T) | undefined, user?: User): Promise<T> {
        return this.dao.upsert(entity, { select, mapper });
    }

    mapJson(json: any): T {
        return this.dao.mapJson(json);
    }


}
export { SupabaseEntityService };

