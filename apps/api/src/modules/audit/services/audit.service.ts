import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async logAction(userId: string, action: string) {
        await this.prisma.client.auditLog.create({
            data: { userId, action },
        });
    }
}
