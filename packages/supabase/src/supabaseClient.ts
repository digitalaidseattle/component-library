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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabaseClient = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-anon-key"
);

export { supabaseClient };
export { supabaseConfigured };
export type { PageInfo, QueryModel }
