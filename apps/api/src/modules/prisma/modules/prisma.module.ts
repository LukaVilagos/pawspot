import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { PrismaQueryBuilderService } from '../services/prisma-query-builder.service';

@Global()
@Module({
    providers: [PrismaService, PrismaQueryBuilderService],
    exports: [PrismaService, PrismaQueryBuilderService],
})
export class PrismaModule { }