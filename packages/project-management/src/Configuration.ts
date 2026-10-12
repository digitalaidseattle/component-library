
/**
 *  Configuration.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

// Avoid importing from the monorepo package to prevent TypeScript "rootDir" errors.
// Provide a lightweight local declaration for the DataAccessObject used here.
type DataAccessObject<T> = any;
import { Profile, Program } from "./types";

export type ConfigurationProps = {
    profileDao: DataAccessObject<Profile>;
    programDao: DataAccessObject<Program>;
    nodeDao: DataAccessObject<Node>;
}

export class Configuration {

    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Program Management System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: ConfigurationProps) {
        Configuration.instance = new Configuration(props);
    }

    profileDao: DataAccessObject<Profile>;
    programDao: DataAccessObject<Program>;
    nodeDao: DataAccessObject<Node>;

    private constructor(props: ConfigurationProps) {
        this.profileDao = props.profileDao;
        this.programDao = props.programDao;
        this.nodeDao = props.nodeDao;
    }

    getProfileDao(): DataAccessObject<Profile> {
        return this.profileDao;
    }
}