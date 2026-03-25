import { ConflictException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CacheService } from 'src/cache/cache.service';
import { QueueService } from 'src/queue/queue.service';
import { generateCode, verifyHash } from 'libs/utils';
import { cfg } from 'config/configuration';
import {
  IChangeEmailConfirm,
  IChangeEmailRequest,
  IEmailCode,
  ISession,
  IUpdatePassword,
  TSessionExternal,
  TUserUpdate,
} from '@workspace/shared/dist/types';

@Injectable()
export class ProfileService {
  constructor(
    private queueService: QueueService,
    private usersService: UsersService,
    private cacheService: CacheService,
  ) {}

  async updateProfile(userId: string, fields: TUserUpdate): Promise<void> {
    await this.usersService.updateFields(userId, fields);
  }

  async updatePassword(userId: string, fields: IUpdatePassword): Promise<void> {
    const user = await this.usersService.getOneFlat(userId);

    if (
      user.password &&
      (!fields.oldPassword ||
        !(await verifyHash(user.password, fields.oldPassword)))
    ) {
      throw new ConflictException();
    }

    await this.usersService.updatePassword(userId, fields.newPassword);
  }

  async changeEmailRequest(
    userId: string,
    fields: IChangeEmailRequest,
  ): Promise<void> {
    const code = generateCode();
    await this.usersService.updateChangeEmailCode(
      userId,
      code,
      fields.newEmail,
    );
    this.queueService.sendEmail<IEmailCode>(
      { cmd: cfg.rmq.cmd.changeEmail },
      { email: fields.newEmail, code },
    );
  }

  async changeEmailConfirm(
    userId: string,
    fields: IChangeEmailConfirm,
  ): Promise<void> {
    await this.usersService.updateEmailWithCode(userId, fields.code);
  }

  async getSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<TSessionExternal[]> {
    const keys = await this.cacheService.keys(`sessions:${userId}:*`);
    const current = `sessions:${userId}:${currentSessionId}`;
    const sessions = await this.cacheService
      .mget<ISession>(keys)
      .then((result) =>
        result.map((session, index) => ({
          ...session,
          id: keys[index],
          current: current === keys[index],
        })),
      );
    return sessions;
  }

  async deleteSessions(userId: string, sessions: string[]): Promise<void> {
    const keys = await this.cacheService.keys(`sessions:${userId}:*`);
    await this.cacheService.mdel(sessions.filter((key) => keys.includes(key)));
  }
}
