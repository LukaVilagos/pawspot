import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ANIMAL_ROUTES, AnimalResponseDto } from '@pawspot/api-contracts';
import { AnimalService } from '../services/animal.service';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller(ANIMAL_ROUTES.ROOT)
@UseGuards(AuthGuard)
export class AnimalController {
    constructor(private readonly animalService: AnimalService) { }

    @ZodSerializerDto(AnimalResponseDto)
    @Get(ANIMAL_ROUTES.BY_ID)
    async getAnimalById(@Param('id') id: string): Promise<AnimalResponseDto> {
        return this.animalService.findById(id);
    }
}
