/**
 * types.ts
 *
 * @copyright 2025 Digital Aid Seattle
*/
import { DataAccessObject, DataAccessOptions, Entity, Identifier } from "@digitalaidseattle/core";

export type Status = 'active' | 'inactive';

export type Profile = Entity & {
    name: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    location: string,
    pic_url: string | null,
    status: Status,
    auth_id?: string | null,

    addresses?: Address[];
}

export type Group = Entity & {
    name: string;
    type: string;
    description: string;
    pic_url: string | null,
    status: Status,

    members?: Profile[];
    addresses?: Address[];
}

export type Membership = Entity & {
    profile_id: Identifier;
    group_id: Identifier;
    roles: string[];
}

export type Address = Entity & {
    type: string;
    profile_id: Identifier;
    group_id: Identifier;

    street_1: string;
    street_2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

export interface ProfileDao extends DataAccessObject<Profile> { };

export interface GroupDao extends DataAccessObject<Group> { };

export interface MembershipsDao extends DataAccessObject<Membership> {
    findByGroupId(groupId: Identifier, opts?: DataAccessOptions<Membership>): Promise<Membership[]>;
    findGroupsByProfileId(profileId: Identifier, opts?: DataAccessOptions<Membership>): Promise<Group[]>;
    findByGroupAndProfile(group: Group, profile: Profile, opts?: DataAccessOptions<Membership>): Promise<Membership | null>;
};

export interface AddressDao extends DataAccessObject<Address> { };
