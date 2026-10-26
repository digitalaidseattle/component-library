
/**
 *  VolunteerDao.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { SuperhumanDao } from "@digitalaidseattle/superhuman";
import { Venture } from "../types";


const DOC_ID = "24QYb2RP0g";
const TABLE_ID = "grid-UdXLv7wwqh";


function json2Entity(json: any): Venture {
    const values = json.values;
    // console.log(json, values)
    return {
        id: json.id,
        title: json.name,
        coda_id: json.id,
        status: SuperhumanDao.removeBackTicks(values["Venture Status"]),
        venture_code: SuperhumanDao.removeBackTicks(values["Prospective Venture Code"]),
        icon: values["Org Icon - For DAS Website"]
            ? Array.isArray(values["Org Icon - For DAS Website"])
                ? values["Org Icon - For DAS Website"][0].url
                : values["Org Icon - For DAS Website"].url
            : undefined,
        program_areas: Array.isArray(values["Foci - For DAS Website"])
            ? values["Foci - For DAS Website"].map((elem: string) => SuperhumanDao.removeBackTicks(elem))
            : [],
        painpoint: SuperhumanDao.removeBackTicks(values["Painpoint"]),
        problem: SuperhumanDao.removeBackTicks(values["Problem - For DAS Website"]),
        solution: SuperhumanDao.removeBackTicks(values["Solution - For DAS Website"]),
        impact: SuperhumanDao.removeBackTicks(values["Impact - For DAS Website"]),
        partner_name: SuperhumanDao.removeBackTicks(values["Org Name"])
    } as Venture
}
export class VentureDao extends SuperhumanDao<Venture> {

    private static instance: VentureDao;

    public static getInstance(): VentureDao {
        if (!VentureDao.instance) {
            this.instance = new VentureDao(
                DOC_ID,
                TABLE_ID,
                {
                    mapper: json2Entity
                }
            );
        }
        return this.instance;
    }

    async getActive(): Promise<Venture[]> {
        return this.findBy('Venture Status', 'Active');
    }


}