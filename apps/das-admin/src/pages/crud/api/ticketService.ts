/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { TicketsDAO } from "./TicketsDAO";
import { Ticket, TicketHistory } from "./types";


class TicketService {
    private static instance: TicketService;

    static getInstance() {
        if (!TicketService.instance) {
            TicketService.instance = new TicketService();
        }
        return TicketService.instance;
    }

    dao: TicketsDAO;
    constructor() {
        this.dao = TicketsDAO.getInstance();
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
        console.log(updated)
        if (updated.clientName.trim() === '') {
            map.set('clientName', 'Client name is required.')
        }
        if (updated.summary.trim() === '') {
            map.set('summary', 'Summary is required.')
        }
        return map;
    }

    async createTicketHistory(history: TicketHistory): Promise<TicketHistory> {
        return this.dao.createTicketHistory(history);
    }
}

export { TicketService };
