export type PageItem<T> = {
    accessorKey: keyof T
    header: string
    type?: string
    options?: { label: string; value: any }[]
    component?: any
    componentProps?: Record<string, any>
}
