import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUserDto, UserResponseDto, UserTypeSchema } from '@pawspot/api-contracts';
import { Strategy } from "passport-local";
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string): Promise<AuthUserDto> {
        const user = await this.authService.validateUser(email, password);
        if (!user || user.type === UserTypeSchema.enum.ADMIN) {
            throw new UnauthorizedException();
        }
        return user;
    }
}