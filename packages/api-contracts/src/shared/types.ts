export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type SortOrder = 'asc' | 'desc';

export type ID = string;
export type Timestamp = Date;

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type ApiEndpoint<
    TMethod extends HttpMethod = HttpMethod,
    TParams = unknown,
    TQuery = unknown,
    TBody = unknown,
    TResponse = unknown
> = {
    method: TMethod;
    path: string | ((...args: any[]) => string);
    params?: TParams;
    query?: TQuery;
    body?: TBody;
    response: TResponse;
};