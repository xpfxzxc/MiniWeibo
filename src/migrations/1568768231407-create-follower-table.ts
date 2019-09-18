import {MigrationInterface, QueryRunner} from "typeorm";

export class createFollowerTable1568768231407 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `follower` (`user_id` int NOT NULL, `follower_id` int NOT NULL, INDEX `IDX_6a78a9c6f866dcc0b9195a5420` (`user_id`), INDEX `IDX_c39c716bcdda7f17adcfe4643a` (`follower_id`), PRIMARY KEY (`user_id`, `follower_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `follower` ADD CONSTRAINT `FK_6a78a9c6f866dcc0b9195a54202` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `follower` ADD CONSTRAINT `FK_c39c716bcdda7f17adcfe4643ad` FOREIGN KEY (`follower_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `follower` DROP FOREIGN KEY `FK_c39c716bcdda7f17adcfe4643ad`");
        await queryRunner.query("ALTER TABLE `follower` DROP FOREIGN KEY `FK_6a78a9c6f866dcc0b9195a54202`");
        await queryRunner.query("DROP INDEX `IDX_c39c716bcdda7f17adcfe4643a` ON `follower`");
        await queryRunner.query("DROP INDEX `IDX_6a78a9c6f866dcc0b9195a5420` ON `follower`");
        await queryRunner.query("DROP TABLE `follower`");
    }

}
