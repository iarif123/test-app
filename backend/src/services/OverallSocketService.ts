import { Nsp, Socket, SocketService, SocketSession } from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { Logger } from "node-logger";
import { SocketUpdateDto } from "../types";

@SocketService("/")
export class OverallSocketService {
  @Nsp
  public nsp: SocketIO.Namespace;

  private logger: Logger = new Logger("socket-service-logger");

  /**
   * Triggered when the namespace is created
   */
  public $onNamespaceInit(nsp: SocketIO.Namespace) {
    this.logger.info(`Namespace ${nsp} was created`);
  }

  /**
   * Triggered when a new client connects to the Namespace.
   */
  public $onConnection(
    @Socket socket: SocketIO.Socket,
    @SocketSession session: SocketSession
  ) {
    this.logger.info(`Someone connected`);
  }

  /**
   * Triggered when a client disconnects from the Namespace.
   */
  public $onDisconnect(@Socket socket: SocketIO.Socket) {
    this.logger.info(`Someone disconnected`);
  }

  public notify(socketUpdate: SocketUpdateDto): void {
    this.logger.info(`Pushing update with payload ${socketUpdate}`);

    this.nsp.emit("update", [socketUpdate]);
  }
}
