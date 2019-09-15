import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../users/user.entity';
import * as faker from 'faker';

export class userTableSeeder1568433979902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = queryRunner.manager.getRepository(User);
    const users: User[] = [];
    for (let i = 0; i < 50; i++) {
      const user = new User();
      user.name = faker.name.firstName() + ' ' + faker.name.lastName();
      user.email = faker.internet.email();
      user.password = '123456';
      users.push(user);
    }
    await userRepository.save(users);

    const firstUser = await userRepository.findOne(1);
    firstUser.name = 'Axion';
    firstUser.email = 'axion@example.com';
    await userRepository.save(firstUser);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.clearTable('user');
  }
}
