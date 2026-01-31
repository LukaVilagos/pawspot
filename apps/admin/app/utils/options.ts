import type z from "zod";

export const schemaToOptions = (schema: z.ZodEnum<[string, ...string[]]>) =>
    schema.options.map((type: string) => ({
        value: String(type),
        label: String(type)
    }));

export interface SelectOption {
    label: string
    value: string
}

export function toSelectOptions<T extends { id: string }>(
    items: T[],
    labelFn: (item: T) => string
): SelectOption[] {
    return items.map(item => ({
        label: labelFn(item),
        value: item.id
    }))
}

export function sanctuaryToOptions(sanctuaries: { id: string; name: string }[]): SelectOption[] {
    return toSelectOptions(sanctuaries, s => s.name)
}

export function userToOptions(users: { id: string; name?: string | null; email: string }[]): SelectOption[] {
    return toSelectOptions(users, u => u.name || u.email)
}
