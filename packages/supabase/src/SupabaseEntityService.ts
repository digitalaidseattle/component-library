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
        return ['contains', 'startsWith', 'endsWith']
    }

    supportedNumberFilters(): string[] {
        return ['=', '>', '<']
    }

    async find(queryModel: QueryModel): Promise<PageInfo<T>> {
        try {
            const fModel = queryModel as any;
            let query: any = supabaseClient
                .from(this.tableName)
                .select('*', { count: 'exact' })
                .range(queryModel.page, queryModel.page + queryModel.pageSize - 1)
                .order(queryModel.sortField, { ascending: queryModel.sortDirection === 'asc' });
            if (fModel.filterField && fModel.filterOperator && fModel.filterValue) {
                switch (fModel.filterOperator) {
                    case '=':
                        query = query.eq(fModel.filterField, fModel.filterValue)
                        break;
                    case '>':
                        query = query.gt(fModel.filterField, fModel.filterValue)
                        break;
                    case '<':
                        query = query.lt(fModel.filterField, fModel.filterValue)
                        break;
                    case 'contains':
                        query = query.ilike(fModel.filterField, `%${fModel.filterValue}%`)
                        break;
                    case 'startsWith':
                        query = query.ilike(fModel.filterField, `${fModel.filterValue}%`)
                        break;
                    case 'endsWith':
                        query = query.ilike(fModel.filterField, `%${fModel.filterValue}`)
                        break;
                }
            }


            return query.then((resp: any) => {
                return {
                    rows: resp.data as T[],
                    totalRowCount: resp.count,
                } as PageInfo<T>;
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

