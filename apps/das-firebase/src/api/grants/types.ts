/**
 * grants/types.ts
*
*/

import { Entity } from "@digitalaidseattle/core";


export type Timestamp = {
    seconds: number;
    nanoseconds: number;
}

export type GrantInput = {
    key: string;
    value: string;
}

export type GrantOutput = {
    name: string;
    maxSymbols: number;
    unit: 'words' | 'characters';
}

export type GrantRecipe = Entity & {
    createdAt: Timestamp | Date;
    createdBy: string;
    updatedAt: Timestamp | Date;
    updatedBy: string;
    description: string;
    template: string;  // Instructions for AI
    inputParameters: GrantInput[]; // AI will be asked to include this information
    outputParameters: GrantOutput[]; // AI will be based to output the data with these constraints
    prompt: string;  // Store what will be sent to AI
    tokenCount: number;
    modelType: string;  // "gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.5-flash-lite";
    enableContext: boolean;
    context: string;
}

export type GrantProposal = Entity & {
    createdAt: Timestamp | Date;
    createdBy: string;
    grantRecipeId: string;
    rating: number | null;  // Allow User to rate the response
    textResponse?: string;  // Store AI respons3
    structuredResponse?: {
        [key: string]: string; // Store AI structured response
    }
}
