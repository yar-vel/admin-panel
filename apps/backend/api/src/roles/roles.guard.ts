import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'libs/constants';
import { IRoleConditions } from './roles.types';
import { IFastifyRequestWithUser } from 'src/auth/auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roleConditions = this.reflector.getAllAndOverride<IRoleConditions>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roleConditions) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Partial<IFastifyRequestWithUser>>();

    return Boolean(
      request.user?.roles?.some(
        (role) =>
          role.admin ||
          role.rights?.some(
            (right) =>
              right.resource?.path === roleConditions.path &&
              right[roleConditions.action] === true,
          ),
      ),
    );
  }
}
