import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/modules/auth.module';
import { UserModule } from './modules/user/modules/user.module';
import { PrismaModule } from './modules/prisma/modules/prisma.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AuditModule } from './modules/audit/modules/audit.module';
import { SanctuaryModule } from './modules/sanctuary/modules/sanctuary.module';
import { AnimalModule } from './modules/animal/modules/animal.module';
import { PostModule } from './modules/post/modules/post.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DateFormatInterceptor } from './common/interceptors/date-format.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    AuditModule,
    SanctuaryModule,
    AnimalModule,
    PostModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  }, {
    provide: APP_INTERCEPTOR,
    useClass: DateFormatInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ZodSerializerInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
})
export class AppModule { }
