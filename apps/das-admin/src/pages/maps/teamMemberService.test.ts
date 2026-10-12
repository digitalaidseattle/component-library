/**
 *  mappingService.test.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it } from 'vitest';
import { TeamMemberService } from './teamMemberService';
import { Volunteer } from './VolunteerDao';

describe('mappingService tests', () => {

    it('getPeopleAt', async () => {
        // const places = [
        //     { name: "Bellevue, WA United States", "latitude": 47.6101, "longitude": -122.2015 },
        //     { name: "Bellevue, WA", "latitude": 47.6101, "longitude": -122.2015 },
        //     { name: "Bellingham, WA, USA", "latitude": 48.7519, "longitude": -122.4787 },
        // ];
        const peeps: Volunteer[] = [
            { location: "Bellevue, WA", name: 'alice' } as Volunteer,
            { location: "Bellevue, WA United States", name: 'bob' } as Volunteer,
            { location: "Bellingham, WA, USA", name: 'carol' } as Volunteer,
        ];

        TeamMemberService.getInstance().getPeopleAt(peeps, { id: '', name: '1', latitude: 47.6101, longitude: -122.2015 })
            .then(actual => { expect(actual.length).toEqual(2) })

        TeamMemberService.getInstance().getPeopleAt(peeps, { id: '', name: '2', latitude: 48.7519, longitude: -122.4787 })
            .then(actual => { expect(actual.length).toEqual(1) })
    });

})
