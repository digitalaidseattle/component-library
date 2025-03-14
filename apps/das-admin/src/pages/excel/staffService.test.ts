/**
 *  ticketService.test.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from 'vitest';
import { staffService } from './staffService';
import { supabaseClient } from '@digitalaidseattle/supabase';

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

    it('getAll', async () => {
        const LIMIT = 10;
        const response = { data: [{}], error: null }

        const fromSpy = vi.spyOn(supabaseClient, "from")
            .mockReturnValue(mockQueryBuilder as any)
        const selectSpy = vi.spyOn(mockQueryBuilder, "select")
            .mockReturnValue(mockFilterBuilder as any)
        const limitSpy = vi.spyOn(mockFilterBuilder, "limit")
            .mockReturnValue(mockFilterBuilder as any)
        const orderSpy = vi.spyOn(mockFilterBuilder, "order")
            .mockReturnValue(Promise.resolve(response))

        const tixs = await staffService.getAll(LIMIT)
        expect(fromSpy).toHaveBeenCalledWith('staff')
        expect(selectSpy).toHaveBeenCalled()
        expect(limitSpy).toHaveBeenCalledWith(LIMIT)
        expect(orderSpy).toHaveBeenCalledWith('created_at', { ascending: false })
        expect(tixs.length).toEqual(1);
    });

})
