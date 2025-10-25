import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/modules/auth.module';
import { UserModule } from './modules/user/modules/user.module';
import { PrismaModule } from './modules/prisma/modules/prisma.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  }, {
    provide: APP_INTERCEPTOR,
    useClass: ZodSerializerInterceptor,
  }],
})
export class AppModule { }
