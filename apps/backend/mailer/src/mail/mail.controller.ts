import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

import { EmailCodeDto } from './dto/email-code.dto';
import { EQueueCmd, IQueuePattern, IQueueResponse } from '@workspace/shared';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern<IQueuePattern>({ cmd: EQueueCmd.Health })
  handlePing(@Payload() _: unknown, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;
    channel.ack(originalMsg);
    return { pong: true };
  }

  @MessagePattern<IQueuePattern>({ cmd: EQueueCmd.Registration })
  async registration(
    @Payload() emailCodeDto: EmailCodeDto,
    @Ctx() context: RmqContext,
  ): Promise<IQueueResponse> {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    try {
      await this.mailService.registration(
        emailCodeDto.email,
        emailCodeDto.code,
      );
      channel.ack(originalMsg);
      return { success: true };
    } catch (error) {
      Logger.error(error);
      channel.nack(originalMsg, false, true);
      return { success: false };
    }
  }

  @MessagePattern<IQueuePattern>({ cmd: EQueueCmd.ForgotPassword })
  async forgotPassword(
    @Payload() emailCodeDto: EmailCodeDto,
    @Ctx() context: RmqContext,
  ): Promise<IQueueResponse> {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    try {
      await this.mailService.forgotPassword(
        emailCodeDto.email,
        emailCodeDto.code,
      );
      channel.ack(originalMsg);
      return { success: true };
    } catch (error) {
      Logger.error(error);
      channel.nack(originalMsg, false, true);
      return { success: false };
    }
  }

  @MessagePattern<IQueuePattern>({ cmd: EQueueCmd.ChangeEmail })
  async changeEmail(
    @Payload() emailCodeDto: EmailCodeDto,
    @Ctx() context: RmqContext,
  ): Promise<IQueueResponse> {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    try {
      await this.mailService.changeEmail(emailCodeDto.email, emailCodeDto.code);
      channel.ack(originalMsg);
      return { success: true };
    } catch (error) {
      Logger.error(error);
      channel.nack(originalMsg, false, true);
      return { success: false };
    }
  }
}
