import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateSanctuaryRequestDto, PaginatedSanctuaryResponseDto, QueryOptionsDto, SANCTUARY_ADMIN_ROUTES, SanctuaryResponseDto, SignedUserDto, UpdateSanctuaryRequestDto } from '@pawspot/api-contracts';
import { SanctuaryService } from '../services/sanctuary.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { User } from 'src/modules/user/decorators/user.decorator';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller(SANCTUARY_ADMIN_ROUTES.ROOT)
@UseGuards(AuthGuard, AdminGuard)
export class SanctuaryAdminController {
    constructor(private readonly sanctuaryService: SanctuaryService) { }

    @ZodSerializerDto(SanctuaryResponseDto)
    @Get(SANCTUARY_ADMIN_ROUTES.BY_ID)
    async findOne(@Param('id') id: string): Promise<SanctuaryResponseDto> {
        return this.sanctuaryService.findById(id);
    }

    @ZodSerializerDto(SanctuaryResponseDto)
    @Post(SANCTUARY_ADMIN_ROUTES.CREATE)
    async create(@Body() sanctuary: CreateSanctuaryRequestDto): Promise<SanctuaryResponseDto> {
        return this.sanctuaryService.create(sanctuary, undefined, true);
    }

    @ZodSerializerDto(SanctuaryResponseDto)
    @Put(SANCTUARY_ADMIN_ROUTES.UPDATE)
    async update(@Param('id') id: string, @Body() sanctuary: UpdateSanctuaryRequestDto): Promise<SanctuaryResponseDto> {
        return this.sanctuaryService.update(id, sanctuary, undefined, true);
    }

    @Delete(SANCTUARY_ADMIN_ROUTES.DELETE)
    async delete(@Param('id') id: string, @User() admin: SignedUserDto) {
        await this.sanctuaryService.delete(id, admin, true);
        return { message: 'Sanctuary deleted successfully' };
    }

    @ZodSerializerDto(PaginatedSanctuaryResponseDto)
    @Get(SANCTUARY_ADMIN_ROUTES.SEARCH)
    async findAll(@Query() query: QueryOptionsDto<SanctuaryResponseDto>): Promise<PaginatedSanctuaryResponseDto> {
        return this.sanctuaryService.search(query);
    }
}
