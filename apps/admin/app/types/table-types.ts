import type { FilterOperator } from '@pawspot/api-contracts';

export type InputType =
    | 'text'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'select'
    | 'select-search'
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
    /**
     * Optional nested key path for filtering on related/nested properties.
     * Use dot notation for nested fields, e.g., 'owner.name' or 'owner.email'.
     * When set, this key will be used instead of the column's accessorKey for filtering.
     */
    nestedKey?: string;
}

export interface LinkConfig<T> {
    href: (row: T) => string;
    label: (row: T) => string;
}

export interface TypedTableColumn<T> {
    accessorKey: keyof T & string;
    header: string;
    cell?: (ctx: { row: T }) => string | number | boolean | HTMLElement | VNode;
    link?: LinkConfig<T>;
    filter?: FilterConfig;
    sortable?: boolean;
    /**
     * Optional nested key path for sorting on related/nested properties.
     * Use dot notation for nested fields, e.g., 'owner.name' or 'owner.email'.
     * When set, this key will be used instead of the column's accessorKey for sorting.
     */
    sortKey?: string;
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
