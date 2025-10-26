import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { SearchService } from '../services/search.service';

@Global()
@Module({
    providers: [PrismaService, SearchService],
    exports: [PrismaService, SearchService],
})
export class PrismaModule { }