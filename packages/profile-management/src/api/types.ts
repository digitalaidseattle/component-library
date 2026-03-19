/**
 * types.ts
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import { DataAccessObject, DataAccessOptions, Entity, Identifier } from "@digitalaidseattle/core";

export type Profile = Entity & {
    name: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    location: string,
    pic_url: string | null,

    addresses?: Address[];
}

export type Group = Entity & {
    name: string;
    type: string;
    description: string;
    pic_url: string | null,

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
    findGroupsByProfileId(arg0: Identifier, opts?: DataAccessOptions<Membership>): Group[] | PromiseLike<Group[]>;
    findByGroupAndProfile(group: Group, profile: Profile, opts?: DataAccessOptions<Membership>): Promise<Membership>;
};

export interface AddressDao extends DataAccessObject<Membership> { };