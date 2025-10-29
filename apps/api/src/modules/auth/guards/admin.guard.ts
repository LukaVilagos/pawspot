import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserTypeSchema } from '@pawspot/api-contracts';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const user = (req as any).user;
        return !!user && user.type === UserTypeSchema.enum.ADMIN;
    }
}
