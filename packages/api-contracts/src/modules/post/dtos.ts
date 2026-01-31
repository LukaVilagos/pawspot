import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../../shared";
import { UserSummarySchema } from "../user";
import { SanctuarySummarySchema } from "../sanctuary";

export const CreatePostRequestSchema = z.strictObject({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    userId: z.string().min(1, 'User is required'),
    sanctuaryId: z.string().min(1, 'Sanctuary is required'),
});

export const UpdatePostRequestSchema = z.strictObject({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    content: z.string().min(1, 'Content cannot be empty').optional(),
    userId: z.string().min(1, 'User cannot be empty').optional(),
    sanctuaryId: z.string().min(1, 'Sanctuary cannot be empty').optional(),
});

export const PostResponseSchema = z.strictObject({
    id: z.string(),
    createdAt: z.coerce.date(),
    title: z.string(),
    content: z.string(),
    get user(): typeof UserSummarySchema {
        return UserSummarySchema;
    },
    get sanctuary(): typeof SanctuarySummarySchema {
        return SanctuarySummarySchema;
    }
});

export const PostSummarySchema = PostResponseSchema.pick({
    id: true,
    title: true,
});

export const PostsListResponseSchema = z.array(PostResponseSchema);
export const PaginatedPostResponseSchema = PaginatedResponseSchema(PostResponseSchema);

export type PostResponse = z.infer<typeof PostResponseSchema>;
export type PostSummary = z.infer<typeof PostSummarySchema>;
export type PostsListResponse = z.infer<typeof PostsListResponseSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;
export type PaginatedPostResponse = z.infer<typeof PaginatedPostResponseSchema>;

export class PostResponseDto extends createZodDto(PostResponseSchema) { }
export class PostSummaryDto extends createZodDto(PostSummarySchema) { }
export class PostsListResponseDto extends createZodDto(PostsListResponseSchema) { }
export class CreatePostRequestDto extends createZodDto(CreatePostRequestSchema) { }
export class UpdatePostRequestDto extends createZodDto(UpdatePostRequestSchema) { }
export class PaginatedPostResponseDto extends createZodDto(PaginatedPostResponseSchema) { }
