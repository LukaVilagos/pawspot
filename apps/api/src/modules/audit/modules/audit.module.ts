import { Module } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { AuditAdminController } from '../controllers/audit-admin.controller';

@Module({
    controllers: [AuditAdminController],
    providers: [AuditService],
    exports: [AuditService]
})
export class AuditModule { }
