/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { getSupabaseClient, SupabaseDAO } from "@digitalaidseattle/supabase";
import { Staff } from "./types";

const TABLE_STAFF = 'staff';

export class StaffDao extends SupabaseDAO<Staff> {
    private static instance: StaffDao;

    static getInstance() {
        if (!StaffDao.instance) {
            StaffDao.instance = new StaffDao();
        }
        return StaffDao.instance;
    }

    constructor() {
        super(getSupabaseClient(), TABLE_STAFF, { select: '*, ticket_history(*)' })
    }
}
