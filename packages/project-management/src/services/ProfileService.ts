import { DataAccessObject, Identifier } from "@digitalaidseattle/core";
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

    async getAllActive(): Promise<Profile[]> {
        return this.getAll()
            .then(profs => profs.filter(p => 'Active' === p.status))
    }

    // FIXME shoudld all DAO support findBy
    async findByEmail(email: string): Promise<Profile | null> {
        const profiles = await (this.dao as any).findBy("DAS email", email);
        return profiles && profiles.length > 0 ? profiles[0] : null;
    }

    async getById(assignee_id: Identifier | undefined): Promise<Profile | null> {
        if (assignee_id) {
            return this.dao.getById(assignee_id);
        } else {
            return null;
        }
    }
}