import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_ROUTES, LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from '@pawspot/api-contracts';
import { Public } from '../decorators/public.decorator';

@Public()
@Controller(AUTH_ROUTES.ROOT)
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post(AUTH_ROUTES.LOGIN)
    async login(@Request() req): Promise<LoginResponseDto | BadRequestException> {
        const response = await this.authService.login(req.user);
        return response;
    }

    @Post(AUTH_ROUTES.REGISTER)
    async register(@Body() registerBody: RegisterRequestDto): Promise<RegisterResponseDto | BadRequestException> {
        return this.authService.register(registerBody);
    }
}
