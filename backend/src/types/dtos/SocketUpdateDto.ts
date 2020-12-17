import { UpdateType } from "../enums";

export interface SocketUpdateDto {
  type: UpdateType;
  data?: any;
}
