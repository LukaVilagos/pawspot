import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ADMIN_USER_ROUTES,
  UserResponseDto,
  UsersListResponseDto,
} from '@pawspot/api-contracts';
import { UserService } from '../services/user.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller(ADMIN_USER_ROUTES.NORMAL_ROOT)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ZodSerializerDto(UsersListResponseDto)
  @Get()
  async getUser(): Promise<UsersListResponseDto> {
    return this.userService.getUser();
  }

  @ZodSerializerDto(UserResponseDto)
  @UseGuards(AuthGuard)
  @Get(ADMIN_USER_ROUTES.BY_ID)
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }
}
