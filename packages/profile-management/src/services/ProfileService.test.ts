/**
 *  ProfileService.test.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Address, AddressDao, MembershipsDao, Profile, ProfileDao } from '../api/types';
import { ProfileService } from './ProfileService';

describe('ProfileService tests', () => {

    let profileDao: ProfileDao;
    let addressDao: AddressDao;
    let membershipDao: MembershipsDao;
    let service: ProfileService;

    beforeEach(() => {
        profileDao = {
            getAll: vi.fn(),
            getById: vi.fn(),
            insert: vi.fn(),
            upsert: vi.fn(),
            delete: vi.fn()
        } as unknown as ProfileDao;
        addressDao = {
            insert: vi.fn(),
            delete: vi.fn()
        } as unknown as AddressDao;
        membershipDao = {
            findGroupsByProfileId: vi.fn()
        } as unknown as MembershipsDao;
        service = new ProfileService(profileDao, addressDao, membershipDao);
    });

    it('empty', () => {
        const profile = service.empty();
        expect(profile.id).toBeTruthy();
        expect(profile.last_name).toBe('');
        expect(profile.pic_url).toBeNull();
        expect(profile.status).toBe('active');
        expect(service.empty().id).not.toBe(profile.id);
    });

    it('getAllActive', async () => {
        const active = { id: 'p1', status: 'active' } as Profile;
        const inactive = { id: 'p2', status: 'inactive' } as Profile;
        vi.mocked(profileDao.getAll).mockResolvedValue([active, inactive]);

        expect(await service.getAllActive()).toEqual([active]);
    });

    it('create inserts an empty profile by default', async () => {
        vi.mocked(profileDao.insert).mockImplementation(async (p) => p);

        const created = await service.create();

        expect(profileDao.insert).toHaveBeenCalledOnce();
        expect(created.status).toBe('active');
    });

    it('create inserts the given profile', async () => {
        const profile = { ...service.empty(), name: 'Ada' };
        vi.mocked(profileDao.insert).mockResolvedValue(profile);

        expect(await service.create(profile)).toBe(profile);
        expect(profileDao.insert).toHaveBeenCalledWith(profile);
    });

    it('getById returns null when not found', async () => {
        vi.mocked(profileDao.getById).mockResolvedValue(null);

        expect(await service.getById('missing')).toBeNull();
    });

    it('addAddress links the address to the profile', async () => {
        const profile = { id: 'p1' } as Profile;
        const address = { id: 'a1', city: 'Seattle' } as Address;
        vi.mocked(profileDao.getById).mockResolvedValue(profile);

        expect(await service.addAddress(profile, address)).toBe(profile);
        expect(addressDao.insert).toHaveBeenCalledWith({ id: 'a1', city: 'Seattle', profile_id: 'p1' });
    });

    it('removeAddress deletes the address', async () => {
        const profile = { id: 'p1' } as Profile;
        vi.mocked(profileDao.getById).mockResolvedValue(profile);

        await service.removeAddress(profile, { id: 'a1' } as Address);

        expect(addressDao.delete).toHaveBeenCalledWith('a1');
    });

    it('getGroups', async () => {
        vi.mocked(membershipDao.findGroupsByProfileId).mockResolvedValue([]);

        await service.getGroups({ id: 'p1' } as Profile);

        expect(membershipDao.findGroupsByProfileId).toHaveBeenCalledWith('p1');
    });
});
