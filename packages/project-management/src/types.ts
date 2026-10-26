
/**
 * AdminPage.tsx
 * 
 */

import { Entity, Identifier } from "@digitalaidseattle/core";
import { DDType } from "@digitalaidseattle/draganddrop";
import React from "react";


// consider using ProfileManagement
export type Profile = Entity & {
    name: string;
    email: string;
    status: string;
    pic: string;
}

export type Program = Entity & {
    organization: string; // TODO change to id of organization  entity
    status: string;  // Configured 'active' | 'inactive'
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
    node_no: string;  // Human readable name
    program_id: Identifier;  // Program
    parent_id: Identifier | null;  // Parent Node

    name: string;
    type: string;
    status: string;
    priority: string;
    due_date: Date;
    description: string | null;
    assignee_id: Identifier | null;

    children: Node[];
    comments: Comment[];
    history: History[];
    tags: string[];
    order: number;  // order within parent
}
export type NodeWrapper = Node & DDType

export interface NodeKanbanProps {
    node: Node | undefined;
    onFocusChange: (node: Node) => void;
    opts?: {
        cardRenderer: (node: NodeWrapper, onFocusChange: (node: Node) => void) => React.ReactNode
    }
}
