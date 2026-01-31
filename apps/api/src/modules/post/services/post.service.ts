import { Injectable } from '@nestjs/common';
import { CreatePostRequestDto, PaginatedResponse, QueryOptionsDto, PostResponseDto, PostsListResponseDto, UpdatePostRequestDto } from '@pawspot/api-contracts';
import { PawSpotLogger } from 'src/common/logger/logger';
import { AuditService } from 'src/modules/audit/services/audit.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PrismaQueryBuilderService } from 'src/modules/prisma/services/prisma-query-builder.service';

const POST_OMIT_FIELDS = { updatedAt: true, deletedAt: true, userId: true, sanctuaryId: true } as const;
const POST_INCLUDE_FIELDS = {
    user: { select: { id: true, email: true, name: true } },
    sanctuary: { select: { id: true, name: true, location: true } },
} as const;

@Injectable()
export class PostService {
    constructor(
        private prisma: PrismaService,
        private prismaQueryBuilder: PrismaQueryBuilderService,
        private auditService: AuditService
    ) { }

    private readonly logger = new PawSpotLogger(PostService.name);

    async findAll(): Promise<PostsListResponseDto> {
        this.logger.log('Getting all posts');
        return this.prisma.client.post.findMany({
            where: { deletedAt: null },
            omit: POST_OMIT_FIELDS,
            include: POST_INCLUDE_FIELDS,
        });
    }

    async findById(id: string): Promise<PostResponseDto> {
        this.logger.log(`Getting post by id: ${id}`);
        const post = await this.prisma.client.post.findUnique({
            where: { id, deletedAt: null },
            omit: POST_OMIT_FIELDS,
            include: POST_INCLUDE_FIELDS,
        });
        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    }

    async create(post: CreatePostRequestDto): Promise<PostResponseDto> {
        this.logger.log(`Creating post: ${post.title}`);
        const createdPost = await this.prisma.client.post.create({
            data: {
                title: post.title,
                content: post.content,
                user: { connect: { id: post.userId } },
                sanctuary: { connect: { id: post.sanctuaryId } },
            },
            omit: POST_OMIT_FIELDS,
            include: POST_INCLUDE_FIELDS,
        });

        await this.auditService.logAction(post.userId, `Created post: ${createdPost.id}`);
        return createdPost;
    }

    async update(id: string, postData: UpdatePostRequestDto): Promise<PostResponseDto> {
        this.logger.log(`Updating post: ${id}`);
        const existingPost = await this.prisma.client.post.findUniqueOrThrow({
            where: { id },
        });

        const updatedPost = await this.prisma.client.post.update({
            where: { id },
            data: {
                title: postData.title ?? existingPost.title,
                content: postData.content ?? existingPost.content,
                user: postData.userId ? { connect: { id: postData.userId } } : undefined,
                sanctuary: postData.sanctuaryId ? { connect: { id: postData.sanctuaryId } } : undefined,
            },
            omit: POST_OMIT_FIELDS,
            include: POST_INCLUDE_FIELDS,
        });

        await this.auditService.logAction(existingPost.userId, `Updated post: ${id}`);
        return updatedPost;
    }

    async delete(id: string): Promise<void> {
        this.logger.log(`Deleting post: ${id}`);
        const post = await this.prisma.client.post.findUniqueOrThrow({
            where: { id },
        });

        await this.prisma.client.post.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        await this.auditService.logAction(post.userId, `Deleted post: ${id}`);
    }

    async search(query: QueryOptionsDto<PostResponseDto>): Promise<PaginatedResponse<PostResponseDto>> {
        this.logger.log(`Searching posts with query: ${JSON.stringify(query)}`);
        return this.prismaQueryBuilder.search<PostResponseDto>('post', query, {
            omit: POST_OMIT_FIELDS,
            include: POST_INCLUDE_FIELDS,
        });
    }
}
