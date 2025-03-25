
import { Entity, EntityService, Identifier, User } from "@digitalaidseattle/core";

import Airtable, { FieldSet, Record } from 'airtable';

const MAX_RECORDS = 100;

abstract class AirtableEntityService<T extends Entity> implements EntityService<T> {

    tableId: string;
    base: Airtable.Base;

    constructor(airtableClient: Airtable, tableId: string) {
        this.tableId = tableId;
        this.base = airtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS);
    }

    abstract transform(record: Record<FieldSet>): T;
    abstract transformEntity(entity: Partial<T>): Partial<FieldSet>;

    async getAll(count?: number, select?: string): Promise<T[]> {
        const tableId = (this as any).tableId; // Assuming `tableId` is defined in the subclass
        if (!tableId) {
            throw new Error('Table ID is not defined.');
        }
        const table = this.base(this.tableId);

        const records = await table
            .select({
                maxRecords: count || 100, // default max records is 100, more than that and we will need to start using pagination
                filterByFormula: select ?? '',
            })
            .all()
        return records.map(this.transform) as T[];
    }

    async getById(recordId: Identifier): Promise<T> {
        return this.base(this.tableId)
            .find(recordId.toString())
            .then(rec => {
                if (rec) {
                    return this.transform(rec)
                } else {
                    throw new Error(`Record ${recordId} not found.`)
                }
            });
    }

    async batchInsert(entities: T[], select?: string, user?: User): Promise<T[]> {
        return this.base(this.tableId)
            .update(entities.map(entity => {
                return { id: entity.id!.toString(), fields: this.transformEntity(entity) }
            }))
            .then(records => records.map(record => this.transform(record)));
    }

    async insert(entity: T, select?: string, user?: User): Promise<T> {
        return this.base(this.tableId)
            .create(this.transformEntity(entity))
            .then(rec => this.transform(rec));
    }

    async update(id: Identifier, changes: Partial<T>, select?: string, user?: User): Promise<T> {
        return this.base(this.tableId)
            .update(id.toString(), this.transformEntity(changes))
            .then(rec => this.transform(rec))
    }

    async delete(id: Identifier, user?: User): Promise<void> {
        throw new Error('Method not implemented.');
    }

}


export { AirtableEntityService };
