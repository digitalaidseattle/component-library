import { AddressDao, GroupDao, MembershipsDao, ProfileDao } from "../api/types";

export interface Configuration {
  profileDao: ProfileDao;
  groupDao: GroupDao;
  membershipDao: MembershipsDao;
  addressDao: AddressDao;
}

let configuration: Configuration;

export function setConfiguration(config: Configuration) {
  configuration = config;
}

export function getConfiguration() {
  if (!configuration) {
    throw new Error('System needs to be configured.');
  }
  return configuration;
}
