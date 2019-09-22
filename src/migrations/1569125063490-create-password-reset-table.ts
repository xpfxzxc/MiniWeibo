import {MigrationInterface, QueryRunner} from "typeorm";

export class createPasswordResetTable1569125063490 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `password_reset` (`email` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_36e929b98372d961bb63bd4b4e` (`token`), PRIMARY KEY (`email`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_36e929b98372d961bb63bd4b4e` ON `password_reset`");
        await queryRunner.query("DROP TABLE `password_reset`");
    }

}
