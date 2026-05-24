import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { MAIL_SERVER } from 'libs/constants';
import { IQueuePattern, IQueueResponse } from '@workspace/shared';

@Injectable()
export class QueueService {
  constructor(
    @Inject(MAIL_SERVER)
    private mailClient: ClientProxy,
  ) {}

  async sendEmail<T = unknown>(
    pattern: IQueuePattern,
    payload: T,
  ): Promise<IQueueResponse> {
    try {
      return await firstValueFrom(this.mailClient.send(pattern, payload));
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
