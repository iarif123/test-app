import { MigrationInterface, QueryRunner } from "typeorm";
import { createTablesSequence, dropTablesSequence } from "../scripts";

export class RecreateDb1585935761571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this.dropTables(queryRunner);
    await this.createTables(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await this.dropTables(queryRunner);
  }

  private async dropTables(queryRunner: QueryRunner): Promise<void> {
    for (const script of dropTablesSequence) {
      await queryRunner.query(script.drop);
    }
  }

  private async createTables(queryRunner: QueryRunner): Promise<void> {
    for (const script of createTablesSequence) {
      await queryRunner.query(script.create);
    }
  }
}
