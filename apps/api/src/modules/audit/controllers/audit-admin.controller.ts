import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ADMIN_AUDIT_LOG_ROUTES, AuditLogResponseDto, PaginatedAuditLogResponseDto, QueryOptionsDto } from '@pawspot/api-contracts';
import { AuditService } from '../services/audit.service';
import { ZodSerializerDto, ZodValidationPipe } from 'nestjs-zod';

@Controller(ADMIN_AUDIT_LOG_ROUTES.ROOT)
@UseGuards(AuthGuard, AdminGuard)
@UsePipes(ZodValidationPipe)
export class AuditAdminController {
    constructor(private readonly auditService: AuditService) { }

    @ZodSerializerDto(AuditLogResponseDto)
    @Get(ADMIN_AUDIT_LOG_ROUTES.BY_ID)
    async getAuditLogById(@Param('id') id: string): Promise<AuditLogResponseDto> {
        return this.auditService.findById(id);
    }

    @ZodSerializerDto(PaginatedAuditLogResponseDto)
    @Post(ADMIN_AUDIT_LOG_ROUTES.SEARCH)
    async searchAuditLogs(@Body() query: QueryOptionsDto<AuditLogResponseDto>): Promise<PaginatedAuditLogResponseDto> {
        return this.auditService.search(query);
    }
}
