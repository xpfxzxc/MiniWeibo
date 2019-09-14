import {MigrationInterface, QueryRunner} from "typeorm";

export class createSessionTable1568430424395 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `session` (`expiredAt` bigint NOT NULL, `id` varchar(255) NOT NULL, `json` text NOT NULL, INDEX `IDX_28c5d1d16da7908c97c9bc2f74` (`expiredAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_28c5d1d16da7908c97c9bc2f74` ON `session`");
        await queryRunner.query("DROP TABLE `session`");
    }

}
