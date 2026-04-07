import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string[]>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRole.includes(user.role);
  }
}
