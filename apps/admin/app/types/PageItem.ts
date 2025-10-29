import type { InputType } from "./table-types"

export type PageItem<T> = {
    accessorKey: keyof T
    header: string
    type?: InputType
    options?: { label: string; value: any }[]
    component?: any
    componentProps?: Record<string, any>
    useDefaultOption?: boolean
}
