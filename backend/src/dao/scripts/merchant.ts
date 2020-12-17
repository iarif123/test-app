import { DatabaseScript } from "./DatabaseScript";

const TABLE_NAME = "merchant";

const CLEAN_TABLE = `
  DELETE FROM ${TABLE_NAME}
`;

const DROP_TABLE = `
  DROP TABLE IF EXISTS ${TABLE_NAME}
`;

const CREATE_TABLE = `
  CREATE TABLE ${TABLE_NAME} (
    id INT NOT NULL,

    name VARCHAR(155),
    description VARCHAR(255),
    deleted BOOLEAN NOT NULL DEFAULT 0,

    is_digital BOOLEAN NOT NULL DEFAULT 0,

    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    PRIMARY KEY (id)
  )
`;

export const merchant: DatabaseScript = {
  tableName: TABLE_NAME,
  clean: CLEAN_TABLE,
  drop: DROP_TABLE,
  create: CREATE_TABLE
};
