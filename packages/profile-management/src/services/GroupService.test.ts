/**
 *  GroupService.test.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Group, GroupDao, Membership, MembershipsDao, Profile } from '../api/types';
import { GroupService } from './GroupServices';

describe('GroupService tests', () => {

    const group = { id: 'g1', name: 'Team A' } as Group;
    const ada = { id: 'p1', name: 'Ada' } as Profile;
    const bob = { id: 'p2', name: 'Bob' } as Profile;

    let groupDao: GroupDao;
    let membershipDao: MembershipsDao;
    let service: GroupService;

    beforeEach(() => {
        groupDao = {
            getAll: vi.fn(),
            getById: vi.fn().mockResolvedValue(group),
            upsert: vi.fn(),
            delete: vi.fn()
        } as unknown as GroupDao;
        membershipDao = {
            findByGroupId: vi.fn().mockResolvedValue([]),
            findByGroupAndProfile: vi.fn(),
            batchInsert: vi.fn(),
            delete: vi.fn()
        } as unknown as MembershipsDao;
        service = new GroupService(groupDao, membershipDao);
    });

    it('empty', () => {
        const empty = service.empty();
        expect(empty.id).toBeTruthy();
        expect(empty.status).toBe('active');
    });

    it('addProfiles inserts memberships with roles', async () => {
        await service.addProfiles(group, [ada, bob], ['leader']);

        const inserted = vi.mocked(membershipDao.batchInsert).mock.calls[0][0];
        expect(inserted.map(m => m.profile_id)).toEqual(['p1', 'p2']);
        expect(inserted.every(m => m.group_id === 'g1')).toBe(true);
        expect(inserted[0].roles).toEqual(['leader']);
    });

    it('addProfiles skips existing members', async () => {
        vi.mocked(membershipDao.findByGroupId)
            .mockResolvedValue([{ id: 'm1', group_id: 'g1', profile_id: 'p1', roles: [] }]);

        await service.addProfiles(group, [ada, bob]);

        const inserted = vi.mocked(membershipDao.batchInsert).mock.calls[0][0];
        expect(inserted.map(m => m.profile_id)).toEqual(['p2']);
        expect(inserted[0].roles).toEqual([]);
    });

    it('addProfiles does not insert when everyone is already a member', async () => {
        vi.mocked(membershipDao.findByGroupId)
            .mockResolvedValue([{ id: 'm1', group_id: 'g1', profile_id: 'p1', roles: [] }]);

        await service.addProfiles(group, [ada]);

        expect(membershipDao.batchInsert).not.toHaveBeenCalled();
    });

    it('addProfiles waits for the insert before reloading the group', async () => {
        const calls: string[] = [];
        vi.mocked(membershipDao.batchInsert).mockImplementation(async () => {
            await Promise.resolve();
            calls.push('insert');
            return [];
        });
        vi.mocked(groupDao.getById).mockImplementation(async () => {
            calls.push('reload');
            return group;
        });

        await service.addProfiles(group, [ada]);

        expect(calls).toEqual(['insert', 'reload']);
    });

    it('removeProfiles deletes each membership before reloading the group', async () => {
        const calls: string[] = [];
        vi.mocked(membershipDao.findByGroupAndProfile).mockImplementation(async (_g, p) =>
            ({ id: `m-${p.id}` } as Membership));
        vi.mocked(membershipDao.delete).mockImplementation(async (id) => {
            await Promise.resolve();
            calls.push(`delete ${id}`);
        });
        vi.mocked(groupDao.getById).mockImplementation(async () => {
            calls.push('reload');
            return group;
        });

        await service.removeProfiles(group, [ada, bob]);

        expect(calls).toEqual(['delete m-p1', 'delete m-p2', 'reload']);
    });

    it('removeProfiles ignores profiles that are not members', async () => {
        vi.mocked(membershipDao.findByGroupAndProfile).mockResolvedValue(null);

        await service.removeProfiles(group, [ada]);

        expect(membershipDao.delete).not.toHaveBeenCalled();
    });
});
