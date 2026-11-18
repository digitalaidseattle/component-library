/**
 *  mappingService.test.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it } from 'vitest';
import { Location, LocationService } from './LocationService';

describe('LocationService tests', () => {

    it('unique', async () => {
        const orig: Location[] = [
            { name: "Bellevue, WA United States", "latitude": 47.6101, "longitude": -122.2015 },
            { name: "Bellevue, WA", "latitude": 47.6101, "longitude": -122.2015 },
            { name: "Bellingham, WA, USA", "latitude": 48.7519, "longitude": -122.4787 },
        ] as Location[];
        const actual = LocationService.getInstance().unique(orig);
        expect(actual.length).toEqual(2);
    });

})
