/**
 * useProfiles.tsx
 * 
 * @2026 Digital Aid Seattle
 */

import { useCachedResource } from "@digitalaidseattle/core";
import { Configuration } from "../Configuration";
import { Profile } from "../types";

export function useProfiles() {
  const service = Configuration.getInstance().getProfileService();
  return useCachedResource<Profile[]>({
    key: "profiles",
    fetcher: async () => { return await service.getAll() }
  });
}
