import { BadRequestException, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ADMIN_AUTH_ROUTES, LoginResponseDto } from '@pawspot/api-contracts';
import { Public } from '../decorators/public.decorator';
import { ZodSerializerDto } from 'nestjs-zod';

@Public()
@Controller(ADMIN_AUTH_ROUTES.ROOT)
export class AuthAdminController {
    constructor(private authService: AuthService) { }

    @ZodSerializerDto(LoginResponseDto)
    @UseGuards(AuthGuard('admin-local'))
    @Post(ADMIN_AUTH_ROUTES.LOGIN)
    async adminLogin(@Request() req): Promise<LoginResponseDto | BadRequestException> {
        return this.authService.login(req.user);
    }
}
