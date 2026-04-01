import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MAIL_SERVER } from 'libs/constants';
import { IQueuePattern } from '@workspace/shared';

@Injectable()
export class QueueService {
  constructor(
    @Inject(MAIL_SERVER)
    private mailClient: ClientProxy,
  ) {}

  sendEmail<T = Record<string, unknown>>(
    pattern: IQueuePattern,
    payload: T,
  ): void {
    try {
      this.mailClient.send<IQueuePattern, T>(pattern, payload).subscribe();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
