export type PageInfo<T> = {
    totalRowCount: number
    rows: T[]
}

export type QueryModel = {
    page: number
    pageSize: number,
    sortField: string,
    sortDirection: string
}

// TODO: define supabaseClient