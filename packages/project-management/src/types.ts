
/**
 * AdminPage.tsx
 * 
 */

import { Entity, Identifier } from "@digitalaidseattle/core";


// consider using ProfileManagement
export type Profile = Entity & {
    name: string;
    email: string;
    status: string;
    pic: string;
}

export type Program = Entity & {
    status: string;  // 'active' | 'inactive'
    name: string;
    description: string;
    prefix: string;  // FOR JIRA-like naming
    next_task_number: number; // FOR JIRA-like naming
    node_types: string[];
    node_statuses: string[];
    nodes: Node[];
    members: Profile[]
}

export type Comment = {
    user: string;
    content: string;
    date: string;
}

export type History = {
    user: string;
    description: string;
    date: string;
}

export type Node = Entity & {
    node_no: string;
    program_id: Identifier;
    parent_id: Identifier | undefined;

    name: string;
    type: string;
    status: string;
    description: string | undefined;
    assignee_id: Identifier | undefined;

    children: Node[];
    comments: Comment[];
    history: History[];
}