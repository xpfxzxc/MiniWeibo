import {
  Controller,
  Get,
  Render,
  Param,
  Post,
  Body,
  UseFilters,
  Request,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CSRFToken } from '../../common/decorators/csrf-token.decorator';
import { Flash } from '../../common/decorators/flash.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidationFeedbackPipe } from '../../common/pipes/validation-feedback.pipe';
import { ValidationExceptionFilter } from '../../common/filters/validation-exception.filter';
import { ResetPasswordService } from './reset-password.service';

@Controller('password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Get('reset/:token')
  @Render('auth/passwords/reset.html')
  async showResetForm(
    @Param('token') token: string,
    @CSRFToken() csrfToken: string,
    @Flash('errors') errors,
    @Flash('old') old,
  ) {
    if (!(await this.resetPasswordService.exists(token))) {
      throw new NotFoundException();
    }

    return {
      csrfToken,
      token,
      errors,
      old,
    };
  }

  @UseFilters(
    new ValidationExceptionFilter({
      includes: ['email'],
    }),
  )
  @Post('reset')
  async reset(
    @Body(ValidationFeedbackPipe) resetPasswordDto: ResetPasswordDto,
    @Request() request,
    @Res() response,
  ) {
    if (
      await this.resetPasswordService.attemptToResetPassword(resetPasswordDto)
    ) {
      request.flash('msg', { success: '重置密码成功！' });
      response.redirect('/login');
    } else {
      throw new BadRequestException('您输入的邮箱地址不正确');
    }
  }
}
