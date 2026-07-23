/**
 *  mappingService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Location, LocationService } from './LocationService';
import { Volunteer, VolunteerDao } from './VolunteerDao';


class TeamMemberService {
    private static instance: TeamMemberService;

    public static getInstance(): TeamMemberService {
        if (!TeamMemberService.instance) {
            this.instance = new TeamMemberService();
        }
        return TeamMemberService.instance;
    }

    dao: VolunteerDao;
    locationService: LocationService;

    public constructor() {
        this.dao = VolunteerDao.getInstance();
        this.locationService = LocationService.getInstance();
    }

    async getAll(): Promise<Volunteer[]> {
        return this.dao.getAll();
    }

    // Given a location, find all people with the same lat-long  (that's why we need all locations)
    async getPeopleAt(people: Volunteer[], location: Location): Promise<Volunteer[]> {
        const filtered: Volunteer[] = [];
        for (const person of people) {
            const match = await this.locationService.findByName(person.location.trim());
            if (
                match &&
                match.latitude === location.latitude &&
                match.longitude === location.longitude
            ) {
                filtered.push(person);
            }
        }
        return filtered;
    }

    getLocation(volunteer: Volunteer): Promise<Location | null> {
        return this.locationService.findByName(volunteer.location);
    }
}

export { TeamMemberService };
