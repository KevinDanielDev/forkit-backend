import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { User } from '../entities/user.entity';

import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoles } from 'src/common/models/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Can activate
   * @param context
   * @returns boolean
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<ERoles[]>(Roles, context.getHandler());

    if (!roles) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const user = req['user'] as User;

    return this.matchRoles(roles, user.roles as ERoles[]);
  }

  /**
   * Match roles
   * @param requiredRoles
   * @param userRoles
   * @returns boolean
   */
  private matchRoles(requiredRoles: ERoles[], userRoles: ERoles[]) {
    return userRoles.some((role) => requiredRoles.includes(role));
  }
}
