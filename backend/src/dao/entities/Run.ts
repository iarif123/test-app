import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { RunStatus } from "../enums";

@Entity()
export class Run {
  public static readonly RELATIONS = [];

  @PrimaryColumn()
  public id: string;

  @Column({ name: "storefront_id" })
  public storefrontId: string;

  @Column({ name: "valid_from" })
  public validFrom: Date;

  @Column({ name: "valid_to" })
  public validTo: Date;

  @Column({ name: "available_from" })
  public availableFrom: Date;

  @Column({ name: "available_to" })
  public availableTo: Date;

  @Column({ default: 1 })
  public version: number;

  @Column({ name: "snicket_key", length: 60 })
  public snicketKey: string;

  @Column({ name: "flyer_run_id" })
  public flyerRunId: number;

  @Column()
  public status: RunStatus;

  @CreateDateColumn({ name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
  public updatedAt: Date;
}
