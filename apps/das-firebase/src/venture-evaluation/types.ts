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

export type DebriefDecision = {
    decision: string;
    alternative: string;
    rationale: string;
}

export type DebriefArtifact = {
    name: string;
    type: string;
    link: string;
}

// Mirrors resources/venture_eval_card.md
export type VentureDebrief = Entity & {
    // 1. Header
    venture_name: string;
    program_id: string | null;  // venture evaluation program, when one exists
    evaluation_date: string;    // yyyy-mm-dd
    evaluators: string[];
    sign_off: { uxr: boolean, pdm: boolean, sa: boolean };
    domain: string;
    capability_area: string;
    tech_stack: string[];
    solution_type: string;
    outcome: '' | 'Go' | 'No-go';
    // 2 - 4
    problem_statement: string;
    recommendation: string;
    rationale: string[];
    // 5 - 7
    decisions: DebriefDecision[];
    debrief_links: string[];
    artifacts: DebriefArtifact[];
    // 8. Past knowledge applied
    searched_repository: '' | 'Yes' | 'No';
    search_minutes: number | null;
    past_evaluation_existed: '' | 'Yes' | 'No' | "Don't know";
    past_evaluations_reviewed: string;
    applicable: '' | 'Yes' | 'No';
    applicability_notes: string;
    // 9. Tags
    tags: string[];
}
