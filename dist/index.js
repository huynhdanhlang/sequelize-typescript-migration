"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeTypescriptMigration = void 0;
const fs_1 = require("fs");
const js_beautify_1 = __importDefault(require("js-beautify"));
const createMigrationTable_1 = __importDefault(require("./utils/createMigrationTable"));
const getDiffActionsFromTables_1 = __importDefault(require("./utils/getDiffActionsFromTables"));
const getLastMigrationState_1 = __importDefault(require("./utils/getLastMigrationState"));
const getMigration_1 = __importDefault(require("./utils/getMigration"));
const getTablesFromModels_1 = __importDefault(require("./utils/getTablesFromModels"));
const writeMigration_1 = __importDefault(require("./utils/writeMigration"));
class SequelizeTypescriptMigration {
}
exports.SequelizeTypescriptMigration = SequelizeTypescriptMigration;
_a = SequelizeTypescriptMigration;
/**
 * generates migration file including up, down code
 * after this, run 'npx sequelize-cli db:migrate'.
 * @param sequelize sequelize-typescript instance
 * @param options options
 */
SequelizeTypescriptMigration.makeMigration = async (sequelize, options) => {
    options.preview = options.preview || false;
    if (!(0, fs_1.existsSync)(options.outDir))
        return Promise.reject(new Error(`${options.outDir} not exists. check path and if you did 'npx sequelize init' you must use path used in sequelize migration path`));
    await sequelize.authenticate({ transaction: options.transaction });
    const models = sequelize.models;
    const queryInterface = sequelize.getQueryInterface();
    await (0, createMigrationTable_1.default)(sequelize, { transaction: options.transaction });
    const lastMigrationState = await (0, getLastMigrationState_1.default)(sequelize, {
        transaction: options.transaction,
    });
    const previousState = {
        revision: lastMigrationState?.revision ?? 0,
        version: lastMigrationState?.version ?? 1,
        tables: lastMigrationState?.tables ?? {},
    };
    const currentState = {
        revision: (previousState.revision || 0) + 1,
        tables: (0, getTablesFromModels_1.default)(sequelize, models, options),
    };
    const upActions = (0, getDiffActionsFromTables_1.default)(previousState.tables, currentState.tables);
    const downActions = (0, getDiffActionsFromTables_1.default)(currentState.tables, previousState.tables);
    const migration = (0, getMigration_1.default)(upActions);
    const tmp = (0, getMigration_1.default)(downActions);
    migration.commandsDown = tmp.commandsUp;
    if (migration.commandsUp.length === 0)
        return Promise.resolve({ msg: "success: no changes found" });
    // log
    migration.consoleOut.forEach((v) => {
        console.log(`[Actions] ${v}`);
    });
    if (options.preview) {
        console.log("Migration result:");
        console.log((0, js_beautify_1.default)(`[ \n${migration.commandsUp.join(", \n")} \n];\n`));
        console.log("Undo commands:");
        console.log((0, js_beautify_1.default)(`[ \n${migration.commandsDown.join(", \n")} \n];\n`));
        return Promise.resolve({ msg: "success without save" });
    }
    const info = await (0, writeMigration_1.default)(currentState, migration, options);
    console.log(`New migration to revision ${currentState.revision} has been saved to file '${info.filename}'`);
    // save current state, Ugly hack, see https://github.com/sequelize/sequelize/issues/8310
    const rows = [
        {
            revision: currentState.revision,
            name: info.info.name,
            state: JSON.stringify(currentState),
        },
    ];
    try {
        await queryInterface.bulkDelete("SequelizeMigrationsMeta", {
            revision: currentState.revision,
        }, { transaction: options.transaction });
        await queryInterface.bulkInsert("SequelizeMigrationsMeta", rows, {
            transaction: options.transaction,
        });
        console.log(`Use sequelize CLI:
  npx sequelize db:migrate --to ${info.revisionNumber}-${info.info.name}.js ${`--migrations-path=${options.outDir}`} `);
        return await Promise.resolve({ msg: "success" });
    }
    catch (err) {
        if (options.debug)
            console.error(err);
    }
    return Promise.resolve({ msg: "success anyway..." });
};
//# sourceMappingURL=index.js.map