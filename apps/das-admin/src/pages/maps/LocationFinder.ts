/**
 *  LocationFinder.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Location } from '@digitalaidseattle/cartography';
import { FirebaseAiService, Project } from './FirebaseAiService';

class LocationFinder {

    private static instance: LocationFinder;

    public static getInstance(): LocationFinder {
        if (!LocationFinder.instance) {
            this.instance = new LocationFinder();
        }
        return LocationFinder.instance;
    }

    async find(name: string): Promise<Location | null> {
        console.log(`Finding location for ${name}...`)
        const project: Project = {
            modelType: 'gemini-flash-latest',
            prompt: `Find the latitude and longitude for this location: "${name}".`,
            contexts: [],
        }
        const locationSchema = {
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                latitude: {
                    type: "number"
                },
                longitude: {
                    type: "number"
                }
            },
            required: ["name", "latitude", "longitude"]
        }
        try {
            return FirebaseAiService.getInstance()
                .parameterizedQuery(project, locationSchema)
                .then(async result => JSON.parse(await result.response.text()))
        } catch (err) {
            console.error('Error during AI query', err);
            throw err;
        }
    }

}

export { LocationFinder };

