
/**
 *  Configuration.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

// Avoid importing from the monorepo package to prevent TypeScript "rootDir" errors.
// Provide a lightweight local declaration for the DataAccessObject used here.
type DataAccessObject<T> = any;
import { NodeService, ProfileService, ProgramService } from "./services";
import { Profile, Program } from "./types";

export type ConfigurationProps = {
    programService: ProgramService;
    nodeService: NodeService;
    profileService: ProfileService;
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

    programService: ProgramService;
    nodeService: NodeService;
    profileService: ProfileService;

    private constructor(props: ConfigurationProps) {
        this.programService = props.programService;
        this.nodeService = props.nodeService;
        this.profileService = props.profileService;
    }

    getProfileService(): ProfileService {
        return this.profileService;
    }

    getProgramService(): ProgramService {
        return this.programService;
    }

    getNodeService(): NodeService {
        return this.nodeService;
    }

}