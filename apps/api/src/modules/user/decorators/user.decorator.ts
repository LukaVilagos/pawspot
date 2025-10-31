import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SignedUserDto } from '@pawspot/api-contracts';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): SignedUserDto => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as SignedUserDto;
    },
);