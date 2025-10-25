import { z } from "zod";
import { createZodDto } from "nestjs-zod";

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const CreateQrCodeRequestSchema = z.object({
    targetUrl: z.url(),
    imageUrl: z.url(),
    sanctuaryId: z.string().min(1),
});

export const UpdateQrCodeRequestSchema = z.object({
    targetUrl: z.url().optional(),
    imageUrl: z.url().optional(),
    sanctuaryId: z.string().min(1).optional(),
});

// ============================================================================

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const QrCodeResponseSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    targetUrl: z.url(),
    imageUrl: z.url(),
    sanctuaryId: z.string(),
});

export const QrCodesListResponseSchema = z.array(QrCodeResponseSchema);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type QrCodeResponse = z.infer<typeof QrCodeResponseSchema>;
export type QrCodesListResponse = z.infer<typeof QrCodesListResponseSchema>;
export type CreateQrCodeRequest = z.infer<typeof CreateQrCodeRequestSchema>;
export type UpdateQrCodeRequest = z.infer<typeof UpdateQrCodeRequestSchema>;

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

export class QrCodeResponseDto extends createZodDto(QrCodeResponseSchema) { }
export class QrCodesListResponseDto extends createZodDto(
    QrCodesListResponseSchema
) { }
export class CreateQrCodeRequestDto extends createZodDto(
    CreateQrCodeRequestSchema
) { }
export class UpdateQrCodeRequestDto extends createZodDto(
    UpdateQrCodeRequestSchema
) { }
