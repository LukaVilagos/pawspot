import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { USER_ROUTES, UserResponseDto, UsersListResponseDto } from '@pawspot/api-contracts';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller(USER_ROUTES.ROOT)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getUser(): Promise<UsersListResponseDto> {
        return this.userService.getUser();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(USER_ROUTES.BY_ID)
    async getUserById(@Param('id') id: string, @Req() req: Request): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }
}
