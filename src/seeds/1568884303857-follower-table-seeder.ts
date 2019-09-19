import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../users/user.entity';
import { Follower } from '../followers/follower.entity';

export class followerTableSeeder1568884303857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = queryRunner.manager.getRepository(User);
    const followerRepository = queryRunner.manager.getRepository(Follower);

    const users = await userRepository.find();
    const user = users[0];
    const followers = users.slice(1);

    for (const follower of followers) {
      let followerRow = new Follower();
      followerRow.user = user;
      followerRow.follower = follower;
      await followerRepository.save(followerRow);

      followerRow = new Follower();
      followerRow.user = follower;
      followerRow.follower = user;
      await followerRepository.save(followerRow);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.clearTable('follower');
  }
}
