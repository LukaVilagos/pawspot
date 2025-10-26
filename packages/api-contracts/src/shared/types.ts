type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;

type ArrayElement<A> = A extends (infer T)[] ? T : never;

export type NestedKeyOf<ObjectType> = {
    [Key in keyof ObjectType & string]: ObjectType[Key] extends Primitive
    ? Key
    : ObjectType[Key] extends Array<any>
    ? Key | `${Key}.${NestedKeyOf<ArrayElement<ObjectType[Key]>>}`
    : Key | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
}[keyof ObjectType & string];

export type SortEntry<T> = { key: NestedKeyOf<T>; order: SortOrder };

export type FilterEntry<T> = [NestedKeyOf<T>, any];

export type SortOrder = 'asc' | 'desc';

export type QueryOptions<T> = {
    sort?: SortEntry<T>[];
    filter?: FilterEntry<T>[];
    page?: number;
    limit?: number;
};

export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export class QueryOptionsDto<T> {
    sort?: SortEntry<T>[];
    filter?: FilterEntry<T>[];
    page?: number;
    limit?: number;
    totalPages?: number;
}

