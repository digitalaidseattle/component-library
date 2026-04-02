/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";
import { TicketHistory } from "./types";

const TABLE_NAME = 'ticket_history';

class TicketHistoryDAO extends SupabaseDAO<TicketHistory> {
    private static instance: TicketHistoryDAO;

    static getInstance() {
        if (!TicketHistoryDAO.instance) {
            TicketHistoryDAO.instance = new TicketHistoryDAO();
        }
        return TicketHistoryDAO.instance;
    }

    constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), TABLE_NAME)
    }


}

export { TicketHistoryDAO };
