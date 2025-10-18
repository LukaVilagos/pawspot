import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) { }
}
