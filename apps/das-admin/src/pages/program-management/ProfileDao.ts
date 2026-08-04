/**
 *  ProfileDao.tsx
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { Profile } from "@digitalaidseattle/program-management";
import { SuperhumanDao } from "@digitalaidseattle/superhuman";

export class ProfileDao extends SuperhumanDao<Profile> {
    private static instance: ProfileDao;

    public static getInstance(): ProfileDao {
        if (!this.instance) {
            this.instance = new ProfileDao(
                "24QYb2RP0g",
                "grid-4vzF6VuaPV",
                {
                    mapper: (json) => {
                        const values = json.values;
                        return {
                            id: json.id,
                            name: SuperhumanDao.removeBackTicks(values["Name"]),
                            email: SuperhumanDao.removeBackTicks(values["DAS email"]),
                            pic: values["Pic"] && values["Pic"].length > 0 ? values["Pic"][0].url : "",
                            status: SuperhumanDao.removeBackTicks(values["Status"])
                        } as Profile
                    }
                }
            );
        }
        return this.instance;
    }

}