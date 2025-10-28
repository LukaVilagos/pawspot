import { PrismaClient } from '../generated/prisma';
export type * from '../generated/prisma';

export const prisma = new PrismaClient().$extends({
    query: {
        $allModels: {
            async findMany({ args, query }) {
                if ((args as any)?.includeDeleted) {
                    delete (args as any).includeDeleted;
                    return query(args);
                }

                args.where = args.where
                    ? { AND: [args.where, { deletedAt: null }] } as any
                    : { deletedAt: null };

                return query(args);
            },

            async findUnique({ args, query }) {
                if ((args as any)?.includeDeleted) {
                    delete (args as any).includeDeleted;
                    return query(args);
                }

                args.where = { ...args.where, deletedAt: null };
                return query(args);
            },

            async findFirst({ args, query }) {
                if ((args as any)?.includeDeleted) {
                    delete (args as any).includeDeleted;
                    return query(args);
                }
                args.where = args.where
                    ? { AND: [args.where, { deletedAt: null }] } as any
                    : { deletedAt: null };
                return query(args);
            },

            async count({ args, query }) {
                if ((args as any)?.includeDeleted) {
                    delete (args as any).includeDeleted;
                    return query(args);
                }
                args.where = args.where
                    ? { AND: [args.where, { deletedAt: null }] } as any
                    : { deletedAt: null };
                return query(args);
            }
        },
        user: {
            async findMany({ args, query }) {
                args.omit = { ...args.omit, password: true };
                return query(args);
            }
        },
    },
});
