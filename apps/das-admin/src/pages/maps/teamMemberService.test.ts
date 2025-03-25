/**
 *  mappingService.test.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it } from 'vitest';
import { TeamMember, teamMemberService } from './teamMemberService';

describe('mappingService tests', () => {

    it('getPeopleAt', async () => {
        const places = [
            { name: "Bellevue, WA United States", "latitude": 47.6101, "longitude": -122.2015 },
            { name: "Bellevue, WA", "latitude": 47.6101, "longitude": -122.2015 },
            { name: "Bellingham, WA, USA", "latitude": 48.7519, "longitude": -122.4787 },
        ];
        const peeps: TeamMember[] = [
            { location: "Bellevue, WA", name: 'alice' } as TeamMember,
            { location: "Bellevue, WA United States", name: 'bob' } as TeamMember,
            { location: "Bellingham, WA, USA", name: 'carol' } as TeamMember,
        ];

        const actual = teamMemberService.getPeopleAt(peeps, places, { name: '1', latitude: 47.6101, longitude: -122.2015 });
        expect(actual.length).toEqual(2);

        const actual2 = teamMemberService.getPeopleAt(peeps, places, { name: '2', latitude: 48.7519, longitude: -122.4787 });
        expect(actual2.length).toEqual(1);
    });

})
