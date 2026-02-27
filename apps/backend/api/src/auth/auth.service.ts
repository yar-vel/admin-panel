import {
  ForbiddenException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { ResourcesService } from 'src/resources/resources.service';
import { RoleEntity } from 'src/roles/role.entity';
import { CacheService } from 'src/cache/cache.service';
import { IRequestUser, IToken, ITokensPair } from './auth.types';
import { QueueService } from 'src/queue/queue.service';
import { createHash, generateCode, verifyHash } from 'libs/utils';
import { cfg } from 'config/configuration';
import { getT } from '@ap/shared/dist/locales';
import {
  IEmailCode,
  IForgotPassword,
  IResetPassword,
  ISession,
  ISignIn,
  IUser,
  IVerifyUser,
  TResourceCreate,
  TSignUp,
} from '@ap/shared/dist/types';

@Injectable()
export class AuthService {
  constructor(
    private queueService: QueueService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private resourcesService: ResourcesService,
    private cacheService: CacheService,
  ) {}

  async checkDefaultData(): Promise<RoleEntity> {
    // Verify the existence of the Administrator Role
    const adminRole = await this.rolesService.findOrCreateDefault({
      name: 'Administrator',
      description: getT().defaultAdminRole,
      admin: true,
    });

    // Verify the existence of the User Role
    const userRole = await this.rolesService.findOrCreateDefault({
      name: 'User',
      description: getT().defaultUserRole,
    });

    // Verify the existence of the Default Resources
    const defaultResources = await this.resourcesService
      .getList({ default: true })
      .then((result) => result.rows);

    const missingResources: TResourceCreate[] = [
      'profile',
      'users',
      'roles',
      'resources',
    ]
      .filter(
        (value) =>
          !defaultResources.some((resource) => resource.path === value),
      )
      .map((value) => {
        return {
          path: value,
          name: value.replace(value[0], value[0].toUpperCase()),
          description: getT().defaultResource,
          enabled: true,
        };
      });

    const createdResources =
      await this.resourcesService.createManyDefault(missingResources);

    // Open the Profile Resource for the User Role
    if (!userRole.rights?.some((right) => right.resource?.path === 'profile')) {
      const profileResource = createdResources
        .concat(defaultResources)
        .find((resource) => resource.path === 'profile');

      if (profileResource) {
        await this.rolesService.updateRights(
          userRole.id,
          [
            {
              roleId: userRole.id,
              resourceId: profileResource.id,
              creating: false,
              reading: true,
              updating: true,
              deleting: true,
            },
          ],
          true,
        );
      }
    }

    // Verify the existence of the Administrator Users
    const adminUsers = await this.usersService.countByRole(adminRole.id);

    return adminUsers === 0 ? adminRole : userRole;
  }

  async signUp(fields: TSignUp): Promise<IUser> {
    const defaultRole = await this.checkDefaultData();
    return this.usersService.create({ ...fields, enabled: true }, [
      defaultRole,
    ]);
  }

  async forgotPassword(fields: IForgotPassword): Promise<void> {
    const code = generateCode();
    await this.usersService.updateResetPasswordCode(fields.email, code);
    this.queueService.sendEmail<IEmailCode>(
      { cmd: cfg.rmq.cmd.forgotPassword },
      { email: fields.email, code },
    );
  }

  async resetPassword(fields: IResetPassword): Promise<void> {
    await this.usersService.updatePasswordWithCode(
      fields.email,
      fields.code,
      fields.password,
    );
  }

  async createTokens(
    payload: IToken,
    sessionTtl: number,
  ): Promise<ITokensPair> {
    const accessPayload = { ...payload };
    delete accessPayload.sign;

    return {
      accessToken: await this.jwtService.signAsync(accessPayload, {
        secret: cfg.tokens.access.secret,
        expiresIn: cfg.tokens.access.lifetime,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: cfg.tokens.refresh.secret,
        expiresIn: sessionTtl,
      }),
    };
  }

  async validateUser(fields: ISignIn): Promise<IUser | false> {
    try {
      const user: IUser = await this.usersService.getOneAuth(fields.username);

      if (
        !user.password ||
        !(await verifyHash(user.password, fields.password))
      ) {
        return false;
      }

      return user;
    } catch {
      return false;
    }
  }

  async signIn(
    user: IUser,
    sessionTtl: number,
    ip: string,
    userAgent?: string,
  ): Promise<ITokensPair> {
    if (!user.enabled) {
      throw new GoneException();
    }

    if (!user.verified) {
      if (user.email) {
        const code = generateCode();
        await this.usersService.updateVerificationCode(user.email, code);
        this.queueService.sendEmail<IEmailCode>(
          { cmd: cfg.rmq.cmd.registration },
          { email: user.email, code },
        );
      }

      throw new ForbiddenException();
    }

    const sessionId = uuidv4();
    const sign = await createHash();
    const sessionData: ISession = {
      ip,
      userAgent,
      updatedAt: new Date(),
      sign,
    };

    await this.cacheService.set(
      `sessions:${user.id}:${sessionId}`,
      sessionData,
      sessionTtl * 1000,
    );

    return this.createTokens({ userId: user.id, sessionId, sign }, sessionTtl);
  }

  async verifyUser(fields: IVerifyUser): Promise<void> {
    await this.usersService.updateVerificationStatus(fields.email, fields.code);
  }

  async signInGoogle(
    googleAccessToken: string,
    sessionTtl: number,
    ip: string,
    userAgent?: string,
  ): Promise<ITokensPair & { user: IUser }> {
    let googleUser: Record<string, string> | null = null;

    try {
      const googleRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleAccessToken}`,
      );
      googleUser = (await googleRes.json()) as Record<string, string>;

      if (!googleUser || !googleUser['id'] || !googleUser['name']) {
        throw new Error();
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    const defaultRole = await this.checkDefaultData();
    const user = await this.usersService.createByGoogle(
      { googleId: googleUser['id'], name: googleUser['name'] },
      [defaultRole],
    );

    return {
      ...(await this.signIn(user, sessionTtl, ip, userAgent)),
      user,
    };
  }

  async refresh(
    user: IRequestUser,
    sessionTtl: number,
    ip: string,
    userAgent?: string,
  ): Promise<ITokensPair> {
    const sign = await createHash();
    const sessionData: ISession = {
      ip,
      userAgent,
      updatedAt: new Date(),
      sign,
    };

    await this.cacheService.set(
      `sessions:${user.id}:${user.sessionId}`,
      sessionData,
      sessionTtl * 1000,
    );

    return this.createTokens(
      { userId: user.id, sessionId: user.sessionId, sign },
      sessionTtl,
    );
  }

  async signOut(user: IRequestUser): Promise<void> {
    await this.cacheService.del(`sessions:${user.id}:${user.sessionId}`);
  }
}
