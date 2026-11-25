import { Identifier } from "@digitalaidseattle/core";
import { Address, AddressDao, Group, MembershipsDao, Profile, ProfileDao } from "../api/types";
import { v4 as uuid } from 'uuid';

export class ProfileService {

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
            last_name: '',
            email: '',
            phone: '',
            location: '',
            pic_url: null,
            status: 'active'
        }
    }

    async getAll(): Promise<Profile[]> {
        return this.dao.getAll();
    }

    async getAllActive(): Promise<Profile[]> {
        return this.getAll()
            .then(profiles => profiles.filter(p => p.status === 'active'));
    }

    async getById(id: Identifier): Promise<Profile | null> {
        return this.dao.getById(id);
    }

    async create(profile: Profile = this.empty()): Promise<Profile> {
        return this.dao.insert(profile);
    }

    async save(profile: Profile): Promise<Profile> {
        // TODO compare addresses
        return this.dao.upsert(profile);
    }

    async delete(id: Identifier): Promise<void> {
        return this.dao.delete(id);
    }

    async addAddress(profile: Profile, address: Address): Promise<Profile | null> {
        await this.addressDao.insert({ ...address, profile_id: profile.id! });
        return this.dao.getById(profile.id!);
    }

    async removeAddress(profile: Profile, address: Address): Promise<Profile | null> {
        await this.addressDao.delete(address.id!);
        return this.dao.getById(profile.id!);
    }

    async getGroups(profile: Profile): Promise<Group[]> {
        return this.membershipDao.findGroupsByProfileId(profile.id!);
    }
}
