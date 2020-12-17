import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Merchant {
  @PrimaryColumn()
  public id: number;

  @Column({ length: 155 })
  public name: string;

  @Column({ length: 255 })
  public description: string;

  @Column()
  public deleted: boolean;

  @Column({ name: "is_digital" })
  public isDigital: boolean;

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;
}
