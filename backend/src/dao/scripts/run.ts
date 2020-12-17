import { DatabaseScript } from "./DatabaseScript";

const TABLE_NAME = "run";

const CLEAN_TABLE = `
  DELETE FROM ${TABLE_NAME}
`;

const DROP_TABLE = `
  DROP TABLE IF EXISTS ${TABLE_NAME}
`;

const CREATE_TABLE = `
  CREATE TABLE ${TABLE_NAME} (
    id VARCHAR(36) NOT NULL,
    storefront_id VARCHAR(36) NOT NULL,

    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    available_from TIMESTAMP,
    available_to TIMESTAMP,
    version INT NOT NULL default 1,

    snicket_key VARCHAR(60),
    flyer_run_id INT,

    status VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
  )
`;

export const run: DatabaseScript = {
  tableName: TABLE_NAME,
  clean: CLEAN_TABLE,
  drop: DROP_TABLE,
  create: CREATE_TABLE
};
