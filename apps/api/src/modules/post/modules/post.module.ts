import { Module } from '@nestjs/common';
import { PostController } from '../controllers/post.controller';
import { PostAdminController } from '../controllers/post-admin.controller';
import { PostService } from '../services/post.service';
import { AuditModule } from 'src/modules/audit/modules/audit.module';

@Module({
    imports: [AuditModule],
    controllers: [PostAdminController, PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule { }
