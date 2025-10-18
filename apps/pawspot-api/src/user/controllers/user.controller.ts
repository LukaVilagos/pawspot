import { Controller, Get, Param } from '@nestjs/common';
import { USER_ROUTES, UserResponseDto, UsersListResponseDto } from '@pawspot/api-contracts';
import { UserService } from 'src/user/services/user.service';

@Controller(USER_ROUTES.ROOT)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getUser(): Promise<UsersListResponseDto> {
        return this.userService.getUser();
    }

    @Get(USER_ROUTES.BY_ID)
    async getUserById(@Param('id') id: string): Promise<UserResponseDto | null> {
        return this.userService.getUserById(id);
    }
}
