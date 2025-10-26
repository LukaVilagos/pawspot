import { Controller, Delete, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
  USER_ROUTES,
  UserResponseDto,
  UsersListResponseDto,
} from '@pawspot/api-contracts';
import { UserService } from '../services/user.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller(USER_ROUTES.ROOT)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUser(): Promise<UsersListResponseDto> {
    return this.userService.getUser();
  }

  @UseGuards(AuthGuard)
  @Get(USER_ROUTES.BY_ID)
  async getUserById(@Param('id') id: string, @Req() req: Request): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Post(USER_ROUTES.CREATE)
  async createUser(@Param() user: any): Promise<UserResponseDto> {
    return this.userService.createUser(user);
  }

  @UseGuards(AuthGuard)
  @Delete(USER_ROUTES.DELETE)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
