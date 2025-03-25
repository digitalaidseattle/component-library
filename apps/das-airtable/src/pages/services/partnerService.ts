/**
 *  dasPartnerService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../api/airtableClient";

const PARTNERS_TABLE = 'tblqttKinLZJ2JXo7';

type Partner = {
    id: string;
    name: string
    shorthandName: string
    status: string
    description: string
    gdriveLink: string
    hubspotLink: string
    miroLink: string
    overviewLink: string,
    logoUrl: string
}

class DASPartnerService extends AirtableEntityService<Partner> {
    public constructor() {
        super(dasAirtableClient, PARTNERS_TABLE);
    }

    transformEntity(entity: Partial<Partner>): Partial<FieldSet> {
        const fields: Partial<FieldSet> = {};
        if (entity.name) fields['Org name'] = entity.name;
        if (entity.shorthandName) fields['Org shorthand'] = entity.shorthandName;
        if (entity.status) fields['Status'] = entity.status;
        if (entity.description) fields['Org description'] = entity.description;
        if (entity.gdriveLink) fields['Gdrive link URL'] = entity.gdriveLink;
        if (entity.hubspotLink) fields['Hubspot interface"'] = entity.hubspotLink;
        if (entity.miroLink) fields['Miro Board Link'] = entity.miroLink;
        if (entity.overviewLink) fields['Overview link'] = entity.overviewLink;
        if (entity.logoUrl) (fields['logo'] as any[]) = [entity.logoUrl];

        console.log('transformEntity', fields);

        return fields;
    }

    transform(record: Record<FieldSet>): Partner {
        return {
            id: record.id,
            name: record.fields['Org name'],
            shorthandName: record.fields['Org shorthand'],
            status: record.fields['Status'],
            description: record.fields['Org description'],
            gdriveLink: record.fields['Gdrive link URL'],
            hubspotLink: record.fields["Hubspot interface"],
            miroLink: record.fields["Miro Board Link"],
            overviewLink: record.fields["Overview link"],
            logoUrl: record.fields["logo"] ? (record.fields["logo"] as any[])[0].url : undefined,
        } as Partner
    }

    async update(
        recordId: string,
        entity: Partial<Partner>
    ): Promise<Partner> {
        return this.base(this.tableId)
            .update(recordId, this.transformEntity(entity))
            .then(rec => this.transform(rec))
    }

}

const partnerService = new DASPartnerService()
export { partnerService };
export type { Partner };

