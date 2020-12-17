import { DatabaseScript } from "./DatabaseScript";

const TABLE_NAME = "blueprint";

const CLEAN_TABLE = `
  DELETE FROM ${TABLE_NAME}
`;

const DROP_TABLE = `
  DROP TABLE IF EXISTS ${TABLE_NAME}
`;

const CREATE_TABLE = `
  CREATE TABLE ${TABLE_NAME} (
    id VARCHAR(36) NOT NULL,

    run_id VARCHAR(36) NOT NULL,
    segment_id VARCHAR(36) NOT NULL,
    store_id INT NOT NULL,
    language_id VARCHAR(2) NOT NULL,

    revision INT,
    s3_bucket VARCHAR(255),
    s3_key VARCHAR(255),

    flyer_id INT,
    flyer_hashed_key VARCHAR(64),

    status VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    PRIMARY KEY(id)
  )
`;

export const blueprint: DatabaseScript = {
  tableName: TABLE_NAME,
  clean: CLEAN_TABLE,
  drop: DROP_TABLE,
  create: CREATE_TABLE
};
