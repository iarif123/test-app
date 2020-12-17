import * as _ from "lodash";

import { IModuleOptions } from "@tsed/common";
import { Credentials } from "aws-sdk";
import { ConnectionOptions } from "typeorm";

/**
 * Tries to load the value from an enviroment variable. Uses the default value if the enviroment variable is NOT present.
 * @param variableName the name of the environment variable to load.
 * @param defaultValue the default value to use if the environment variable is not present.
 */
const getEnvironmentVariable = (
  variableName: string,
  defaultValue: any
): any => {
  return _.has(process.env, variableName)
    ? process.env[variableName]
    : defaultValue;
};

export const environment = getEnvironmentVariable("ENVIRONMENT", "development");

export const commitHash = getEnvironmentVariable(
  "CONTAINER_BUILD_COMMIT",
  "dev"
);

export const isProdEnvironment = (): boolean => {
  return _.isEqual("production", environment);
};

export const isDevEnvironment = (): boolean => {
  return _.isEqual("development", environment);
};

export const database: ConnectionOptions = {
  type: "mysql",
  host: getEnvironmentVariable("DB_HOST", "localhost"),
  port: getEnvironmentVariable("DB_PORT", 3306),
  username: getEnvironmentVariable("DB_USER", "root"),
  password: getEnvironmentVariable("DB_PASSWORD", ""),
  database: getEnvironmentVariable("DB_NAME", "test-app-db"),
  synchronize: getEnvironmentVariable("DB_ORM_SYNCHRONIZE", false),
  migrationsRun: getEnvironmentVariable("DB_ORM_MIGRATIONS_RUN", false),
  logging: getEnvironmentVariable("DB_ORM_LOGGING", true),
  entities: ["dist/src/dao/entities/**/*.js"],
  migrations: ["dist/src/dao/migrations/**/*.js"],
  subscribers: ["dist/src/dao/subscribers/**/*.js"],
  cli: {
    entitiesDir: "src/dao/entities",
    migrationsDir: "src/dao/migrations",
    subscribersDir: "src/dao/subscribers"
  }
};

export const applicationServer: Partial<IModuleOptions> = {
  port: getEnvironmentVariable("PORT", 3000),
  httpsPort: false,
  rootDir: "dist/src",
  mount: {
    "/": "${rootDir}/controllers/**/*.js"
  },
  componentsScan: [
    "${rootDir}/middlewares/**/*.js",
    "${rootDir}/services/**/*.js",
    "${rootDir}/converters/**/*.js"
  ],
  exclude: ["**/__tests__/**/*"],
  acceptMimes: ["application/JSON"],
  socketIO: {
    // ... see configuration
  },
  logger: {
    logRequest: isDevEnvironment()
  }
};

export const localstackS3 = {
  credentials: new Credentials({
    accessKeyId: getEnvironmentVariable(
      "AWS_ACCESS_KEY_ID",
      "DEFAULT_AWS_ACCESS_KEY_ID"
    ),
    secretAccessKey: getEnvironmentVariable(
      "AWS_SECRET_ACCESS_KEY",
      "DEFAULT_AWS_SECRET_ACCESS_KEY"
    )
  }),
  region: getEnvironmentVariable("AWS_REGION", "us-east-1"),
  endpoint: getEnvironmentVariable("AWS_S3_ENDPOINT", "http://localstack:4572"),
  s3ForcePathStyle: true
};
