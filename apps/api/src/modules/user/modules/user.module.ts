import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserAdminController } from '../controllers/user-admin.controller';
import { UserService } from '../services/user.service';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { AuditModule } from 'src/modules/audit/modules/audit.module';

@Module({
    imports: [AuditModule],
    controllers: [UserController, UserAdminController],
    providers: [UserService, AdminGuard],
    exports: [UserService],
})
export class UserModule { }
