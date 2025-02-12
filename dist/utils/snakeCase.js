"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snakeCase = void 0;
const snakeCase = (camelCase) => {
    // TODO: maybe we can simplify it
    return camelCase
        // split words by capital letters
        .replace(/([A-Z]+)/g, (match) => `_${match.toLowerCase()}`)
        // split multi-digit numbers
        .replace(/(\d+)/g, (match) => `_${match}`)
        // split replace punctuation
        .replace(/[._-]+/g, "_")
        // rm leading/trailing underscores
        .replace(/^_+/g, "")
        .replace(/_+$/g, "");
};
exports.snakeCase = snakeCase;
//# sourceMappingURL=snakeCase.js.map