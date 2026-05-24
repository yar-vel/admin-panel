import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { cfg } from 'config/configuration';
import { ETemplates } from 'libs/constants';
import { getT } from '@workspace/shared';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async registration(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: cfg.smtp.from,
        subject: getT().subjectRegistration,
        template: ETemplates.Registration,
        context: {
          host: cfg.host,
          title: getT().subjectRegistration,
          action: getT().verificationCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (cfg.smtp.test) {
        Logger.log(code);
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async forgotPassword(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: cfg.smtp.from,
        subject: getT().subjectForgotPassword,
        template: ETemplates.ForgotPassword,
        context: {
          host: cfg.host,
          title: getT().subjectForgotPassword,
          action: getT().resetPasswordCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (cfg.smtp.test) {
        Logger.log(code);
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async changeEmail(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: cfg.smtp.from,
        subject: getT().subjectChangeEmail,
        template: ETemplates.ChangeEmail,
        context: {
          host: cfg.host,
          title: getT().subjectChangeEmail,
          action: getT().changeEmailCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (cfg.smtp.test) {
        Logger.log(code);
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
