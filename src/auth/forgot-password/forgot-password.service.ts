import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PasswordReset } from '../password-reset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendResetLinkEmailDto } from './dto/send-reset-link-email.dto';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly mailerService: MailerService,
  ) {}

  async attemptToSendLinkEmail(
    sendResetLinkEmailDto: SendResetLinkEmailDto,
    urlProtocol: string,
    urlHost: string,
  ): Promise<boolean> {
    let passwordReset = await this.passwordResetRepository.findOne({
      email: sendResetLinkEmailDto.email,
    });

    if (
      passwordReset &&
      Date.now() - passwordReset.updatedAt.getTime() < 1000 * 60 * 3
    ) {
      return false;
    }

    passwordReset = passwordReset || new PasswordReset();
    passwordReset.email = sendResetLinkEmailDto.email;
    passwordReset.token = Math.random()
      .toString(36)
      .slice(2);
    await this.passwordResetRepository.save(passwordReset);

    await this.mailerService.sendMail({
      to: passwordReset.email,
      subject: '感谢使用 Mini Weibo 应用！请确认你的邮箱',
      template: 'password-reset',
      context: {
        protocol: urlProtocol,
        host: urlHost,
        token: passwordReset.token,
      },
    });

    return true;
  }
}
