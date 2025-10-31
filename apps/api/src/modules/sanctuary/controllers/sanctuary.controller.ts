import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateSanctuaryRequestDto, SanctuariesListResponseDto, SANCTUARY_ROUTES, SanctuaryResponseDto, SignedUserDto, UpdateSanctuaryRequestDto } from '@pawspot/api-contracts';
import { SanctuaryService } from '../services/sanctuary.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { User } from 'src/modules/user/decorators/user.decorator';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller(SANCTUARY_ROUTES.ROOT)
export class SanctuaryController {
    constructor(private readonly sanctuaryService: SanctuaryService) { }

    @ZodSerializerDto(SanctuariesListResponseDto)
    @Get(SANCTUARY_ROUTES.BY_LOCATION)
    async findByLocation(@Param('location') location: string): Promise<SanctuariesListResponseDto> {
        return this.sanctuaryService.findByLocation(location);
    }

    @ZodSerializerDto(SanctuaryResponseDto)
    @Get(SANCTUARY_ROUTES.BY_ID)
    async findById(@Param('id') id: string): Promise<SanctuaryResponseDto> {
        return this.sanctuaryService.findById(id);
    }

    @ZodSerializerDto(SanctuaryResponseDto)
    @UseGuards(AuthGuard)
    @Post(SANCTUARY_ROUTES.CREATE)
    async create(@Body() sanctuary: CreateSanctuaryRequestDto, @User() user: SignedUserDto): Promise<SanctuaryResponseDto> {
        return this.sanctuaryService.create(sanctuary, user);
    }

    @ZodSerializerDto(SanctuaryResponseDto)
    @UseGuards(AuthGuard)
    @Put(SANCTUARY_ROUTES.UPDATE)
    async update(@Param('id') id: string, @Body() sanctuary: UpdateSanctuaryRequestDto, @User() user: SignedUserDto): Promise<SanctuaryResponseDto> {
        return this.sanctuaryService.update(id, sanctuary, user);
    }

    @UseGuards(AuthGuard)
    @Delete(SANCTUARY_ROUTES.DELETE)
    async delete(@Param('id') id: string, @User() user: SignedUserDto) {
        await this.sanctuaryService.delete(id, user);
        return { message: 'Sanctuary deleted successfully' };
    }

    @UseGuards(AuthGuard)
    @Post(SANCTUARY_ROUTES.JOIN)
    async join(@Param('id') sanctuary: string, @User() user: SignedUserDto) {
        await this.sanctuaryService.join(sanctuary, user);
        return { message: 'Joined sanctuary successfully' };
    }

    @UseGuards(AuthGuard)
    @Post(SANCTUARY_ROUTES.LEAVE)
    async leave(@Param('id') sanctuary: string, @User() user: SignedUserDto) {
        await this.sanctuaryService.leave(sanctuary, user);
        return { message: 'Left sanctuary successfully' };
    }
}
