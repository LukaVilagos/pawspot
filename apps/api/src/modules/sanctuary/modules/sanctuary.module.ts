import { Module } from '@nestjs/common';
import { SanctuaryController } from '../controllers/sanctuary.controller';
import { SanctuaryAdminController } from '../controllers/sancutary-admin.controller';
import { SanctuaryService } from '../services/sanctuary.service';
import { AuditModule } from 'src/modules/audit/modules/audit.module';

@Module({
    imports: [AuditModule],
    controllers: [SanctuaryAdminController, SanctuaryController],
    providers: [SanctuaryService],
})
export class SanctuaryModule { }
