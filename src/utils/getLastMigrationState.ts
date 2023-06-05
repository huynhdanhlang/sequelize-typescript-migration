import { QueryTypes } from "sequelize";
import type { Sequelize } from "sequelize-typescript";

import type {
  MigrationState,
  SequelizeMigrations,
  SequelizeMigrationsMeta,
} from "../constants";

export default async function getLastMigrationState(sequelize: Sequelize) {
  // Fixed issue query table "does not exist". (https://lerner.co.il/2013/11/30/quoting-postgresql/)
  const dialect = sequelize.getDialect();
  let lastExMigrationQuery =
    "SELECT name FROM SequelizeMeta ORDER BY name desc limit 1";
  let lastMigrationQuery = (lastRevision: number) =>
    `SELECT state FROM SequelizeMigrationsMeta where revision = '${lastRevision}'`;
  if (dialect === "postgres") {
    lastExMigrationQuery =
      'SELECT name FROM "SequelizeMeta" ORDER BY name desc limit 1';
    lastMigrationQuery = (lastRevision: number) =>
      `SELECT state FROM "SequelizeMigrationsMeta" where revision = '${lastRevision}'`;
  }
  const [lastExecutedMigration] = await sequelize.query<SequelizeMigrations>(
    lastExMigrationQuery,
    { type: QueryTypes.SELECT }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const lastRevision: number =
    lastExecutedMigration !== undefined
      ? parseInt(lastExecutedMigration.name.split("-")[0])
      : -1;

  const [lastMigration] = await sequelize.query<SequelizeMigrationsMeta>(
    lastMigrationQuery(lastRevision),
    { type: QueryTypes.SELECT }
  );

  if (lastMigration)
    return typeof lastMigration.state === "string"
      ? (JSON.parse(lastMigration.state) as MigrationState)
      : lastMigration.state;
}
