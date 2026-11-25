/**
 *  Configuration.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import { GroupService } from "./GroupServices";
import { ProfileService } from "./ProfileService";

export type ConfigurationProps = {
    profileService: ProfileService;
    groupService: GroupService;
}

export class Configuration {

    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Profile Management System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: ConfigurationProps) {
        Configuration.instance = new Configuration(props);
    }

    profileService: ProfileService;
    groupService: GroupService;

    private constructor(props: ConfigurationProps) {
        this.profileService = props.profileService;
        this.groupService = props.groupService;
    }

    getProfileService(): ProfileService {
        return this.profileService;
    }

    getGroupService(): GroupService {
        return this.groupService;
    }

}
