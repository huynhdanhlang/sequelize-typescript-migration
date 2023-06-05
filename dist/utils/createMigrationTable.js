"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
async function createMigrationTable(sequelize, options) {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.createTable("SequelizeMeta", {
        name: {
            type: sequelize_typescript_1.DataType.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        date: {
            type: sequelize_typescript_1.DataType.DATE,
            defaultValue: sequelize_typescript_1.Sequelize.fn("now"),
        },
    }, { transaction: options.transaction });
    await queryInterface.createTable("SequelizeMigrationsMeta", {
        revision: {
            type: sequelize_typescript_1.DataType.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_typescript_1.DataType.STRING,
            allowNull: false,
        },
        state: {
            type: sequelize_typescript_1.DataType.JSON,
            allowNull: false,
        },
        date: {
            type: sequelize_typescript_1.DataType.DATE,
            defaultValue: sequelize_typescript_1.Sequelize.fn("now"),
        },
    }, { transaction: options.transaction });
}
exports.default = createMigrationTable;
//# sourceMappingURL=createMigrationTable.js.map