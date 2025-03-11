/**
 *  mappingService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { airtableService } from '@digitalaidseattle/airtable';
import LOCATIONS from './mapping-locations.json';
type Location = {
    name: string;
    latitude: number;
    longitude: number;
}

type TeamMember = {
    _id: string,
    _createdAt: Date,
    name: string,
    role: string,
    url: string,
    location: string
}

class MappingService {

    async getLocations(): Promise<Location[]> {
        // TODO externalize in supabase.storage
        return LOCATIONS;
    }

    async getPeople(): Promise<TeamMember[]> {
        const TABLE = import.meta.env.VITE_AIRTABLE_TABLE_PEOPLE_REFERENCE;
        const MAX_RECORDS = 100;
        const FILTER = `{Manual Status} = "${'Cadre'}"`

        return airtableService.getTableRecords(TABLE, MAX_RECORDS, FILTER)
            .then(records => records.map(r => {
                const pics = r.fields.pic as any[];
                return {
                    name: `${r.fields['First name']} ${r.fields["Last name"]}`,
                    role: r.fields["Position"],
                    url: pics && pics[0] && pics[0].thumbnails.large.url || undefined,
                    location: r.fields["Location"]
                } as TeamMember
            }));
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

    // Given a location, find all people with the same lat-long  (that's why we need all locations)
    getPeopleAt(people: TeamMember[], locations: Location[], location: Location): TeamMember[] {
        return people.filter(p => {
            const match = locations.find(l => l.name === p.location);
            return match && match.latitude === location.latitude && match.longitude === location.longitude;
        })
    }
}

const mappingService = new MappingService();
export { mappingService };
export type { Location, TeamMember };
