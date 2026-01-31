import type z from "zod";

export const schemaToOptions = (schema: z.ZodEnum<[string, ...string[]]>) =>
    schema.options.map((type: string) => ({
        value: String(type),
        label: String(type)
    }));
