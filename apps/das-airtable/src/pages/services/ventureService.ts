/**
 *  dasProjectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { Partner, partnerService } from "./partnerService";
import { dasAirtableClient } from "../../api/airtableClient";
import { Record, FieldSet } from "airtable";
import { Identifier } from "@digitalaidseattle/core";

const VENTURES_TABLE = 'tblRpJek5SjacLaen'; // VENTURE SEEDS/PAINPOINTS TABLE

type Venture = {
    id: string;
    title: string;
    painpoint: string;
    status: string;
    problem: string;
    solution: string;
    impact: string;
    programAreas: string;
    projectLink: string;
    ventureCode: string;
    evaluatingTaskGroup: string | undefined;
    partner: Partner | undefined;
    partnerId: string | undefined;
    organization: string | undefined;
};

type VentureProps = {
    venture: Venture;
};

class VentureService extends AirtableEntityService<Venture> {

    filteredStatuses = ['Active', 'Under evaluation'];

    public constructor() {
        super(dasAirtableClient, VENTURES_TABLE);
    }

    transform(record: Record<FieldSet>): Venture {
        return {
            id: record.id,
            title: record.fields['Title'] as string,
            painpoint: record.fields['Painpoint Shorthand'] as string,
            status: record.fields['Status'] as string,
            problem: record.fields['Problem (for DAS website)'] as string,
            solution: record.fields['Solution (for DAS website)'] as string,
            impact: record.fields['Impact (for DAS website)'] as string,
            programAreas: record.fields['Foci (from Partner)'] as string,
            projectLink: `project/${record.id}`,
            ventureCode: record.fields['Prospective Venture Code'] as string,
            evaluatingTaskGroup: record.fields['Evaluating Task Group'] ? (record.fields['Evaluating Task Group'] as string[])[0] : undefined,
            partnerId: record.fields['Partner'] ? (record.fields['Partner'] as string[])[0] : undefined,
            partner: undefined, // Partner will be populated later
            organization: record.fields['Org shorthand (from Partner)'] as string
        };
    }

    transformEntity(entity: Partial<Venture>): Partial<FieldSet> {
        const fields: Partial<FieldSet> = {};
        if (entity.title) fields['Title'] = entity.title;
        if (entity.painpoint) fields['Painpoint Shorthand'] = entity.painpoint;
        if (entity.status) fields['Status'] = entity.status;
        if (entity.problem) fields['Problem (for DAS website)'] = entity.problem;
        if (entity.solution) fields['Solution (for DAS website)'] = entity.solution;
        if (entity.impact) fields['Impact (for DAS website)'] = entity.impact;
        if (entity.programAreas) fields['Foci (from Partner)'] = entity.programAreas;
        if (entity.ventureCode) fields['Prospective Venture Code'] = entity.ventureCode;
        if (entity.evaluatingTaskGroup) fields['Evaluating Task Group'] = [entity.evaluatingTaskGroup];
        if (entity.partnerId) fields['Partner'] = [entity.partnerId];
        return fields;
    }

    async getById(recordId: string): Promise<Venture> {
        return super.getById(recordId)
            .then(venture =>
                partnerService
                    .getById(venture.partnerId)
                    .then(partner => Object.assign(venture, { partner: partner }))
            );
    }

    async getAllByStatus(filteredStatuses: string[]): Promise<Venture[]> {
        const FILTER = `OR(${filteredStatuses.map(s => `{Status} = "${s}"`).join(", ")})`;
        return this.getAll(undefined, FILTER)
    }

}

const ventureService = new VentureService()
export { ventureService };
export type { Venture, VentureProps };

