import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { IRequestUser, IToken } from './auth.types';
import { cfg } from 'config/configuration';
import { CacheService } from 'src/cache/cache.service';
import { ISession } from '@ap/shared/dist/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private cacheService: CacheService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors<FastifyRequest>([
        (req) => req.cookies['refreshToken'] || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: cfg.tokens.refresh.secret,
    });
  }

  async validate(payload: IToken): Promise<IRequestUser> {
    const session = await this.cacheService.get<ISession>(
      `sessions:${payload.userId}:${payload.sessionId}`,
    );

    if (session?.sign !== payload.sign) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.usersService.getOneProfile(payload.userId);

      return { ...user, sessionId: payload.sessionId };
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
