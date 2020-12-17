import { environment, localstackS3 } from "../config";

import { Logger } from "node-logger";
import { S3 } from "aws-sdk";

import * as fs from "fs";
import * as path from "path";

const logger = new Logger("s3-logger");
export const DIGITAL_PUBLISHING_BUCKET_NAME = "test-bucket";
const ENVIRONMENT_DIRECTORY = `${environment}`;
const DEFAULT_CHARACTER_SET = "utf-8";

export const s3 =
  environment === "development" || environment === "test"
    ? new S3(localstackS3)
    : new S3();

interface IListObjectArgs {
  Prefix?: S3.Prefix;
  ContinuationToken?: S3.Token;
}

export const copyObject = async (sourceKey: string, destinationKey: string) => {
  const params = {
    Bucket: `${DIGITAL_PUBLISHING_BUCKET_NAME}`,
    CopySource: `${DIGITAL_PUBLISHING_BUCKET_NAME}/${sourceKey}`,
    Key: `${destinationKey}`
  };

  try {
    return await s3.copyObject(params).promise();
  } catch (err) {
    logger.error("Failed to copy object", err, params);
    throw err;
  }
};

export const upload = async (
  key: string,
  contentType: string,
  body: Buffer,
  bucket = DIGITAL_PUBLISHING_BUCKET_NAME
) => {
  // TODO: Add the environment variable as part of the key (Key: `${ENVIRONMENT_DIRECTORY}/${key}`,) https://jira.wishabi.com/browse/FADMIN-11192 is complete
  const params = {
    Bucket: `${bucket}`,
    Body: body,
    Key: `${key}`,
    ContentType: contentType
  };

  try {
    const { Bucket, Location, Key } = await s3.upload(params).promise();
    return { Bucket, Location, Key };
  } catch (err) {
    logger.error("Failed to upload object", err, params);
    throw err;
  }
};

export const listObjects = async (
  args: IListObjectArgs,
  objects: any[] = []
): Promise<S3.ObjectList> => {
  const defaultParams = {
    Bucket: `${DIGITAL_PUBLISHING_BUCKET_NAME}`
  };
  try {
    const res = await s3.listObjectsV2({ ...defaultParams, ...args }).promise();
    const { Contents, NextContinuationToken, IsTruncated } = res;
    const consolidatedOutput = [...objects, ...Contents];

    if (IsTruncated) {
      return await listObjects(
        { ...args, ContinuationToken: NextContinuationToken },
        consolidatedOutput
      );
    } else {
      return consolidatedOutput;
    }
  } catch (err) {
    logger.error("Failed to list objects from bucket", err, args);
    throw err;
  }
};

export const deleteObjects = async (args: S3.Delete) => {
  const params = {
    Bucket: `${DIGITAL_PUBLISHING_BUCKET_NAME}`,
    Delete: args
  };

  try {
    const response = await s3.deleteObjects(params).promise();
    return response;
  } catch (err) {
    logger.error("Failed to Delete Objects", err, params);
    throw err;
  }
};

export const downloadObject = (
  destinationDirectory: string,
  s3Key: string,
  filename: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const params = {
      Bucket: `${DIGITAL_PUBLISHING_BUCKET_NAME}`,
      Key: s3Key
    };

    const destinationPath = path.format({
      root: "/var",
      base: `${destinationDirectory}/${filename}`,
      ext: "ignored"
    });

    const writeStream = fs.createWriteStream(destinationPath);
    const readStream = s3.getObject(params).createReadStream();

    readStream.on("data", (data: any) => {
      writeStream.write(data);
    });

    readStream.on("end", () => {
      writeStream.close();
      resolve();
    });
    readStream.on("error", error => reject(error));
    writeStream.on("error", error => reject(error));
  });
};

export const downloadDirectory = async (
  sourceS3DirectoryPattern: string,
  destinationDirectory: string
) => {
  const directoryContents = await listObjects({
    Prefix: sourceS3DirectoryPattern
  });

  const fileObjects = directoryContents.map((content: S3.Object) => {
    return {
      key: content.Key,
      filename: path.basename(content.Key)
    };
  });

  try {
    for (const fileObject of fileObjects) {
      const { key, filename } = fileObject;
      await downloadObject(destinationDirectory, key, filename);
    }
  } catch (e) {
    logger.error("Failed to download files to local directory.", e, {
      message: e.message
    });
    throw e;
  }
};

export const getJsonObject = async (s3Key: string): Promise<JSON> => {
  const param = {
    Bucket: `${DIGITAL_PUBLISHING_BUCKET_NAME}`,
    Key: s3Key
  };

  const output = await s3.getObject(param).promise();

  return JSON.parse(output.Body.toString(DEFAULT_CHARACTER_SET));
};
