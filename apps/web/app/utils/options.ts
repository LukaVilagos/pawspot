import type z from "zod";

export const schemaToOptions = (schema: z.ZodEnum) =>
    schema.options.map((type) => ({
        value: String(type),
        label: String(type)
    }));