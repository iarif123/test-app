export interface DatabaseScript {
  tableName: string;
  clean: string;
  drop: string;
  create: string;
}
