/**
 *  LocationService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Location } from '@digitalaidseattle/cartography';

import { LocationFinder } from './LocationFinder';
import { FileLocationDao, LocationDao } from './LocationDao';

class LocationService {

    private static instance: LocationService;

    public static getInstance(): LocationService {
        if (!LocationService.instance) {
            this.instance = new LocationService();
        }
        return LocationService.instance;
    }

    locationDao: LocationDao;
    locationFinder: LocationFinder;

    constructor() {
        this.locationDao = FileLocationDao.getInstance();
        this.locationFinder = LocationFinder.getInstance();
    }

    // Many names for the same lat-long (e.g.  "Seattle", "Seattle, WA", "Seattle, WA, USA")
    unique(locations: Location[]): Location[] {
        let unique = locations
            .reduce((arr: Location[], b: Location) => {
                if (!arr.find(test => test.longitude === b.longitude && test.latitude === b.latitude)) {
                    arr.push(b);
                }
                return arr;
            }, []);
        return unique;
    }

    async getAll(): Promise<Location[]> {
        return this.locationDao.getAll();
    }

    async findByName(name: string): Promise<Location | null> {
        const found = await this.locationDao.findByName(name);
        if (found) {
            return found;
        }
        return null;
        // try {
        //     const newLocation = await this.locationFinder.find(name);
        //     if (newLocation) {
        //         await this.locationDao.insert(newLocation);
        //         return newLocation;
        //     }
        //     return newLocation;
        // } catch (err) {
        //     console.error(`Error finding location for ${name}:`, err);
        //     return null;
        // }
    }

}

export { LocationService };
export type { Location };

