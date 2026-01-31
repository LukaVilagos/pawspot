import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ADMIN_ANIMAL_ROUTES, CreateAnimalRequestDto, PaginatedAnimalResponseDto, AnimalResponseDto, QueryOptionsDto, UpdateAnimalRequestDto, SignedUserDto } from '@pawspot/api-contracts';
import { AnimalService } from '../services/animal.service';
import { ZodSerializerDto, ZodValidationPipe } from 'nestjs-zod';
import { User } from 'src/modules/user/decorators/user.decorator';

@Controller(ADMIN_ANIMAL_ROUTES.ROOT)
@UseGuards(AuthGuard, AdminGuard)
@UsePipes(ZodValidationPipe)
export class AnimalAdminController {
    constructor(private readonly animalService: AnimalService) { }

    @ZodSerializerDto(AnimalResponseDto)
    @Get(ADMIN_ANIMAL_ROUTES.BY_ID)
    async getAnimalById(@Param('id') id: string): Promise<AnimalResponseDto> {
        return this.animalService.findById(id);
    }

    @ZodSerializerDto(AnimalResponseDto)
    @Post(ADMIN_ANIMAL_ROUTES.CREATE)
    async createAnimal(@Body() animal: CreateAnimalRequestDto, @User() user: SignedUserDto): Promise<AnimalResponseDto> {
        return this.animalService.create(animal, user.id);
    }

    @ZodSerializerDto(AnimalResponseDto)
    @Put(ADMIN_ANIMAL_ROUTES.UPDATE)
    async updateAnimal(@Param('id') id: string, @Body() animal: UpdateAnimalRequestDto, @User() user: SignedUserDto): Promise<AnimalResponseDto> {
        return this.animalService.update(id, animal, user.id);
    }

    @Delete(ADMIN_ANIMAL_ROUTES.DELETE)
    async deleteAnimal(@Param('id') id: string, @User() user: SignedUserDto) {
        await this.animalService.delete(id, user.id);
        return { message: 'Animal deleted successfully' };
    }

    @ZodSerializerDto(PaginatedAnimalResponseDto)
    @Post(ADMIN_ANIMAL_ROUTES.SEARCH)
    async searchAnimals(@Body() query: QueryOptionsDto<AnimalResponseDto>): Promise<PaginatedAnimalResponseDto> {
        return this.animalService.search(query);
    }
}
