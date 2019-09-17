import {
  Controller,
  Post,
  Body,
  UseFilters,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { ValidationFeedbackPipe } from '../common/pipes/validation-feedback.pipe';
import { StoreStatusDto } from './dto/store-status.dto';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';
import { User as UserEntity } from '../users/user.entity';
import { User } from '../common/decorators/user.decorator';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @UseGuards(AuthenticatedGuard)
  @UseFilters(new ValidationExceptionFilter({ includes: ['content'] }))
  @Post()
  async store(
    @Body(ValidationFeedbackPipe) storeStatusDto: StoreStatusDto,
    @User() user: UserEntity,
    @Request() request,
    @Res() response,
  ) {
    await this.statusesService.store(user, storeStatusDto);
    request.flash('msg', { success: '发布成功！' });
    response.redirect(request.header('Referer'));
  }
}
