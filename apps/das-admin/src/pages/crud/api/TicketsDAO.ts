/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";
import { Ticket, TicketHistory } from "./types";

const TABLE_SERVICE_TICKET = 'service_ticket';

class TicketsDAO extends SupabaseDAO<Ticket> {
    private static instance: TicketsDAO;

    static getInstance() {
        if (!TicketsDAO.instance) {
            TicketsDAO.instance = new TicketsDAO();
        }
        return TicketsDAO.instance;
    }

    constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), TABLE_SERVICE_TICKET, { select: '*, ticket_history(*)' })
    }

    empty() {
        return {
            id: undefined,
            created_at: new Date(),
            inputSource: '',
            summary: '',
            description: '',
            status: '',
            assignee: '',
            due_date: new Date(),
            phone: '',
            email: '',
            clientName: '',
            ticket_history: []
        };
    }

    validateTicket(updated: Ticket): Map<string, string> {
        const map = new Map<string, string>();
        if (updated.clientName.trim() === '') {
            map.set('clientName', 'Client name is required.')
        }
        if (updated.summary.trim() === '') {
            map.set('summary', 'Summary is required.')
        }
        return map;
    }

    async createTicketHistory(history: TicketHistory): Promise<TicketHistory> {
        return this.client.from('ticket_history')
            .insert(history)
            .select()
            .then((resp: any) => resp.data![0] as TicketHistory);
    }
}

export { TicketsDAO };
