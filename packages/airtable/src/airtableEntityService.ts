
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
        let allRecords: T[] = [];
        const table = this.base(this.tableId);
        await table
            .select({
                pageSize: 100,
                filterByFormula: select ?? '',
            })
            .eachPage((records, fetchNextPage) => {
                const transformed = records.map(this.transform) as T[]
                allRecords.push(...transformed);
                if (count) {
                    if (allRecords.length < count) {
                        fetchNextPage(); // fetch next batch
                    } else {
                        allRecords = allRecords.slice(0, 100);
                    }
                } else {
                    fetchNextPage(); // fetch next batch
                }
            });

        console.log(`Retrieved ${allRecords.length} records.`);
        return allRecords;
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
