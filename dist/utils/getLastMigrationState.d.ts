import type { Sequelize } from "sequelize-typescript";
import type { MigrationState } from "../constants";
import { ITransaction } from "..";
export default function getLastMigrationState(sequelize: Sequelize, options: ITransaction): Promise<MigrationState | undefined>;
