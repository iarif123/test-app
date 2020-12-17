import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { BlueprintStatus } from "../enums";

// TODO: this is just a placeholder, please update for appropriate ticket
@Entity()
export class Blueprint {
  public static readonly RELATIONS = [];

  @PrimaryColumn()
  public id: string;

  @Column()
  public flyerHashedKey: string;

  @Column({ default: 1 })
  public version: number;

  @Column()
  public flyerId: number;

  @Column()
  public s3Bucket: string;

  @Column()
  public s3Key: string;

  @Column()
  public runId: string;

  @Column()
  public segmentId: string;

  @Column()
  public storeId: number;

  @Column()
  public status: BlueprintStatus;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
