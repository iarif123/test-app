import { Logger } from "simple-node-logger";
import { AppServer } from "./AppServer";

const logger = new Logger("test-app-backend-logger");

const appServer = new AppServer();
appServer.start();

// =============================================================================
// Application error handling:
// =============================================================================
const destroy = async (): Promise<void> => {
  logger.info("Destroying test-app-backend...");
  process.exit(1);
};

const handleUncaughtException = (err: Error) => {
  logger.error("Uncaught exception encountered:", err, { err });
  destroy();
};

const handleSignal = () => {
  logger.info("Unexpected signal");
  destroy();
};

// Application is in an undefined state. Destroy it.
process.on("unhandledRejection", handleUncaughtException);
process.on("uncaughtException", handleUncaughtException);
process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);
// =============================================================================

export default appServer;
