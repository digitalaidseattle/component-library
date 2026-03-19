import { Group, GroupDao, MembershipsDao, Profile } from "../api/types";
import { getConfiguration } from "./Configuration";
import { v4 as uuid } from 'uuid';

export class GroupService {

    private static instance: GroupService;

    static getInstance() {
        if (!GroupService.instance) {
            GroupService.instance = new GroupService(
                getConfiguration().groupDao,
                getConfiguration().membershipDao);
        }
        return GroupService.instance;
    }

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
            pic_url: null
        }
    }

    async save(group: Group): Promise<Group> {
        // TODO save members & addresses
        return this.dao.upsert(group);
    }

    async delete(group: Group): Promise<void> {
        return this.dao.delete(group.id!);
    }

    async addProfiles(group: Group, profiles: Profile[], roles?: string[]): Promise<Group> {
        const currentMemberIds = group.members!.map(m => m.id);
        const memberships = profiles
            .filter(p => !currentMemberIds.includes(p.id))
            .map(p => (
                {
                    id: uuid(),
                    group_id: group.id!,
                    profile_id: p.id!,
                    roles: roles ?? []
                }
            ));
        this.membershipDao.batchInsert(memberships);
        return this.dao.getById(group.id!);
    }

    async removeProfiles(group: Group, profiles: Profile[]): Promise<Group> {
        profiles.forEach(async p => {
            const membership = await this.membershipDao.findByGroupAndProfile(group, p);
            await this.membershipDao.delete(membership.id!);
            // TODO implement a deleteByGroupAndProfile(group, p)
        })
        return this.dao.getById(group.id!);
    }
}