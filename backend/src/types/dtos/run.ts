import { RunStatus } from "../../dao/enums";

export interface RunDto {
  id: string;
  validFrom: Date;
  validTo: Date;
  availableFrom: Date;
  availableTo: Date;
  version: number;
  snicketKey: string;
  flyerRunId?: number;
  status: RunStatus;
}
