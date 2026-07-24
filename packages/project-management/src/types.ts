
/**
 * AdminPage.tsx
 * 
 */

import { Entity, Identifier } from "@digitalaidseattle/core";


// consider using ProfileManagement
export type Profile = Entity & {
    name: string;
    email: string;
}

export type Program = Entity & {
    name: string;
    description: string;
    node_types: string[];
    statuses: string[];
    nodes: Node[];
}

export type Comment = Entity & {
    content: string;
    author: string;
}

export type History = Entity & {
    description: string;
    date: string;
}

export type Node = Entity & {
    name: string;
    type: string;
    status: string;
    assignee_id: Identifier;

    children: Node[];
    comments: Comment[];
    history: History[];
}