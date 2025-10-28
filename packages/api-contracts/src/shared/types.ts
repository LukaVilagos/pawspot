import z from "zod";

type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;

type ArrayElement<A> = A extends (infer T)[] ? T : never;

export type NestedKeyOf<ObjectType> = {
    [Key in keyof ObjectType & string]:
    ObjectType[Key] extends Primitive
    ? Key
    : ObjectType[Key] extends Array<any>
    ? Key | `${Key}.${NestedKeyOf<ArrayElement<ObjectType[Key]>>}`
    : Key | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
}[keyof ObjectType & string];

export type SortOrder = 'asc' | 'desc';

export interface SortEntry<T> {
    key: NestedKeyOf<T>;
    order: SortOrder;
}

export type FilterOperator =
    | 'eq' | 'ne'
    | 'gt' | 'gte'
    | 'lt' | 'lte'
    | 'in' | 'notIn'
    | 'contains' | 'startsWith' | 'endsWith'
    | 'between';

export interface FilterCondition<TValue = any> {
    op: FilterOperator;
    value: TValue | TValue[];
    mode?: 'insensitive' | 'default';
}

export type FilterEntry<T> = [NestedKeyOf<T>, Primitive | FilterCondition<any>];

export interface QueryOptions<T> {
    sort?: SortEntry<T>[];
    filter?: FilterEntry<T>[];
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class QueryOptionsDto<T> implements QueryOptions<T> {
    sort?: SortEntry<T>[];
    filter?: FilterEntry<T>[];
    page?: number;
    limit?: number;
    totalPages?: number;
}

export const PaginatedResponseSchema = <T>(itemSchema: z.ZodType<T>) =>
    z.object({
        items: z.array(itemSchema),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    });