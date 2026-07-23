/**
 *  SuperhumanDao.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { DataAccessObject, DataAccessOptions, Entity, Identifier, PageInfo, QueryModel, User } from "@digitalaidseattle/core";
import { Configuration } from "./Configuration";

type SuperhumanRow = {
    id: string;
    name: string;
    values: Record<string, any>;
}

export abstract class SuperhumanDao<T extends Entity> implements DataAccessObject<T> {

    static removeBackTicks(value: string | string[]): string | string[] {
        if (Array.isArray(value)) {
            return value.map(v => v.replace(/```/g, ''));
        }
        if (typeof value !== 'string') {
            return ""
        }
        return value ? value.replace(/```/g, '') : '';
    }

    static normalizeToArray(value: string | string[]): string[] {
        const norm = (typeof value === 'string') ? [value] : value;
        return norm;
    }

    baseUrl: string;
    documentId: string;
    tableName: string;
    apiToken: string;
    opts: DataAccessOptions<T> | undefined;

    constructor(documentId: string, tableName: string, opts?: DataAccessOptions<T>) {
        this.baseUrl = Configuration.getInstance().baseUrl;
        this.documentId = documentId ?? Configuration.getInstance().apiBase;
        this.tableName = tableName;
        this.opts = opts;
        this.apiToken = Configuration.getInstance().apiToken;
    }

    upsert(_entity: T, _opts?: DataAccessOptions<T> | undefined): Promise<T> {
        throw new Error("Method not implemented.");
    }

    find(_queryModel: QueryModel, _opts?: DataAccessOptions<T> | undefined): Promise<PageInfo<T>> {
        throw new Error("Method not implemented.");
    }

    async getById(id: Identifier, _opts?: DataAccessOptions<T>): Promise<T | null> {
        const params = new URLSearchParams({
            useColumnNames: "true",
            valueFormat: "rich"
        });

        const res = await fetch(
            `${this.baseUrl}/${this.documentId}/tables/${this.tableName}/rows/${id}?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${this.apiToken}`,
                },
            }
        );
        const data = await res.json();
        return this.mapJson(data);
    }

    insert(_entity: T, _opts?: DataAccessOptions<T>): Promise<T> {
        throw new Error("Method not implemented.");
    }

    update(_id: Identifier, _partial: Partial<T>, _opts?: DataAccessOptions<T>): Promise<T> {
        throw new Error("Method not implemented.");
    }

    delete(_id: Identifier, _opts?: DataAccessOptions<T>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getAll(opts?: DataAccessOptions<T>): Promise<T[]> {
        const apiToken = Configuration.getInstance().apiToken;

        let rows: any[] = [];
        let pageToken: string | undefined = undefined;

        do {
            const params = new URLSearchParams({
                limit: "200",
                useColumnNames: "true",
                valueFormat: "rich"
            });

            if (pageToken) {
                params.set("pageToken", pageToken);
            }

            const res = await fetch(
                `${this.baseUrl}/${this.documentId}/tables/${this.tableName}/rows?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                }
            );

            const data = await res.json();
            rows.push(...data.items.map((json: any) => this.mapJson(json, opts)));
            pageToken = data.nextPageToken;
        } while (pageToken);
        return rows;
    }

    async batchInsert(entities: T[], _opts?: DataAccessOptions<T>): Promise<T[]> {

        const rows = entities.map(entity => this.mapEntity(entity));

        const resp = await fetch(`${this.baseUrl}/${this.documentId}/tables/${this.tableName}/rows`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rows })
        });

        // Coda API returns 202 Accepted for async processing
        if (resp.status !== 202 && !resp.ok) {
            const error = await resp.json()
                .catch(() => ({ message: resp.statusText }));
            throw new Error(`Failed to create rows: ${error.message || resp.statusText}`);
        }

        // Return the response (202 Accepted means the request was queued successfully)
        return resp.json()
            .then(data => {
                console.log(data)
                // TODO look up rows
                return data.addedRowIds.map((id: string) => ({ id: id }))
            })

    }

    async findBy(column: string, name: string): Promise<T[]> {
        const params = new URLSearchParams({
            limit: "200",
            useColumnNames: "true",
            valueFormat: "rich"
        });
        const url = `${this.baseUrl}/${this.documentId}/tables/${this.tableName}/rows?query=${column}:"${name}"&${params}`;
        const resp = await fetch(encodeURI(url), {
            headers: { 'Authorization': `Bearer ${this.apiToken}` }
        });

        if (!resp.ok) {
            const error = await resp.json().catch(() => ({ message: resp.statusText }));
            throw new Error(`Failed to fetch rows: ${error.message || resp.statusText}`);
        }

        const data = await resp.json();
        return data.items.map((json: any) => this.mapJson(json))
    }

    mapEntity(entity: T): any {
        throw new Error("Method not implemented.");
    }

    mapJson(json: any, opts?: DataAccessOptions<T>): T {
        if (opts && opts.mapper) {
            return opts.mapper(json);
        }
        if (this.opts && this.opts.mapper) {
            return this.opts.mapper(json);
        }
        return json as T;
    }



}

export type { SuperhumanRow }

