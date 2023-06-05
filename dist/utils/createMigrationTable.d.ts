import { Sequelize } from "sequelize-typescript";
import { ITransaction } from "..";
export default function createMigrationTable(sequelize: Sequelize, options: ITransaction): Promise<void>;
