import { Entity } from "@digitalaidseattle/core";

export const TicketSource = {
    Email: { value: 'email', label: 'Email' },
    WalkIn: { value: 'walkin', label: 'Walk-In' },
    Phone: { value: 'phone', label: 'Phone' }
};

export type Ticket = Entity & {
    inputSource: string,
    summary: string,
    description: string,
    status: string,
    assignee: string,
    due_date: Date,
    phone: string,
    email: string,
    clientName: string,
    ticket_history: TicketHistory[]
};

export type TicketHistory = Entity & {
    service_ticket_id: number
    created_at: Date,
    description: string,
    property: string,
    value: string,
    change_by: string
};

export enum TicketStatus {
    Completed = 'completed',
    InProgress = 'inprogress',
    Blocked = 'blocked',
    New = 'new'
};

