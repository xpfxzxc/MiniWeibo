import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session/session.entity';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Session) private readonly session: Repository<Session>,
    private readonly config: ConfigService,
  ) {}

  get sessionRepository() {
    return this.session;
  }

  get configService() {
    return this.config;
  }
}
