"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const makeColumnName_1 = require("./makeColumnName");
const parseIndex_1 = __importDefault(require("./parseIndex"));
const reverseSequelizeColType_1 = __importDefault(require("./reverseSequelizeColType"));
const reverseSequelizeDefValueType_1 = __importDefault(require("./reverseSequelizeDefValueType"));
function reverseModels(sequelize, models, options = {}) {
    const tables = {};
    for (const [, model] of Object.entries(models)) {
        const attributes = model.rawAttributes;
        const resultAttributes = {};
        for (const [column, attribute] of Object.entries(attributes)) {
            let rowAttribute = {};
            if (attribute.defaultValue != null) {
                const _val = (0, reverseSequelizeDefValueType_1.default)(attribute.defaultValue);
                if (_val.notSupported) {
                    console.log(`[Not supported] Skip defaultValue column of attribute ${model}:${column}`);
                }
                rowAttribute.defaultValue = _val;
            }
            if (attribute.type === undefined) {
                console.log(`[Not supported] Skip column with undefined type ${model}:${column}`);
                continue;
            }
            const seqType = (0, reverseSequelizeColType_1.default)(sequelize, attribute.type);
            if (seqType === "Sequelize.VIRTUAL") {
                console.log(`[SKIP] Skip Sequelize.VIRTUAL column "${column}"", defined in model "${model}"`);
                continue;
            }
            rowAttribute = {
                seqType,
            };
            [
                "allowNull",
                "unique",
                "primaryKey",
                "defaultValue",
                "autoIncrement",
                "autoIncrementIdentity",
                "comment",
                "references",
                "onUpdate",
                "onDelete",
                // "validate",
            ].forEach((key) => {
                if (attribute[key] !== undefined)
                    rowAttribute[key] = attribute[key];
            });
            resultAttributes[(0, makeColumnName_1.makeColumnName)(column, options.useSnakeCase)] = rowAttribute;
        } // attributes in model
        tables[model.tableName] = {
            tableName: model.tableName,
            schema: resultAttributes,
        };
        const indexOut = {};
        if (model.options &&
            model.options.indexes &&
            model.options.indexes.length > 0)
            for (const _i in model.options.indexes) {
                const index = (0, parseIndex_1.default)(model.options.indexes[_i]);
                indexOut[`${index.hash}`] = index;
                delete index.hash;
            }
        tables[model.tableName].indexes = indexOut;
    } // model in models
    return tables;
}
exports.default = reverseModels;
//# sourceMappingURL=getTablesFromModels.js.map