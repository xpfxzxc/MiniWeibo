import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../users/user.entity';

export class followerTableSeeder1568766291867 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = queryRunner.manager.getRepository(User);

    const users = await userRepository.find();
    const user = users[0];

    const followers = users.slice(1);

    user.followers = followers;
    followers.forEach(follower => (follower.followers = [user]));

    userRepository.save(user);
    userRepository.save(followers);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.clearTable('follower');
  }
}
