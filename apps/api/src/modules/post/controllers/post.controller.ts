import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { POST_ROUTES, PostResponseDto } from '@pawspot/api-contracts';
import { PostService } from '../services/post.service';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller(POST_ROUTES.ROOT)
@UseGuards(AuthGuard)
export class PostController {
    constructor(private readonly postService: PostService) { }

    @ZodSerializerDto(PostResponseDto)
    @Get(POST_ROUTES.BY_ID)
    async getPostById(@Param('id') id: string): Promise<PostResponseDto> {
        return this.postService.findById(id);
    }
}
