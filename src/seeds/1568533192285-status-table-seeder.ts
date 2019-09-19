import { MigrationInterface, QueryRunner } from 'typeorm';
import { Status } from '../statuses/status.entity';
import { User } from '../users/user.entity';
import * as faker from 'faker';

export class statusTableSeeder1568533192285 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = queryRunner.manager.getRepository(User);
    const statusRepository = queryRunner.manager.getRepository(Status);
    for (let i = 0; i < 100; i++) {
      const userId = 1 + ~~(Math.random() * 3); // [1, 3]
      const status = new Status();
      status.content = faker.lorem.paragraph();
      status.user = await userRepository.findOne(userId);
      await statusRepository.save(status);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.clearTable('status');
  }
}
