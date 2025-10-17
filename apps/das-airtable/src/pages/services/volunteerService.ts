/**
 *  dasProjectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../api/airtableClient";

const VOLUNTEER_TABLE = 'tblqGbhGVH6v36xwA';

type Volunteer = {
    id: string,
    name: string,
    firstName: string,
    lastName: string,
    affliation: string,
    status: string,
    ventures: string,
    joinDate: string,
    ventureDate: string,
    ventureStatus: string,
    position: string,
    disciplines: string[],
    personalEmail: string,
    phone: string,
    pic: string,

    github: string,
    dasEmail: string,
    slackId: string,
    location: string,
    hopeToGive: string,
    hopeToGet: string,
    communicationPreferences: string,
    linkedin: string,

}

type VolunteerProps = {
    volunteer: Volunteer;
};

class VolunteerService extends AirtableEntityService<Volunteer> {

    filteredStatuses = ['Active', 'Under evaluation'];

    public constructor() {
        super(dasAirtableClient, VOLUNTEER_TABLE);
    }

    transform(r: Record<FieldSet>): Volunteer {
        return {
            id: r.id,
            name: r.fields['Name'],
            firstName: r.fields['First name'],
            lastName: r.fields['Last name'],
            affliation: r.fields['Affiliation (from Volunteer Affiliation)'],
            status: r.fields['Manual Status'],
            ventures: r.fields['Prospective Ventures (from Squad Match Role)'],
            joinDate: r.fields['join date'],
            ventureDate: r.fields['Affiliation Start Date (from Volunteer Affiliation)'],
            ventureStatus: r.fields['Venture Status'],

            position: r.fields['Position'],
            disciplines: r.fields['Disciplines'],
            personalEmail: r.fields['Personal email'],
            phone: r.fields['Phone'],
            pic: r.fields["pic"] ? (r.fields["pic"] as any[])[0].url : undefined,

            github: r.fields['Github'],
            dasEmail: r.fields['DAS email'],
            slackId: r.fields['Slack ID'],
            location: r.fields['Location'],
            hopeToGive: r.fields['In DAS I hope to give'],
            hopeToGet: r.fields['In DAS, I hope to get'],
            communicationPreferences: r.fields['Communication preferences'],
            linkedin: r.fields['Linkedin URL'],

        } as Volunteer
    }

    transformEntity(entity: Partial<Volunteer>): Partial<FieldSet> {
        return {
            'Name': entity.name,
            'First name': entity.firstName,
            'Last name': entity.lastName,
            'Affiliation (from Volunteer Affiliation)': entity.affliation,
            'Manual Status': entity.status,
            'Prospective Ventures (from Squad Match Role)': entity.ventures,
            'join date': entity.joinDate,
            'Affiliation Start Date (from Volunteer Affiliation)': entity.ventureDate,
            'Venture Status': entity.ventureStatus
        };
    }

}

const volunteerService = new VolunteerService()
export { volunteerService };
export type { Volunteer, VolunteerProps };

