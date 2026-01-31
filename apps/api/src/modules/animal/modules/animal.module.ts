import { Module } from '@nestjs/common';
import { AnimalController } from '../controllers/animal.controller';
import { AnimalAdminController } from '../controllers/animal-admin.controller';
import { AnimalService } from '../services/animal.service';
import { AuditModule } from 'src/modules/audit/modules/audit.module';

@Module({
    imports: [AuditModule],
    controllers: [AnimalAdminController, AnimalController],
    providers: [AnimalService],
    exports: [AnimalService],
})
export class AnimalModule { }
