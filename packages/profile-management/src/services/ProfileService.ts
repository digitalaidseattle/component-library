import { Identifier } from "@digitalaidseattle/core";
import { Address, AddressDao, Group, GroupDao, MembershipsDao, Profile, ProfileDao } from "../api/types";
import { getConfiguration } from "./Configuration";
import { v4 as uuid } from 'uuid';

export class ProfileService {

    private static instance: ProfileService;

    static getInstance() {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService(
                getConfiguration().profileDao,
                getConfiguration().addressDao,
                getConfiguration().membershipDao,
            );
        }
        return ProfileService.instance;
    }

    dao: ProfileDao;
    addressDao: AddressDao;
    membershipDao: MembershipsDao;

    constructor(profileDao: ProfileDao, addressDao: AddressDao, membershipDao: MembershipsDao) {
        this.dao = profileDao;
        this.addressDao = addressDao;
        this.membershipDao = membershipDao;
    }

    empty(): Profile {
        return {
            id: uuid(),
            name: '',
            first_name: '',
            last_name: 'none',
            email: '',
            phone: '',
            location: '',
            pic_url: ''
        }
    }

    async getAll(): Promise<Profile[]> {
        return this.dao.getAll();
    }

    create(): Promise<Profile> {
        throw new Error("Method not implemented.");
    }

    async save(profile: Profile): Promise<Profile> {
        // TODO compare addresses
        return this.dao.upsert(profile);
    }

    async delete(id: Identifier): Promise<void> {
        return this.dao.delete(id);
    }

    async addAddress(profile: Profile, address: Address): Promise<Profile> {
        return this.dao.getById(profile.id!);
    }

    async removeAddress(profile: Profile, address: Address): Promise<Profile> {
        await this.addressDao.delete(address.id!);
        return this.dao.getById(profile.id!);
    }

    async getGroups(profile: Profile): Promise<Group[]> {
        return this.membershipDao.findGroupsByProfileId(profile.id!);
    }
}