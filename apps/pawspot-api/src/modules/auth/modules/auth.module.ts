import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserModule } from 'src/modules/user/modules/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: process.env.JWT_SECRET || 'defaultSecret', signOptions: {
        expiresIn: 3600,
      },
    }),
    inject: [ConfigService],
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
