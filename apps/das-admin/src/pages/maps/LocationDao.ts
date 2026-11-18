/**
 *  mappingService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { v4 as uuid } from 'uuid';

import { Location } from '@digitalaidseattle/cartography';
import { DataAccessObject, DataAccessOptions, Identifier, PageInfo, QueryModel } from '@digitalaidseattle/core';

import LOCATIONS from './mapping-locations.json';

export interface LocationDao extends DataAccessObject<Location> {
    getAll(): Promise<Location[]>;
    findByName(name: string): Promise<Location | null>;
}

class FileLocationDao implements LocationDao {

    private static instance: LocationDao;

    public static getInstance(): LocationDao {
        if (!FileLocationDao.instance) {
            this.instance = new FileLocationDao();
        }
        return FileLocationDao.instance;
    }

    getById(_id: Identifier, _opts?: DataAccessOptions<Location> | undefined): Promise<Location | null> {
        throw new Error('Method not implemented.');
    }
    batchInsert(_entities: Location[], _opts?: DataAccessOptions<Location> | undefined): Promise<Location[]> {
        throw new Error('Method not implemented.');
    }

    insert(entity: Location, _opts?: DataAccessOptions<Location> | undefined): Promise<Location> {
        console.log(`Found new location for ${entity.name}:`, entity);
        // todo: persist to file
        throw new Error('Method not implemented.');
    }

    update(_id: Identifier, _changes: Partial<Location>, _opts?: DataAccessOptions<Location> | undefined): Promise<Location> {
        throw new Error('Method not implemented.');
    }

    delete(_id: Identifier): Promise<void> {
        throw new Error('Method not implemented.');
    }
    upsert(_entity: Location, _opts?: DataAccessOptions<Location> | undefined): Promise<Location> {
        throw new Error('Method not implemented.');
    }
    find(_queryModel: QueryModel, _opts?: DataAccessOptions<Location> | undefined): Promise<PageInfo<Location>> {
        throw new Error('Method not implemented.');
    }
    mapJson(_json: any): Location {
        throw new Error('Method not implemented.');
    }

    async getAll(): Promise<Location[]> {
        return LOCATIONS.map(loc => ({
            ...loc,
            id: uuid() // file based, ID not meaningful, so we generate a random one for each request
        }))
    };

    async findByName(name: string): Promise<Location | null> {
        const all = await this.getAll()
        return all.find(loc => loc.name === name) || null;
    }

}

export { FileLocationDao };
export type { Location };

