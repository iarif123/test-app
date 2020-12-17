import * as _ from "lodash";
import { merchant } from "./merchant";
import { run } from "./run";
import { blueprint } from "./blueprint";

export const createTablesSequence = [merchant, run, blueprint];

export const dropTablesSequence = _.reverse(_.clone(createTablesSequence));

export const cleanTablesSequence = _.clone(dropTablesSequence);
