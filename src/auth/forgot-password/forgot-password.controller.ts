import {
  Controller,
  Render,
  Get,
  Post,
  Body,
  UseFilters,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CSRFToken } from '../../common/decorators/csrf-token.decorator';
import { Flash } from '../../common/decorators/flash.decorator';
import { ForgotPasswordService } from './forgot-password.service';
import { SendResetLinkEmailDto } from './dto/send-reset-link-email.dto';
import { ValidationFeedbackPipe } from '../../common/pipes/validation-feedback.pipe';
import { ValidationExceptionFilter } from '../../common/filters/validation-exception.filter';
import { CaptchaGuard } from '../../common/guards/captcha.guard';

@Controller('password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Get('reset')
  @Render('auth/passwords/email.html')
  showLinkRequestForm(
    @CSRFToken() csrfToken: string,
    @Flash('msg') msg: object,
    @Flash('errors') errors,
    @Flash('old') old,
  ) {
    return {
      csrfToken,
      msg,
      errors,
      old,
    };
  }

  @UseGuards(CaptchaGuard)
  @UseFilters(new ValidationExceptionFilter())
  @Post('email')
  async sendResetLinkEmail(
    @Body(ValidationFeedbackPipe) sendResetLinkEmailDto: SendResetLinkEmailDto,
    @Request() request,
    @Res() response,
  ) {
    if (
      await this.forgotPasswordService.attemptToSendLinkEmail(
        sendResetLinkEmailDto,
        request.protocol,
        request.get('host'),
      )
    ) {
      request.flash('msg', { success: '密码重置邮件已发送，请查收！' });
    } else {
      request.flash('msg', {
        warning: '密码重置邮件已发送。如果未收到，请稍后再试。',
      });
    }
    response.redirect('back');
  }
}
