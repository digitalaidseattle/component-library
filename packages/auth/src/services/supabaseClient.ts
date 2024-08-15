type PageInfo<T> = {
    totalRowCount: number
    rows: T[]
}

type QueryModel = {
    page: number
    pageSize: number,
    sortField: string,
    sortDirection: string
}

// TODO: define supabaseClient

export type { PageInfo, QueryModel }