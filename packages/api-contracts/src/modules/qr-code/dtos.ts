import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const CreateQrCodeRequestSchema = z.strictObject({
    targetUrl: z.string().min(1, 'Target URL is required').url('Please enter a valid URL'),
    imageUrl: z.string().min(1, 'Image URL is required').url('Please enter a valid URL'),
    sanctuaryId: z.string().min(1, 'Sanctuary is required'),
});

export const UpdateQrCodeRequestSchema = z.strictObject({
    targetUrl: z.string().url('Please enter a valid URL').optional(),
    imageUrl: z.string().url('Please enter a valid URL').optional(),
    sanctuaryId: z.string().min(1, 'Sanctuary cannot be empty').optional(),
});

export const QrCodeResponseSchema = z.strictObject({
    id: z.string(),
    createdAt: z.coerce.date(),
    targetUrl: z.string().url(),
    imageUrl: z.string().url(),
    sanctuaryId: z.string(),
});

export const QrCodesListResponseSchema = z.array(QrCodeResponseSchema);

export type QrCodeResponse = z.infer<typeof QrCodeResponseSchema>;
export type QrCodesListResponse = z.infer<typeof QrCodesListResponseSchema>;
export type CreateQrCodeRequest = z.infer<typeof CreateQrCodeRequestSchema>;
export type UpdateQrCodeRequest = z.infer<typeof UpdateQrCodeRequestSchema>;

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
