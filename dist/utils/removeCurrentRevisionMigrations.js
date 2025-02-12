"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function removeCurrentRevisionMigrations(revision, migrationsPath, options) {
    // if old files can't be deleted, we won't stop the execution
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
        if (options.keepFiles)
            resolve(false);
        try {
            const files = fs.readdirSync(migrationsPath);
            if (files.length === 0)
                resolve(false);
            let i = 0;
            files.forEach((file) => {
                i += 1;
                if (file.split("-")[0] === revision.toString()) {
                    fs.unlinkSync(`${migrationsPath}/${file}`);
                    if (options.verbose) {
                        console.log(`Successfully deleted ${file}`);
                        resolve(true);
                    }
                }
                if (i === files.length)
                    resolve(false);
            });
        }
        catch (err) {
            // if (options.debug) console.error(`Can't read dir: ${err}`);
            // console.log(`Failed to delete mig file: ${error}`);
            if (options.debug)
                console.error(`Error Occurred: ${err}`);
            resolve(false);
        }
    });
}
exports.default = removeCurrentRevisionMigrations;
//# sourceMappingURL=removeCurrentRevisionMigrations.js.map