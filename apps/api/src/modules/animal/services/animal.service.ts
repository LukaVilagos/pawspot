import { Injectable } from '@nestjs/common';
import { CreateAnimalRequestDto, PaginatedResponse, QueryOptionsDto, AnimalResponseDto, AnimalsListResponseDto, UpdateAnimalRequestDto } from '@pawspot/api-contracts';
import { PawSpotLogger } from 'src/common/logger/logger';
import { AuditService } from 'src/modules/audit/services/audit.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PrismaQueryBuilderService } from 'src/modules/prisma/services/prisma-query-builder.service';

const ANIMAL_OMIT_FIELDS = { updatedAt: true, deletedAt: true, sanctuaryId: true } as const;
const ANIMAL_INCLUDE_FIELDS = {
    sanctuary: { select: { id: true, name: true, location: true } },
} as const;

@Injectable()
export class AnimalService {
    constructor(
        private prisma: PrismaService,
        private prismaQueryBuilder: PrismaQueryBuilderService,
        private auditService: AuditService
    ) { }

    private readonly logger = new PawSpotLogger(AnimalService.name);

    async findAll(): Promise<AnimalsListResponseDto> {
        this.logger.log('Getting all animals');
        return this.prisma.client.animal.findMany({
            where: { deletedAt: null },
            omit: ANIMAL_OMIT_FIELDS,
            include: ANIMAL_INCLUDE_FIELDS,
        });
    }

    async findById(id: string): Promise<AnimalResponseDto> {
        this.logger.log(`Getting animal by id: ${id}`);
        const animal = await this.prisma.client.animal.findUnique({
            where: { id, deletedAt: null },
            omit: ANIMAL_OMIT_FIELDS,
            include: ANIMAL_INCLUDE_FIELDS,
        });
        if (!animal) {
            throw new Error('Animal not found');
        }
        return animal;
    }

    async create(animal: CreateAnimalRequestDto, userId: string): Promise<AnimalResponseDto> {
        this.logger.log(`Creating animal: ${animal.name}`);
        const createdAnimal = await this.prisma.client.animal.create({
            data: {
                name: animal.name,
                species: animal.species,
                age: animal.age,
                sanctuary: { connect: { id: animal.sanctuaryId } },
            },
            omit: ANIMAL_OMIT_FIELDS,
            include: ANIMAL_INCLUDE_FIELDS,
        });

        await this.auditService.logAction(userId, `Created animal: ${createdAnimal.id}`);
        return createdAnimal;
    }

    async update(id: string, animalData: UpdateAnimalRequestDto, userId: string): Promise<AnimalResponseDto> {
        this.logger.log(`Updating animal: ${id}`);
        const existingAnimal = await this.prisma.client.animal.findUniqueOrThrow({
            where: { id },
        });

        const updatedAnimal = await this.prisma.client.animal.update({
            where: { id },
            data: {
                name: animalData.name ?? existingAnimal.name,
                species: animalData.species ?? existingAnimal.species,
                age: animalData.age ?? existingAnimal.age,
                sanctuary: animalData.sanctuaryId ? { connect: { id: animalData.sanctuaryId } } : undefined,
            },
            omit: ANIMAL_OMIT_FIELDS,
            include: ANIMAL_INCLUDE_FIELDS,
        });

        await this.auditService.logAction(userId, `Updated animal: ${id}`);
        return updatedAnimal;
    }

    async delete(id: string, userId: string): Promise<void> {
        this.logger.log(`Deleting animal: ${id}`);
        await this.prisma.client.animal.findUniqueOrThrow({
            where: { id },
        });

        await this.prisma.client.animal.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        await this.auditService.logAction(userId, `Deleted animal: ${id}`);
    }

    async search(query: QueryOptionsDto<AnimalResponseDto>): Promise<PaginatedResponse<AnimalResponseDto>> {
        this.logger.log(`Searching animals with query: ${JSON.stringify(query)}`);
        return this.prismaQueryBuilder.search<AnimalResponseDto>('animal', query, {
            omit: ANIMAL_OMIT_FIELDS,
            include: ANIMAL_INCLUDE_FIELDS,
        });
    }
}
