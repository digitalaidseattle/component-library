/**
 *  mappingService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import LOCATIONS from './mapping-locations.json';

type Location = {
    name: string;
    latitude: number;
    longitude: number;
}


class MappingService {

    async getLocations(): Promise<Location[]> {
        // TODO externalize in supabase.storage
        return LOCATIONS;
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

}

const mappingService = new MappingService();
export { mappingService };
export type { Location };

