import { Entity, Identifier } from "@digitalaidseattle/core";


export type Funder = Entity & {
    name: string;
    type: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    contact: string;
}

export type GrantProgram = Entity & {
    funder_id: Identifier | null;
    name: string;
    focus_areas: string[];
    population_focus: string;
    mission_alignment: string;
    grant_range: string;
    operational_support: string;
    application_cycle: string;
    typical_deadline: string;
    current_deadline: string;
    geographic_scope: string;
    website: string;
}

export type ProgramAssessment = Entity & {
    grant_program_id: string;
    priority_score: number;
    notes: string[];
    email: string; // consider profile_id as well
}

export type GrantApplication = Entity & {
    grant_program_id: string;
    priority_score: number;
    status: string;
    notes: string;
    email: string;  // consider profile_id as well
}

export type ApplicationHistory = Entity & {
    application_id: string;
    status: string;
    notes: string;
}