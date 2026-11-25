import { Identifier } from "@digitalaidseattle/core";
import { Group, GroupDao, Membership, MembershipsDao, Profile } from "../api/types";
import { v4 as uuid } from 'uuid';

export class GroupService {

    dao: GroupDao;
    membershipDao: MembershipsDao;

    constructor(groupDao: GroupDao, membershipDao: MembershipsDao) {
        this.dao = groupDao;
        this.membershipDao = membershipDao
    }

    empty(): Group {
        return {
            id: uuid(),
            name: '',
            description: '',
            type: 'none',
            pic_url: null,
            status: 'active'
        }
    }

    async getAll(): Promise<Group[]> {
        return this.dao.getAll();
    }

    async getById(id: Identifier): Promise<Group | null> {
        return this.dao.getById(id);
    }

    async save(group: Group): Promise<Group> {
        // TODO save members & addresses
        return this.dao.upsert(group);
    }

    async delete(group: Group): Promise<void> {
        return this.dao.delete(group.id!);
    }

    async getMemberships(group: Group): Promise<Membership[]> {
        return this.membershipDao.findByGroupId(group.id!);
    }

    async addProfiles(group: Group, profiles: Profile[], roles?: string[]): Promise<Group | null> {
        const current = await this.membershipDao.findByGroupId(group.id!);
        const currentMemberIds = current.map(m => m.profile_id);
        const memberships = profiles
            .filter(p => !currentMemberIds.includes(p.id!))
            .map(p => (
                {
                    id: uuid(),
                    group_id: group.id!,
                    profile_id: p.id!,
                    roles: roles ?? []
                }
            ));
        if (memberships.length > 0) {
            await this.membershipDao.batchInsert(memberships);
        }
        return this.dao.getById(group.id!);
    }

    async removeProfiles(group: Group, profiles: Profile[]): Promise<Group | null> {
        // TODO implement a deleteByGroupAndProfile(group, p)
        await Promise.all(profiles.map(async p => {
            const membership = await this.membershipDao.findByGroupAndProfile(group, p);
            if (membership) {
                await this.membershipDao.delete(membership.id!);
            }
        }));
        return this.dao.getById(group.id!);
    }
}
