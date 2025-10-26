import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import {
  USER_ROUTES,
  UserResponseDto,
  UsersListResponseDto,
} from '@pawspot/api-contracts';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller(USER_ROUTES.ROOT)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUser(): Promise<UsersListResponseDto> {
    return this.userService.getUser();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(USER_ROUTES.BY_ID)
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(USER_ROUTES.DELETE)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
