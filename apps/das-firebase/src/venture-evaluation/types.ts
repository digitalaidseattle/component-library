import { Entity } from "@digitalaidseattle/core";

export enum VENTURE_STATUSES {
    SubmittedByPartner = "Submitted by Partner",
    ReadyForConsideration = "Ready for consideration",
    UnderEvaluation = "Under Evaluation",
    Active = "Active",
    Paused = "Paused",
    Declined = "Declined",
    Delivered = "Delivered"
};

export type Venture = Entity & {
    airtable_id: string
    coda_id?: string;
    partner_id: string | null;
    title: string;
    painpoint: string;
    status: VENTURE_STATUSES;
    problem: string;
    solution: string;
    impact: string;
    program_areas: string[];
    venture_code: string;
    partner_airtable_id: string[],
    icon: string;
    partner_name: string;
    // partner?: Partner;
}
