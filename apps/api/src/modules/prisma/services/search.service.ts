import { Injectable, BadRequestException } from '@nestjs/common';
import { PaginatedResponse, QueryOptionsDto } from '@pawspot/api-contracts';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generic search for any Prisma model by name.
     * - model: Prisma model name (e.g. 'user', 'animal')
     * - query: QueryOptionsDto describing filter/sort/pagination
     * - options.omit: array of fields to omit from results (e.g. ['password'])
     */
    async search(
        model: string,
        query: QueryOptionsDto<any>,
        options?: { omit?: string[] },
    ): Promise<PaginatedResponse<any>> {
        const { sort = [], filter = [], page = 1, limit = 10 } = query || {};

        const modelClient = (this.prisma.client as any)[model];
        if (!modelClient) {
            throw new BadRequestException(`Model '${model}' not found on Prisma client`);
        }

        const buildNestedObject = (path: string[], value: any) => {
            if (path.length === 0) return value;
            const [head, ...rest] = path;
            return { [head]: rest.length ? buildNestedObject(rest, value) : value };
        };

        let where: any = undefined;
        if (filter && filter.length > 0) {
            const and = filter.map(([key, value]: [string, any]) => {
                const path = (key as string).split('.').filter(Boolean);
                return buildNestedObject(path, value);
            });
            where = { AND: and };
        }

        let orderBy: any = undefined;
        if (sort && sort.length > 0) {
            orderBy = sort.map(({ key, order }: { key: string; order: any }) => {
                const path = (key as string).split('.').filter(Boolean);
                if (path.length === 1) return { [path[0]]: order };
                const last = path.pop() as string;
                const nested = buildNestedObject(path, { [last]: order });
                return nested;
            });
        }

        const total = await modelClient.count({ where });

        const findArgs: any = {
            where,
            orderBy: orderBy?.length ? orderBy : undefined,
            skip: Math.max(0, (page - 1) * limit),
            take: limit,
        };

        if (options?.omit && options.omit.length > 0) {
            findArgs.omit = options.omit.reduce((acc: any, f: string) => {
                acc[f] = true;
                return acc;
            }, {});
        }

        const items = await modelClient.findMany(findArgs);

        const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

        return {
            items,
            total,
            page,
            limit,
            totalPages,
        };
    }
}
