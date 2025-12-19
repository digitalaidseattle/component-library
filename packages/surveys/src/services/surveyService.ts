/**
 *  SurveyService.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Entity, Identifier } from "@digitalaidseattle/core";
import { v4 as uuid } from 'uuid';

export type Survey = Entity & {
    name: string;
    questions?: SurveyQuestion[];
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export type SurveyQuestion = Entity & {
    survey_id: Identifier;
    label: string;
    type: string;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

class SurveyService {
    static _instance: SurveyService;

    static instance(): SurveyService {
        if (!SurveyService._instance) {
            this._instance = new SurveyService();
        }
        return SurveyService._instance;
    }
    empty(): Survey {
        const now = new Date();
        const survey = {
            id: uuid(),
            name: "New Survey",
            created_at: now,
            created_by: '',
            updated_at: now,
            updated_by: '',
        }
        return survey;
    }

}


export { SurveyService };

