/**
 *  ticketService.test.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from 'vitest';
import { StaffService } from './staffService';
import { SupabaseConfiguration } from '@digitalaidseattle/supabase';

const mockFilterBuilder = {
    limit: vi.fn(() => Promise.resolve({})),
    range: vi.fn(() => Promise.resolve({})),
    order: vi.fn(() => Promise.resolve({}))
};

const mockQueryBuilder = {
    insert: vi.fn(() => Promise.resolve({})),
    update: vi.fn(() => Promise.resolve({})),
    select: vi.fn(() => Promise.resolve({})),
    eq: vi.fn(() => Promise.resolve({}))
};

describe('staffService tests', () => {
    const staffService = StaffService.getInstance();
    const supabaseClient = SupabaseConfiguration.getInstance().getSupabaseClient();

    it('getAll', async () => {
        const response = { data: [{}], error: null }

        const fromSpy = vi.spyOn(supabaseClient, "from")
            .mockReturnValue(mockQueryBuilder as any)
        const selectSpy = vi.spyOn(mockQueryBuilder, "select")
            .mockReturnValue(mockFilterBuilder as any)
        const orderSpy = vi.spyOn(mockFilterBuilder, "order")
            .mockReturnValue(Promise.resolve(response))

        const tixs = await staffService.getAll()
        expect(fromSpy).toHaveBeenCalledWith('staff')
        expect(selectSpy).toHaveBeenCalled()
        expect(orderSpy).toHaveBeenCalledWith('created_at', { ascending: false })
        expect(tixs.length).toEqual(1);
    });

})
