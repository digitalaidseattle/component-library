/**
 *  VolunteerDao.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { CodaDao } from "../../coda/CodaDao"

export type Volunteer = {
    id: string,
    name: string,
    role: string,
    url: string,
    location: string,
    status: string
}

export class VolunteerDao extends CodaDao<Volunteer> {

    private static instance: VolunteerDao;

    public static getInstance(): VolunteerDao {
        if (!VolunteerDao.instance) {
            this.instance = new VolunteerDao(
                "24QYb2RP0g",
                "grid-4vzF6VuaPV",
                {
                    mapper: (json) => {
                        const values = json.values;
                        return {
                            id: json.id,
                            name: CodaDao.removeBackTicks(values["Name"]),
                            role: values["Role"] ? values["Role"].name : "",
                            url: values["Pic"] ? values["Pic"][0].url : "",
                            location: CodaDao.removeBackTicks(values["Location"]),
                            status: CodaDao.removeBackTicks(values["Status"])
                        } as Volunteer
                    }
                }
            );
        }
        return VolunteerDao.instance;
    }

}