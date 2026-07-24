import { DataAccessObject } from "@digitalaidseattle/core";
import { Configuration } from "../Configuration";
import { Profile } from "../types";

export class ProfileService {
    private static instance: ProfileService;

    public static getInstance(): ProfileService {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService(Configuration.getInstance().getProfileDao());
        }
        return ProfileService.instance;
    }

    dao: DataAccessObject<Profile>;

    constructor(dao: DataAccessObject<Profile>) {
        this.dao = dao;
    }

    async getAll(): Promise<Profile[]> {
        return this.dao.getAll();
    }
}