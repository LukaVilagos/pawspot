import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserModule } from 'src/user/modules/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule],
})
export class AuthModule { }
