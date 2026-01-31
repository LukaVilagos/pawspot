import { Injectable } from '@nestjs/common';
import { AuditLogResponseDto, PaginatedResponse, QueryOptionsDto } from '@pawspot/api-contracts';
import { PawSpotLogger } from 'src/common/logger/logger';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PrismaQueryBuilderService } from 'src/modules/prisma/services/prisma-query-builder.service';

const AUDIT_LOG_OMIT_FIELDS = { updatedAt: true, deletedAt: true, userId: true } as const;
const AUDIT_LOG_INCLUDE_FIELDS = {
    user: { select: { id: true, email: true, name: true } },
} as const;

@Injectable()
export class AuditService {
    constructor(
        private prisma: PrismaService,
        private prismaQueryBuilder: PrismaQueryBuilderService
    ) { }

    private readonly logger = new PawSpotLogger(AuditService.name);

    async logAction(userId: string, action: string) {
        await this.prisma.client.auditLog.create({
            data: { userId, action },
        });
    }

    async findById(id: string): Promise<AuditLogResponseDto> {
        this.logger.log(`Getting audit log by id: ${id}`);
        const auditLog = await this.prisma.client.auditLog.findUnique({
            where: { id, deletedAt: null },
            omit: AUDIT_LOG_OMIT_FIELDS,
            include: AUDIT_LOG_INCLUDE_FIELDS,
        });
        if (!auditLog) {
            throw new Error('Audit log not found');
        }
        return auditLog;
    }

    async search(query: QueryOptionsDto<AuditLogResponseDto>): Promise<PaginatedResponse<AuditLogResponseDto>> {
        this.logger.log(`Searching audit logs with query: ${JSON.stringify(query)}`);
        return this.prismaQueryBuilder.search<AuditLogResponseDto>('auditLog', query, {
            omit: AUDIT_LOG_OMIT_FIELDS,
            include: AUDIT_LOG_INCLUDE_FIELDS,
        });
    }
}
