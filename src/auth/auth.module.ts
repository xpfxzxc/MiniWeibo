import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { ResetPasswordController } from './reset-password/reset-password.controller';
import { ForgotPasswordController } from './forgot-password/forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './password-reset.entity';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { ResetPasswordService } from './reset-password/reset-password.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([PasswordReset]),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, ForgotPasswordService, ResetPasswordService],
  controllers: [
    AuthController,
    ResetPasswordController,
    ForgotPasswordController,
  ],
})
export class AuthModule {}
