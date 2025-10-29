import type { FilterOperator } from '@pawspot/api-contracts';

export type InputType =
    | 'text'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'select'
    | 'range'
    | 'password';

export interface SelectOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    type: InputType;
    operators?: FilterOperator[];
    options?: SelectOption[];
    customComponent?: string;
}

export interface TypedTableColumn<T> {
    accessorKey: keyof T & string;
    header: string;
    cell?: (ctx: { row: T }) => string | number | boolean | HTMLElement | VNode;
    filter?: FilterConfig;
    sortable?: boolean;
    meta?: {
        class?: {
            th?: string;
            td?: string;
        };
        style?: {
            th?: string;
            td?: string;
        };
    };
}
