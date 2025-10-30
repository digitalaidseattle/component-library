/**
 *  mappingService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from '@digitalaidseattle/airtable';
import Airtable, { Record, FieldSet } from 'airtable';
import { Location } from './mappingService';

const airtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_ANON_KEY })

type TeamMember = {
    id: string,
    name: string,
    role: string,
    url: string,
    location: string
}


class TeamMemberService extends AirtableEntityService<TeamMember> {

    public constructor() {
        super(airtableClient, import.meta.env.VITE_AIRTABLE_TABLE_PEOPLE_REFERENCE);
    }

    transform(record: Record<FieldSet>): TeamMember {
        const pics = record.fields.pic as any[];
        return {
            id: record.id,
            name: `${record.fields['First name']} ${record.fields['Last name']}`,
            role: record.fields['Position'] as string,
            url: pics && pics[0] && pics[0].thumbnails.large.url || undefined,
            location: record.fields['Location'] as string
        };
    }

    transformEntity(entity: Partial<TeamMember>): Partial<FieldSet> {
        const fields: Partial<FieldSet> = {};
        if (entity.name) {
            const [firstName, lastName] = entity.name.split(' ');
            fields['First name'] = firstName;
            fields['Last name'] = lastName;
        }
        if (entity.role) {
            fields['Position'] = entity.role;
        }
        // if (entity.url) {
        //     fields['pic'] = [{ thumbnails: { large: { url: entity.url } } }];
        // }
        if (entity.location) {
            fields['Location'] = entity.location;
        }
        return fields;
    }

    async getAll(count?: number, _select?: string): Promise<TeamMember[]> {
        const filter = `{Manual Status} = "${'Cadre'}"`
        return super.getAll(count, filter);
    }

    // Given a location, find all people with the same lat-long  (that's why we need all locations)
    getPeopleAt(people: TeamMember[], locations: Location[], location: Location): TeamMember[] {
        return people.filter(p => {
            const match = locations.find(l => l.name === p.location);
            return match && match.latitude === location.latitude && match.longitude === location.longitude;
        })
    }
}

const teamMemberService = new TeamMemberService();
export { teamMemberService };
export type { TeamMember };
