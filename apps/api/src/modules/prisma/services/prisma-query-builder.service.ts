import { Injectable, BadRequestException } from '@nestjs/common';
import { PaginatedResponse, QueryOptionsDto, FilterOperator, FilterEntry } from '@pawspot/api-contracts';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { z, ZodTypeAny, ZodObject, ZodArray, ZodOptional, ZodNullable, ZodDefault, ZodLazy } from 'zod';

type PrimitiveValue = string | number | boolean | bigint | Date | null | undefined | symbol;

interface FilterConditionObject {
    op: FilterOperator;
    value: unknown;
    mode?: 'insensitive' | 'default';
}

type FilterValue = PrimitiveValue | FilterConditionObject;
type PrismaWhereClause = Record<string, unknown>;
type PrismaOrderByClause = Record<string, unknown>;

interface ModelClient {
    findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
    count: (args: { where?: PrismaWhereClause }) => Promise<number>;
}

interface SearchOptions {
    omit?: Record<string, boolean>;
    include?: Record<string, boolean | object>;
}

@Injectable()
export class PrismaQueryBuilderService {
    constructor(private prisma: PrismaService) { }

    async search<T>(
        model: string,
        query: QueryOptionsDto<T>,
        options?: SearchOptions,
    ): Promise<PaginatedResponse<T>> {
        const { sort = [], filter = [], page = 1, limit = 10 } = query;

        const modelClient = this.getModelClient(model);
        const where = this.buildWhereFromFilters(filter as FilterEntry<unknown>[]);
        const orderBy = this.buildOrderBy(sort);

        const total = await modelClient.count({ where });

        const findArgs: Record<string, unknown> = {
            where,
            orderBy: orderBy && orderBy.length > 0 ? orderBy : undefined,
            skip: Math.max(0, (page - 1) * limit),
            take: limit,
        };

        if (options?.omit) {
            findArgs.omit = options.omit;
        }
        if (options?.include) {
            findArgs.include = options.include;
        }

        const items = (await modelClient.findMany(findArgs)) as T[];
        const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

        return { items, total, page, limit, totalPages };
    }

    private getModelClient(model: string): ModelClient {
        const client = (this.prisma.client as Record<string, unknown>)[model];
        if (!client || typeof client !== 'object') {
            throw new BadRequestException(`Model '${model}' not found on Prisma client`);
        }
        return client as ModelClient;
    }

    private buildOrderBy(
        sort: { key: string; order: 'asc' | 'desc' }[] | undefined
    ): PrismaOrderByClause[] | undefined {
        if (!sort || sort.length === 0) return undefined;

        return sort
            .map((s) => {
                const path = s.key.split('.').filter(Boolean);
                if (path.length === 0) return undefined;
                if (path.length === 1) return { [path[0]]: s.order };

                const last = path[path.length - 1];
                const nested: Record<string, unknown> = {};
                let current = nested;

                for (let i = 0; i < path.length - 1; i++) {
                    const segment = path[i];
                    current[segment] = {};
                    current = current[segment] as Record<string, unknown>;
                }

                current[last] = s.order;
                return nested;
            })
            .filter((item): item is PrismaOrderByClause => item !== undefined);
    }

    private buildWhereFromFilters(filters: FilterEntry<unknown>[] | undefined): PrismaWhereClause | undefined {
        if (!filters || filters.length === 0) return undefined;

        const andClauses = filters.map(([rawKey, rawVal]) => {
            const path = String(rawKey).split('.').filter(Boolean);
            return this.parseFilterEntry(path, rawVal);
        });

        return { AND: andClauses };
    }

    private parseFilterEntry(path: string[], rawVal: FilterValue): PrismaWhereClause {
        const nest = (pathArr: string[], fragment: PrismaWhereClause): PrismaWhereClause => {
            if (pathArr.length === 0) return fragment;
            const [head, ...rest] = pathArr;
            return { [head]: nest(rest, fragment) };
        };

        const lastKey = path[path.length - 1];
        const basePath = path.slice(0, path.length - 1);
        const fragment = this.buildFilterCondition(lastKey, rawVal);
        return nest(basePath, fragment);
    }

    private buildFilterCondition(key: string, rawVal: FilterValue): PrismaWhereClause {
        const normalizeValue = (v: unknown): unknown => {
            if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
                const d = new Date(v);
                if (!isNaN(d.getTime())) return d;
            }
            return v;
        };

        if (typeof rawVal !== 'object' || rawVal === null) {
            return { [key]: normalizeValue(rawVal) };
        }

        if ('op' in rawVal && 'value' in rawVal) {
            const { op, value: val, mode } = rawVal;

            switch (op) {
                case 'eq':
                    return { [key]: normalizeValue(val) };
                case 'ne':
                    return { [key]: { not: normalizeValue(val) } };
                case 'gt':
                    return { [key]: { gt: normalizeValue(val) } };
                case 'gte':
                    return { [key]: { gte: normalizeValue(val) } };
                case 'lt':
                    return { [key]: { lt: normalizeValue(val) } };
                case 'lte':
                    return { [key]: { lte: normalizeValue(val) } };
                case 'contains':
                    return { [key]: { contains: String(val), mode: mode ?? 'insensitive' } };
                case 'startsWith':
                    return { [key]: { startsWith: String(val), mode: mode ?? 'insensitive' } };
                case 'endsWith':
                    return { [key]: { endsWith: String(val), mode: mode ?? 'insensitive' } };
                case 'in':
                    return { [key]: { in: Array.isArray(val) ? val : [val] } };
                case 'notIn':
                    return { [key]: { notIn: Array.isArray(val) ? val : [val] } };
                case 'between':
                    if (Array.isArray(val) && val.length === 2) {
                        const [from, to] = val;
                        return { [key]: { gte: normalizeValue(from), lte: normalizeValue(to) } };
                    }
                    break;
            }
        }

        return { [key]: normalizeValue(rawVal) };
    }

    buildPrismaSelect(schema: ZodTypeAny): Record<string, any> {
        const unwrapped = this.internalUnwrap(schema);
        if (unwrapped instanceof z.ZodObject) {
            const shape = (unwrapped as ZodObject<any>).shape;
            const select: Record<string, any> = {};
            for (const [key, value] of Object.entries(shape)) {
                const field = this.internalUnwrap(value as ZodTypeAny);
                if (field instanceof z.ZodObject) {
                    select[key] = { select: this.buildPrismaSelect(field) };
                } else if (field instanceof z.ZodArray) {
                    const arr = field as ZodArray<ZodTypeAny>;
                    const element = this.internalUnwrap((arr as any).def?.type ?? (arr as any).def?.innerType ?? (arr as any).element ?? (arr as any)._def?.type);
                    if (element instanceof z.ZodObject) {
                        select[key] = { select: this.buildPrismaSelect(element) };
                    } else {
                        select[key] = true;
                    }
                } else {
                    select[key] = true;
                }
            }
            return select;
        }
        return {};
    }

    private internalUnwrap(schema: ZodTypeAny): ZodTypeAny {
        if (schema instanceof ZodOptional || schema instanceof ZodNullable || schema instanceof ZodDefault) {
            const inner = (schema as any).def?.innerType ?? (schema as any).def?.type ?? (schema as any)._def?.innerType ?? (schema as any)._def?.type;
            return inner ? this.internalUnwrap(inner) : schema;
        }
        if (schema instanceof ZodLazy) {
            const getter = (schema as any).def?.getter ?? (schema as any)._def?.getter;
            const inner = typeof getter === 'function' ? getter() : undefined;
            return inner ? this.internalUnwrap(inner) : schema;
        }
        return schema;
    }
}
