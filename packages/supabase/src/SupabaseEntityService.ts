/**
 * entityService.ts
 *
 * @copyright 2025 Digital Aid Seattle
 *
 */

import { PageInfo, QueryModel, supabaseClient } from "@digitalaidseattle/supabase";
import { Entity, EntityService, Identifier, User } from "@digitalaidseattle/core";

abstract class SupabaseEntityService<T extends Entity> implements EntityService<T> {

    tableName = '';

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    // MUI datagrid filters
    supportedStringFilters(): string[] {
        return ['contains', 'startsWith', 'endsWith', 'equals', 'doesNotEqual']
    }

    supportedNumberFilters(): string[] {
        return ['=', '>', '<', '!=']
    }

    async find(queryModel: QueryModel, select?: string, mapper?: (json: any) => T): Promise<PageInfo<T>> {
        try {

            let query: any = supabaseClient
                .from(this.tableName)
                .select(select ?? '*', { count: 'exact' })
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
                    rows: mapper ? resp.data.map((json: any) => mapper(json)) : resp.data,
                    totalRowCount: resp.count,
                };
            })
        } catch (err) {
            console.error('Unexpected error:', err);
            throw err;
        }
    }

    async getAll(count?: number, select?: string): Promise<T[]> {
        let query = supabaseClient
            .from(this.tableName)
            .select(select ?? '*');
        if (count) {
            query = query.limit(count)
        }
        return query.then((resp: any) => resp.data ?? [])
    }

    async getById(entityId: Identifier, select?: string): Promise<T | null> {
        try {
            return supabaseClient.from(this.tableName)
                .select(select ?? '*')
                .eq('id', entityId)
                .single()
                .then((resp: any) => resp.data ?? undefined)
        } catch (err) {
            console.error('Unexpected error during select:', err);
            throw err;
        }
    }

    async batchInsert(entities: T[], select?: string, user?: User): Promise<T[]> {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .insert(entities)
                .select(select ?? '*')
            if (error) {
                console.error('Error inserting entity:', error.message);
                throw new Error('Failed to insert entity');
            }
            return data as unknown as T[];
        } catch (err) {
            console.error('Unexpected error during insertion:', err);
            throw err;
        }
    }

    async insert(entity: T, select?: string, user?: User): Promise<T> {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .insert([entity])
                .select(select ?? '*')
                .single();
            if (error) {
                console.error('Error inserting entity:', error.message);
                throw new Error('Failed to insert entity');
            }
            return data as unknown as T;
        } catch (err) {
            console.error('Unexpected error during insertion:', err);
            throw err;
        }
    }

    async update(entityId: Identifier, updatedFields: Partial<T>, select?: string, user?: User): Promise<T> {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .update(updatedFields)
                .eq('id', entityId)
                .select(select ?? '*')
                .single();
            if (error) {
                console.error('Error updating entity:', error.message);
                throw new Error('Failed to update entity');
            }
            return data as unknown as T;
        } catch (err) {
            console.error('Unexpected error during update:', err);
            throw err;
        }
    }

    async delete(entityId: Identifier): Promise<void> {
        try {
            const { error } = await supabaseClient
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

}

export { SupabaseEntityService };
export type { Entity };

