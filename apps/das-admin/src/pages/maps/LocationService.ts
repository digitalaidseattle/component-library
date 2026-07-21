/**
 *  LocationService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Location } from './components/types';
import { LocationDao } from './LocationDao';

class LocationService {

    private static instance: LocationService;

    public static getInstance(): LocationService {
        if (!LocationService.instance) {
            this.instance = new LocationService();
        }
        return LocationService.instance;
    }

    locationDao = LocationDao.getInstance();

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
        const found = this.locationDao.findByName(name);
        if (found) {
            return found;
        }   

        // const newLocation = await locationFinder.find(name);
        return null;
    }

}

export { LocationService };
export type { Location };

