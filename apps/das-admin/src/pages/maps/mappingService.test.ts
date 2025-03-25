/**
 *  mappingService.test.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it } from 'vitest';
import { mappingService } from './mappingService';

describe('mappingService tests', () => {

    it('getLocations', async () => {
        const locs = await mappingService.getLocations();
        expect(locs.length).toBeGreaterThan(0);
    });

    it('getPeople', async () => {
        expect(true).toEqual(true);
    });

    it('unique', async () => {
        const orig = [
            { name: "Bellevue, WA United States", "latitude": 47.6101, "longitude": -122.2015 },
            { name: "Bellevue, WA", "latitude": 47.6101, "longitude": -122.2015 },
            { name: "Bellingham, WA, USA", "latitude": 48.7519, "longitude": -122.4787 },
        ];
        const actual = mappingService.unique(orig);
        expect(actual.length).toEqual(2);
    });

})
