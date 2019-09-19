import {
  Controller,
  Post,
  Body,
  UseFilters,
  Request,
  Res,
  UseGuards,
  Param,
  ParseIntPipe,
  Delete,
  ForbiddenException,
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
    response.redirect('back');
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async destroy(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
    @Res() response,
  ) {
    if (user.id !== (await this.statusesService.getUserIdOf(id))) {
      throw new ForbiddenException();
    }

    if (await this.statusesService.destroy(id)) {
      request.flash('msg', { success: '微博已被成功删除！' });
    }
    response.redirect('back');
  }
}
