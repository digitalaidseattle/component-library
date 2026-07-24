
/**
 *  Configuration.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

// Avoid importing from the monorepo package to prevent TypeScript "rootDir" errors.
// Provide a lightweight local declaration for the DataAccessObject used here.
type DataAccessObject<T> = any;
import { Profile } from "./types";

export class Configuration {

    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Program Management System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: { profileDao: DataAccessObject<Profile> }) {
        Configuration.instance = new Configuration(props);
    }

    profileDao: DataAccessObject<Profile>;

    private constructor(props: { profileDao: DataAccessObject<Profile> }) {
        this.profileDao = props.profileDao;
    }

    getProfileDao(): DataAccessObject<Profile> {
        return this.profileDao;
    }
}