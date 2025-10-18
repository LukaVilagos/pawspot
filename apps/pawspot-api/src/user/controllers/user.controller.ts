import { Controller, Get } from '@nestjs/common';
import { USER_ROUTES, UsersListResponseDto } from '@pawspot/api-contracts';
import { UserService } from 'src/user/services/user.service';

@Controller(USER_ROUTES.ROOT)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getUser(): Promise<UsersListResponseDto> {
        return this.userService.getUser();
    }
}
