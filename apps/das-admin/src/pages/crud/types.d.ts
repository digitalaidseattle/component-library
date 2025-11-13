import { Identifier } from "@digitalaidseattle/core";

type Ticket = {
    id: Identifier,
    created_at: Date,
    inputSource: string,
    summary: string,
    description: string,
    status: string,
    assignee: string,
    due_date: Date,
    phone: string,
    email: string,
    clientName: string,
    ticket_history?: TicketHistory[]
};

type TicketHistory = {
    service_ticket_id: number
    created_at: Date,
    description: string,
    property: string,
    value: string,
    change_by: string
};

enum TicketStatus {
    Completed = 'completed',
    InProgress = 'inprogress',
    Blocked = 'blocked',
    New = 'new'
};

