/**
 *  VolunteerDao.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { SuperhumanDao } from "@digitalaidseattle/superhuman";

export type Volunteer = {
    id: string,
    name: string,
    role: string,
    url: string,
    location: string,
    status: string
}

export class VolunteerDao extends SuperhumanDao<Volunteer> {

    private static instance: VolunteerDao;

    public static getInstance(): VolunteerDao {
        if (!VolunteerDao.instance) {
            this.instance = new VolunteerDao(
                "24QYb2RP0g",
                "grid-4vzF6VuaPV",
                {
                    mapper: (json) => {
                        const values = json.values;
                        const role = values["Role"] ? values["Role"].name : "";
                        const picUrl = (values["Pic"] && values["Pic"].length > 0) ? values["Pic"][0].url : "";
                        return {
                            id: json.id,
                            name: SuperhumanDao.removeBackTicks(values["Name"]),
                            role: role,
                            url: picUrl,
                            location: SuperhumanDao.removeBackTicks(values["Location"]),
                            status: SuperhumanDao.removeBackTicks(values["Status"])
                        } as Volunteer
                    }
                }
            );
        }
        return VolunteerDao.instance;
    }

}