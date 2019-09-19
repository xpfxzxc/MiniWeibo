import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Session } from './session/session.entity';
import { AuthModule } from './auth/auth.module';
import { RedirectIfAuthenticatedMiddleware } from './common/middlewares/redirect-if-authenticated.middleware';
import { StatusesModule } from './statuses/statuses.module';
import { FollowersModule } from './followers/followers.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database')[0],
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Session]),
    UsersModule,
    AuthModule,
    StatusesModule,
    FollowersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RedirectIfAuthenticatedMiddleware)
      .forRoutes(
        { path: 'register', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.POST },
        'login',
      );
  }
}
