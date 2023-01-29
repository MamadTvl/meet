import { MigrationInterface, QueryRunner } from "typeorm";

export class init1675013318499 implements MigrationInterface {
    name = 'init1675013318499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` tinytext NULL, \`type\` enum ('MEDIA', 'TEXT') NOT NULL, \`room_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rooms\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('ONLINE', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE', \`user_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role_id\` int NULL, \`room_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` enum ('ADMIN', 'ROOM') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8d506831701074570212ee8c43\` (\`name\`, \`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`access_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`expires_at\` datetime NULL, \`deleted_at\` datetime NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NULL, \`last_name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_has_permissions\` (\`permission_id\` int NOT NULL, \`role_id\` int NOT NULL, INDEX \`IDX_09ff9df62bd01f8cf45b1b1921\` (\`permission_id\`), INDEX \`IDX_9135e97d2d840f7dfd6e664911\` (\`role_id\`), PRIMARY KEY (\`permission_id\`, \`role_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_has_roles\` (\`role_id\` int NOT NULL, \`user_id\` int NOT NULL, INDEX \`IDX_51a4a8f3129cb25302996edc2b\` (\`role_id\`), INDEX \`IDX_5e40709b8abf6d02eb8f200c43\` (\`user_id\`), PRIMARY KEY (\`role_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_1dda4fc8dbeeff2ee71f0088ba0\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_b2d15baf5b46ed9659bd71fbb43\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_9153855b6990c4d6167d74724aa\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_e6cf45f179a524427ddf8bacd8e\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`access_tokens\` ADD CONSTRAINT \`FK_09ee750a035b06e0c7f0704687e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` ADD CONSTRAINT \`FK_09ff9df62bd01f8cf45b1b1921a\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` ADD CONSTRAINT \`FK_9135e97d2d840f7dfd6e6649116\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_has_roles\` ADD CONSTRAINT \`FK_51a4a8f3129cb25302996edc2b1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_has_roles\` ADD CONSTRAINT \`FK_5e40709b8abf6d02eb8f200c43f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_has_roles\` DROP FOREIGN KEY \`FK_5e40709b8abf6d02eb8f200c43f\``);
        await queryRunner.query(`ALTER TABLE \`users_has_roles\` DROP FOREIGN KEY \`FK_51a4a8f3129cb25302996edc2b1\``);
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` DROP FOREIGN KEY \`FK_9135e97d2d840f7dfd6e6649116\``);
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` DROP FOREIGN KEY \`FK_09ff9df62bd01f8cf45b1b1921a\``);
        await queryRunner.query(`ALTER TABLE \`access_tokens\` DROP FOREIGN KEY \`FK_09ee750a035b06e0c7f0704687e\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_e6cf45f179a524427ddf8bacd8e\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_9153855b6990c4d6167d74724aa\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_b2d15baf5b46ed9659bd71fbb43\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_1dda4fc8dbeeff2ee71f0088ba0\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e40709b8abf6d02eb8f200c43\` ON \`users_has_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_51a4a8f3129cb25302996edc2b\` ON \`users_has_roles\``);
        await queryRunner.query(`DROP TABLE \`users_has_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_9135e97d2d840f7dfd6e664911\` ON \`role_has_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_09ff9df62bd01f8cf45b1b1921\` ON \`role_has_permissions\``);
        await queryRunner.query(`DROP TABLE \`role_has_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`access_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_8d506831701074570212ee8c43\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
        await queryRunner.query(`DROP TABLE \`room_members\``);
        await queryRunner.query(`DROP TABLE \`rooms\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
    }

}
