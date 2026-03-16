/**
 * SupabaseDAO.ts
 *
 * @copyright 2025 Digital Aid Seattle
 *
 */

import { DataAccessObject, DataAccessOptions, Entity, Identifier } from "@digitalaidseattle/core";
import { PageInfo, QueryModel } from "@digitalaidseattle/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

abstract class SupabaseDAO<T extends Entity> implements DataAccessObject<T> {

    client: SupabaseClient;
    tableName = '';
    select = '*';
    mapper = (json: any) => (json as T);

    constructor(supabaseClient: SupabaseClient, tableName: string, opts?: DataAccessOptions<T>) {
        this.client = supabaseClient;
        this.tableName = tableName;
        this.select = opts ? opts.select ?? "*" : "*";
        this.mapper = opts ? opts.mapper ?? ((json: any) => json) : ((json: any) => json);
    }

    // MUI datagrid filters
    supportedStringFilters(): string[] {
        return ['contains', 'startsWith', 'endsWith', 'equals', 'doesNotEqual']
    }

    supportedNumberFilters(): string[] {
        return ['=', '>', '<', '!=']
    }

    getSelect(opts: DataAccessOptions<T>): string {
        return opts ? opts.select ?? this.select : this.select;
    }

    getMapper(opts: DataAccessOptions<T>): (json: any) => T {
        return opts ? opts.mapper ?? this.mapper : this.mapper;
    }

    async find(queryModel: QueryModel, opts?: DataAccessOptions<T>): Promise<PageInfo<T>> {
        try {
            const select = this.getSelect(opts!);
            const mapper = this.getMapper(opts!);

            let query: any = this.client
                .from(this.tableName)
                .select(select, { count: 'exact' })
                .range(queryModel.page * queryModel.pageSize, (queryModel.page + 1) * queryModel.pageSize - 1)

            // add sorting
            let sortField = queryModel.sortField
            const sortOperator = { ascending: queryModel.sortDirection === 'asc' } as any
            if (sortField.includes('.')) {
                const split = sortField.split('.');
                sortField = `${split[0]}(${split[1]})`;
            }
            query.order(sortField, sortOperator);

            // add filtering
            const filterModel = queryModel.filterModel;
            if (filterModel && filterModel.items) {
                filterModel.items.forEach((filter: any) => {
                    const field = filter.field;
                    const operator = filter.operator;
                    const value = filter.value;
                    if (field && operator && value) {
                        switch (operator) {
                            case '=':
                            case 'equals':
                                query = query.eq(field, value)
                                break;
                            case '!=':
                            case 'doesNotEqual':
                                query = query.neq(field, value)
                                break;
                            case '>':
                                query = query.gt(field, value)
                                break;
                            case '<':
                                query = query.lt(field, value)
                                break;
                            case 'contains':
                                query = query.ilike(field, `%${value}%`)
                                break;
                            case 'startsWith':
                                query = query.ilike(field, `${value}%`)
                                break;
                            case 'endsWith':
                                query = query.ilike(field, `%${value}`)
                                break;
                        }
                    }
                })
            }

            return query.then((resp: any) => {
                return {
                    rows: resp.data.map((json: any) => mapper(json)),
                    totalRowCount: resp.count,
                };
            })
        } catch (err) {
            console.error('Unexpected error:', err);
            throw err;
        }
    }

    async getAll(opts?: DataAccessOptions<T>): Promise<T[]> {
        const select = this.getSelect(opts!);
        const mapper = this.getMapper(opts!);
        const count = opts ? opts.count : undefined;

        let query = this.client
            .from(this.tableName)
            .select(select ?? this.select);
        if (count) {
            query = query.limit(count)
        }
        return query.then((resp: any) =>
            (resp.data ?? []).map((json: any) => mapper(json))
        )
    }

    async getById(entityId: Identifier, opts?: DataAccessOptions<T>): Promise<T> {
        try {
            const select = this.getSelect(opts!);
            const mapper = this.getMapper(opts!);

            const { data, error } = await this.client.from(this.tableName)
                .select(select)
                .eq('id', entityId)
                .single();
            if (error) {
                console.error('Unexpected error during select', error);
                throw new Error('Unexpected error during select');
            }
            return mapper(data);
        } catch (err) {
            console.error('Unexpected error during select:', err);
            throw err;
        }
    }

    async batchInsert(entities: T[], opts?: DataAccessOptions<T>): Promise<T[]> {
        try {
            const select = this.getSelect(opts!);
            const mapper = this.getMapper(opts!);

            return await this.client
                .from(this.tableName)
                .insert(entities)
                .select(select ?? this.select)
                .then((resp: any) => (resp.data ?? []).map((json: any) => mapper(json)))
        } catch (err) {
            console.error('Unexpected error during insertion:', err);
            throw err;
        }
    }

    async insert(entity: T, opts?: DataAccessOptions<T>): Promise<T> {
        try {
            const select = this.getSelect(opts!);
            const mapper = this.getMapper(opts!);

            return await this.client
                .from(this.tableName)
                .insert([entity])
                .select(select)
                .single()
                .then((resp: any) => mapper(resp.data))
        } catch (err) {
            console.error('Unexpected error during insertion:', err);
            throw err;
        }
    }

    async update(entityId: Identifier, updatedFields: Partial<T>, opts?: DataAccessOptions<T>): Promise<T> {
        try {
            const select = this.getSelect(opts!);
            const mapper = this.getMapper(opts!);

            const { data, error } = await this.client
                .from(this.tableName)
                .update(updatedFields)
                .eq('id', entityId)
                .select(select)
                .single();
            if (error) {
                console.error('Failed to update entity', error);
                throw new Error('Failed to update entity');
            }
            return mapper(data);
        } catch (err) {
            console.error('Unexpected error during update:', err);
            throw err;
        }
    }

    async delete(entityId: Identifier): Promise<void> {
        try {
            const { error } = await this.client
                .from(this.tableName)
                .delete()
                .eq('id', entityId);
            if (error) {
                console.error('Error deleting entity:', error.message);
                throw new Error('Failed to delete entity');
            }
        } catch (err) {
            console.error('Unexpected error during deletion:', err);
            throw err;
        }
    }

    async upsert(entity: T, opts?: DataAccessOptions<T>): Promise<T> {
        try {
            const select = this.getSelect(opts!);
            const mapper = this.getMapper(opts!);

            const { data, error } = await this.client
                .from(this.tableName)
                .upsert([entity])
                .select(select)
                .single();
            if (error) {
                console.error('Failed to upsert entity', error);
                throw new Error('Failed to upsert entity');
            }
            return mapper(data);
        } catch (err) {
            console.error('Error inserting entity:', err);
            throw err;
        }
    }

    mapJson(json: any): T {
        return this.mapper(json);
    }

}
export { SupabaseDAO };

