import { Injectable } from '@nestjs/common';
import { CreateSanctuaryRequestDto, PaginatedResponse, QueryOptionsDto, SanctuariesListResponseDto, SanctuaryResponseDto, SignedUserDto, UpdateSanctuaryRequestDto } from '@pawspot/api-contracts';
import { PawSpotLogger } from 'src/common/logger/logger';
import { AuditService } from 'src/modules/audit/services/audit.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { SearchService } from 'src/modules/prisma/services/search.service';

@Injectable()
export class SanctuaryService {
    constructor(
        private prisma: PrismaService,
        private searchService: SearchService,
        private auditService: AuditService
    ) { }

    private readonly logger = new PawSpotLogger(SanctuaryService.name);

    async findByLocation(location: string): Promise<SanctuariesListResponseDto> {
        this.logger.log(`Getting sanctuaries by location: ${location}`);
        return this.prisma.client.sanctuary.findMany({
            where: { location: { contains: location, mode: 'insensitive' } },
            include: {
                owner: true,
                contributors: true,
            }
        });
    }

    async findById(id: string): Promise<SanctuaryResponseDto> {
        this.logger.log(`Getting sanctuary by id: ${id}`);
        return this.prisma.client.sanctuary.findUniqueOrThrow({
            where: { id },
            include: {
                owner: true,
                contributors: true,
            }
        });
    }

    async create(sanctuary: CreateSanctuaryRequestDto, user?: SignedUserDto, isAdmin: boolean = false): Promise<SanctuaryResponseDto> {
        this.logger.log(`Creating sanctuary: ${sanctuary.name}`);

        if (!isAdmin && !user) {
            throw new Error('User must be provided for non-admin sanctuary creation');
        }

        const ownerId = isAdmin && sanctuary.ownerId ? sanctuary.ownerId : user!.id;
        const contributorIds = isAdmin && sanctuary.contributors ? sanctuary.contributors : [];

        const newSanctuaryData: CreateSanctuaryRequestDto = {
            ...sanctuary,
            ownerId,
            contributors: contributorIds,
        };

        const newSanctuary = await this.prisma.client.sanctuary.create({
            data: {
                name: newSanctuaryData.name,
                location: newSanctuaryData.location,
                owner: { connect: { id: ownerId } },
                contributors: {
                    connect: contributorIds.map(id => ({ id }))
                },
            },
            include: {
                owner: true,
                contributors: true,
            }
        });

        await this.auditService.logAction(ownerId, `Created sanctuary: ${newSanctuary.id}${isAdmin ? '(admin)' : ''}`);
        return newSanctuary;
    }

    async update(id: string, sanctuary: UpdateSanctuaryRequestDto, user?: SignedUserDto, isAdmin: boolean = false): Promise<SanctuaryResponseDto> {
        this.logger.log(`Updating sanctuary: ${id}`);

        if (!isAdmin && !user) {
            throw new Error('User must be provided for non-admin sanctuary updates');
        }

        const existingSanctuary = await this.prisma.client.sanctuary.findUniqueOrThrow({
            where: { id },
            include: {
                owner: true,
                contributors: true,
            }
        });

        const updatedSanctuary = await this.prisma.client.sanctuary.update({
            where: { id },
            data: {
                name: sanctuary.name ?? existingSanctuary.name,
                location: sanctuary.location ?? existingSanctuary.location,
                contributors: sanctuary.contributors ? {
                    set: sanctuary.contributors.map(contributorId => ({ id: contributorId }))
                } : undefined,
            },
            include: {
                owner: true,
                contributors: true,
            }
        });
        return updatedSanctuary;
    }

    async delete(id: string, user: SignedUserDto, isAdmin: boolean = false) {
        this.logger.log(`Deleting sanctuary: ${id}`);

        const existingSanctuary = await this.prisma.client.sanctuary.findUniqueOrThrow({
            where: { id },
        });

        if (!isAdmin && existingSanctuary.ownerId !== user.id) {
            throw new Error('User is not the owner of the sanctuary');
        }

        await this.prisma.client.sanctuary.delete({
            where: { id },
        });

        await this.auditService.logAction(user.id, `Deleted sanctuary: ${id}`);
    }

    async search(query: QueryOptionsDto<SanctuaryResponseDto>): Promise<PaginatedResponse<SanctuaryResponseDto>> {
        this.logger.log(`Searching sanctuaries with query: ${JSON.stringify(query)}`);
        return this.searchService.search<SanctuaryResponseDto>('sanctuary', query);
    }

    async join(sanctuaryId: string, user: SignedUserDto) {
        this.logger.log(`User ${user.id} joining sanctuary: ${sanctuaryId}`);
        await this.prisma.client.sanctuary.update({
            where: { id: sanctuaryId },
            data: {
                contributors: {
                    connect: { id: user.id }
                }
            }
        });
    }

    async leave(sanctuaryId: string, user: SignedUserDto) {
        this.logger.log(`User ${user.id} leaving sanctuary: ${sanctuaryId}`);
        await this.prisma.client.sanctuary.update({
            where: { id: sanctuaryId },
            data: {
                contributors: {
                    disconnect: { id: user.id }
                }
            }
        });
    }
}