"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeColumnName = void 0;
const snakeCase_1 = require("./snakeCase");
const makeColumnName = (classPropertyName, useSnakeCase) => {
    return useSnakeCase ? (0, snakeCase_1.snakeCase)(classPropertyName) : classPropertyName;
};
exports.makeColumnName = makeColumnName;
//# sourceMappingURL=makeColumnName.js.map