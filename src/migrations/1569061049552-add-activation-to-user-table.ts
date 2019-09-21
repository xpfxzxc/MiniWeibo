import {MigrationInterface, QueryRunner} from "typeorm";

export class addActivationToUserTable1569061049552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `activation_token` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `activated` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `activated`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `activation_token`");
    }

}
