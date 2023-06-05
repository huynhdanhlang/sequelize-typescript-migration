"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
async function getLastMigrationState(sequelize, options) {
    // Fixed issue query table "does not exist". (https://lerner.co.il/2013/11/30/quoting-postgresql/)
    const dialect = sequelize.getDialect();
    let lastExMigrationQuery = "SELECT name FROM SequelizeMeta ORDER BY name desc limit 1";
    let lastMigrationQuery = (lastRevision) => `SELECT state FROM SequelizeMigrationsMeta where revision = '${lastRevision}'`;
    if (dialect === "postgres") {
        lastExMigrationQuery =
            'SELECT name FROM "SequelizeMeta" ORDER BY name desc limit 1';
        lastMigrationQuery = (lastRevision) => `SELECT state FROM "SequelizeMigrationsMeta" where revision = '${lastRevision}'`;
    }
    const [lastExecutedMigration] = await sequelize.query(lastExMigrationQuery, { type: sequelize_1.QueryTypes.SELECT, transaction: options.transaction });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const lastRevision = lastExecutedMigration !== undefined
        ? parseInt(lastExecutedMigration.name.split("-")[0])
        : -1;
    const [lastMigration] = await sequelize.query(lastMigrationQuery(lastRevision), { type: sequelize_1.QueryTypes.SELECT, transaction: options.transaction });
    if (lastMigration)
        return typeof lastMigration.state === "string"
            ? JSON.parse(lastMigration.state)
            : lastMigration.state;
}
exports.default = getLastMigrationState;
//# sourceMappingURL=getLastMigrationState.js.map