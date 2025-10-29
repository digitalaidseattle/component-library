import { createClient } from "@supabase/supabase-js";

type PageInfo<T> = {
    totalRowCount: number
    rows: T[]
}

type FilterItem = {
    field: string
    operator: string,
    value: any
}

type FilterModel = {
    items: FilterItem[]
}

type QueryModel = {
    page: number
    pageSize: number,
    sortField: string,
    sortDirection: string,
    filterModel?: FilterModel
}

const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export { supabaseClient };
export type { PageInfo, QueryModel }