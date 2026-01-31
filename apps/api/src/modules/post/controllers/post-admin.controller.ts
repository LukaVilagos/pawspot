import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ADMIN_POST_ROUTES, CreatePostRequestDto, PaginatedPostResponseDto, PostResponseDto, QueryOptionsDto, UpdatePostRequestDto } from '@pawspot/api-contracts';
import { PostService } from '../services/post.service';
import { ZodSerializerDto, ZodValidationPipe } from 'nestjs-zod';

@Controller(ADMIN_POST_ROUTES.ROOT)
@UseGuards(AuthGuard, AdminGuard)
@UsePipes(ZodValidationPipe)
export class PostAdminController {
    constructor(private readonly postService: PostService) { }

    @ZodSerializerDto(PostResponseDto)
    @Get(ADMIN_POST_ROUTES.BY_ID)
    async getPostById(@Param('id') id: string): Promise<PostResponseDto> {
        return this.postService.findById(id);
    }

    @ZodSerializerDto(PostResponseDto)
    @Post(ADMIN_POST_ROUTES.CREATE)
    async createPost(@Body() post: CreatePostRequestDto): Promise<PostResponseDto> {
        return this.postService.create(post);
    }

    @ZodSerializerDto(PostResponseDto)
    @Put(ADMIN_POST_ROUTES.UPDATE)
    async updatePost(@Param('id') id: string, @Body() post: UpdatePostRequestDto): Promise<PostResponseDto> {
        return this.postService.update(id, post);
    }

    @Delete(ADMIN_POST_ROUTES.DELETE)
    async deletePost(@Param('id') id: string) {
        await this.postService.delete(id);
        return { message: 'Post deleted successfully' };
    }

    @ZodSerializerDto(PaginatedPostResponseDto)
    @Post(ADMIN_POST_ROUTES.SEARCH)
    async searchPosts(@Body() query: QueryOptionsDto<PostResponseDto>): Promise<PaginatedPostResponseDto> {
        return this.postService.search(query);
    }
}
