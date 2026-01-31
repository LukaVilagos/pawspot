import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../../shared";
import { UserSummarySchema } from "../user";

export const AuditLogResponseSchema = z.strictObject({
    id: z.string(),
    createdAt: z.coerce.date(),
    action: z.string(),
    get user(): typeof UserSummarySchema {
        return UserSummarySchema;
    }
});

export const AuditLogSummarySchema = AuditLogResponseSchema.pick({
    id: true,
    action: true,
    createdAt: true,
});

export const AuditLogsListResponseSchema = z.array(AuditLogResponseSchema);
export const PaginatedAuditLogResponseSchema = PaginatedResponseSchema(AuditLogResponseSchema);

export type AuditLogResponse = z.infer<typeof AuditLogResponseSchema>;
export type AuditLogSummary = z.infer<typeof AuditLogSummarySchema>;
export type AuditLogsListResponse = z.infer<typeof AuditLogsListResponseSchema>;
export type PaginatedAuditLogResponse = z.infer<typeof PaginatedAuditLogResponseSchema>;

export class AuditLogResponseDto extends createZodDto(AuditLogResponseSchema) { }
export class AuditLogSummaryDto extends createZodDto(AuditLogSummarySchema) { }
export class AuditLogsListResponseDto extends createZodDto(AuditLogsListResponseSchema) { }
export class PaginatedAuditLogResponseDto extends createZodDto(PaginatedAuditLogResponseSchema) { }
