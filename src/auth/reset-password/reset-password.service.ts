import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordReset } from '../password-reset.entity';
import { Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly usersService: UsersService,
  ) {}

  async exists(token: string): Promise<boolean> {
    return !!(await this.passwordResetRepository.findOne({ token }));
  }

  async attemptToResetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    const { email, token, password } = resetPasswordDto;
    const passwordReset = await this.passwordResetRepository.findOne({
      email,
      token,
    });

    if (!passwordReset) {
      return false;
    }

    await this.passwordResetRepository.remove(passwordReset);
    await this.usersService.updateUserByEmail(email, password);
    return true;
  }
}
