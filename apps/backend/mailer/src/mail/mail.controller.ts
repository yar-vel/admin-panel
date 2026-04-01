import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EmailCodeDto } from './dto/email-code.dto';
import { cfg } from 'config/configuration';
import { IQueuePattern } from '@workspace/shared';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern<IQueuePattern>({ cmd: 'ping_pattern' })
  handlePing() {
    return { pong: true };
  }

  @MessagePattern<IQueuePattern>({ cmd: cfg.rmq.cmd.registration })
  registration(@Payload() emailCodeDto: EmailCodeDto) {
    return this.mailService.registration(emailCodeDto.email, emailCodeDto.code);
  }

  @MessagePattern<IQueuePattern>({ cmd: cfg.rmq.cmd.forgotPassword })
  forgotPassword(@Payload() emailCodeDto: EmailCodeDto) {
    return this.mailService.forgotPassword(
      emailCodeDto.email,
      emailCodeDto.code,
    );
  }

  @MessagePattern<IQueuePattern>({ cmd: cfg.rmq.cmd.changeEmail })
  changeEmail(@Payload() emailCodeDto: EmailCodeDto) {
    return this.mailService.changeEmail(emailCodeDto.email, emailCodeDto.code);
  }
}
