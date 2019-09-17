import {MigrationInterface, QueryRunner} from "typeorm";

export class createStatusTable1568678777070 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `status` (`id` int NOT NULL AUTO_INCREMENT, `content` text NOT NULL, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NULL, INDEX `IDX_a9316a9d6102bce8ee90f7903d` (`created_at`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `status` ADD CONSTRAINT `FK_89f35d3f89e883fb31272a99ddd` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `status` DROP FOREIGN KEY `FK_89f35d3f89e883fb31272a99ddd`");
        await queryRunner.query("DROP INDEX `IDX_a9316a9d6102bce8ee90f7903d` ON `status`");
        await queryRunner.query("DROP TABLE `status`");
    }

}
