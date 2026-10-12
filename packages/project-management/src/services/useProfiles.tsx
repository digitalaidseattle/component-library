/**
 * useProfiles.tsx
 * 
 * @2026 Digital Aid Seattle
 */

import { useCachedResource } from "@digitalaidseattle/core";
import { ProfileService } from "./ProfileService";
import { Profile } from "../types";

export function useProfiles() {
  const service = ProfileService.getInstance();
  return useCachedResource<Profile[]>({
    key: "profiles",
    fetcher: async () => { return await service.getAll() }
  });
}
