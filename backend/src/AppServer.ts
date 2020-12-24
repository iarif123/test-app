import {
  GlobalAcceptMimesMiddleware,
  ServerLoader,
  ServerSettings
} from "@tsed/common";
import "@tsed/socketio";
import * as BodyParser from "body-parser";
import * as Compression from "compression";
import * as CookieParser from "cookie-parser";
import * as MethodOverride from "method-override";
import { Logger } from "node-logger";
import * as TypeOrm from "typeorm";
import * as Config from "./config";

const logger = new Logger("app-server-logger");

@ServerSettings(Config.applicationServer)
export class AppServer extends ServerLoader {
  public async $beforeInit(): Promise<void> {
    await TypeOrm.createConnection(Config.database);
  }

  public async $beforeRoutesInit(): Promise<void> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(CookieParser())
      .use(Compression({}))
      .use(MethodOverride())
      .use(BodyParser.json())
      .use(
        BodyParser.urlencoded({
          extended: true
        })
      );
  }

  public async $onReady(): Promise<void> {
    logger.info(`${AppServer.name} started...`);
  }

  public async $onServerInitError(error: Error): Promise<void> {
    logger.error(`Error initializing ${AppServer.name}`, error);
  }
}
