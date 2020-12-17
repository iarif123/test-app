import { Controller, Inject, Res, BodyParams, Post } from "@tsed/common";
import { OverallSocketService } from "../services";
import { SocketUpdateDto } from "../types";

@Controller("/socket")
export class SocketController {
  @Inject()
  private socketService: OverallSocketService;

  @Post("")
  public emit(
    @BodyParams() body: SocketUpdateDto,
    @Res() response: Express.Response
  ): any {
    this.socketService.notify(body);
  }
}
