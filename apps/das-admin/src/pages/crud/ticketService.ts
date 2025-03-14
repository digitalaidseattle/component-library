/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";


const TABLE_SERVICE_TICKET = 'service_ticket';

class TicketService extends SupabaseEntityService<Ticket> {

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

    async getById(ticket_id: Identifier): Promise<Ticket | null> {
        return super.getById(ticket_id, '*, ticket_history(*)')
    }

    // async create(user: User, tix: Ticket): Promise<Ticket> {
    //     tix.status = 'new';
    //     return supabaseClient.from(TABLE_SERVICE_TICKET)
    //         .insert(tix)
    //         .select()
    //         .single()
    //         .then(async (resp: any) => {
    //             const ticket = resp.data! as Ticket;
    //             const history = {
    //                 'service_ticket_id': ticket.id,
    //                 'description': 'New ticket',
    //                 'change_by': user.email
    //             }
    //             return this.createTicketHistory(history as TicketHistory)
    //                 .then(() => this.getById(ticket.id.toString()))
    //         })
    // }

    // async update(user: User, tix: Ticket, changes: Map<string, unknown>): Promise<Ticket> {
    //     return supabaseClient.from(TABLE_SERVICE_TICKET)
    //         .update(Object.fromEntries(changes.entries()))
    //         .eq('id', tix.id)
    //         .select()
    //         .single()
    //         .then(async (resp: any) => {
    //             const ticket = resp.data;
    //             const history = {
    //                 'service_ticket_id': tix.id,
    //                 'description': JSON.stringify(Array.from(changes.entries())),
    //                 'change_by': user.email
    //             }
    //             return this.createTicketHistory(history as TicketHistory)
    //                 .then(() => this.getById(ticket.id.toString()))
    //         })
    // }

    async createTicketHistory(history: TicketHistory): Promise<TicketHistory> {
        return supabaseClient.from('ticket_history')
            .insert(history)
            .select()
            .then((resp: any) => resp.data![0] as TicketHistory);
    }
}

const ticketService = new TicketService(TABLE_SERVICE_TICKET)
export { ticketService };

