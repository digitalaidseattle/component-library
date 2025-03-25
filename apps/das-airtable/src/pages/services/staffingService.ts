/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { dasAirtableClient } from "../../api/airtableClient";

type OpenPosition = {
    id: string,
    status: string,
    ventureId: string,
    venture: string | undefined,
    ventureStatus: string | undefined,
    role: string,
    level: string,
    skill: string
}

const STAFFING_TABLE = 'tbllAEHFTFX5IZDZL';

class StaffingService extends AirtableEntityService<OpenPosition> {

    STATUSES = [
        "Proposed",
        "Filled",
        "Please fill",
        "Maybe filled",
        "Cancelled",
        "Declined by Contributor"
    ]

    IMPORTANCES = [
        "Imperative",
        "Nice to have"
    ]

    TIMINGS = [
        "At the start",
        "1/3 into the Venture",
        "2/3 into the Venture"
    ]

    EXPERIENCE_LEVELS = [
        "Junior",
        "Mid",
        "Senior"
    ]

    public constructor() {
        super(dasAirtableClient, STAFFING_TABLE);
    }

    transformEntity(entity: Partial<OpenPosition>): Partial<FieldSet> {
        throw new Error("Method not implemented.");
    }

    transform(record: Record<FieldSet>): OpenPosition {
        return {
            id: record.id,
            status: record.fields['Status'] as string,
            ventureId: record.fields['Prospective Ventures'] ? (record.fields['Prospective Ventures'] as string[])[0] : '',
            venture: record.fields['Venture Name'] as string | undefined,
            ventureStatus: record.fields['Venture Status'] as string | undefined,
            role: record.fields['Role in text for website'] ? (record.fields['Role in text for website'] as string)[0] : '',
            level: record.fields['Level requirement'] as string,
            skill: record.fields['Desired skills'] as string
        };
    }

    findOpen = async (statuses: string[]): Promise<OpenPosition[]> => {
        const filter = `OR(${statuses.map(s => `{Status} = "${s}"`).join(", ")})`;
        return super.getAll(undefined, filter)
    }

}

const staffingService = new StaffingService();
export { staffingService };
export type { OpenPosition };

