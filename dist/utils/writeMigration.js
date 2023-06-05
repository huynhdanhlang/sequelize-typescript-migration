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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const js_beautify_1 = __importDefault(require("js-beautify"));
const path = __importStar(require("path"));
const removeCurrentRevisionMigrations_1 = __importDefault(require("./removeCurrentRevisionMigrations"));
async function writeMigration(currentState, migration, options) {
    await (0, removeCurrentRevisionMigrations_1.default)(currentState.revision, options.outDir, options);
    const name = options.migrationName || "noname";
    const comment = options.comment || "";
    let myState = JSON.stringify(currentState);
    const searchRegExp = /'/g;
    const replaceWith = "\\'";
    myState = myState.replace(searchRegExp, replaceWith);
    const versionCommands = `
      {
        fn: "createTable",
        params: [
          "SequelizeMigrationsMeta",
          {
            "revision": {
              "primaryKey": true,
              "type": Sequelize.INTEGER
            },
            "name": {
              "allowNull": false,
              "type": Sequelize.STRING
            },
            "state": {
              "allowNull": false,
              "type": Sequelize.JSON
            },
          },
          {}
        ]
      },
      {
        fn: "bulkDelete",
        params: [
          "SequelizeMigrationsMeta",
          [{
            revision: info.revision
          }],
          {}
        ]
      },
      {
        fn: "bulkInsert",
        params: [
          "SequelizeMigrationsMeta",
          [{
            revision: info.revision,
            name: info.name,
            state: '${myState}'
          }],
          {}
        ]
      },
    `;
    const versionDownCommands = `
    {
      fn: "bulkDelete",
      params: [
        "SequelizeMigrationsMeta",
        [{
          revision: info.revision,
        }],
        {}
      ]
    },
`;
    let commands = `const migrationCommands = [\n${versionCommands}\n\n \n${migration.commandsUp.join(", \n")} \n];\n`;
    let commandsDown = `const rollbackCommands = [\n${versionDownCommands}\n\n \n${migration.commandsDown.join(", \n")} \n];\n`;
    const actions = ` * ${migration.consoleOut.join("\n * ")}`;
    commands = (0, js_beautify_1.default)(commands);
    commandsDown = (0, js_beautify_1.default)(commandsDown);
    const info = {
        revision: currentState.revision,
        name,
        created: new Date(),
        comment,
    };
    const template = `'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
${actions}
 *
 **/

const info = ${JSON.stringify(info, null, 4)};

${commands}

${commandsDown}

module.exports = {
  pos: 0,
  up: function(queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#"+index+"] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        } else resolve();
      }

      next();
    });
  },
  down: function(queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function(resolve, reject) {
      function next() {
        if (index < rollbackCommands.length) {
          let command = rollbackCommands[index];
          console.log("[#"+index+"] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        }
        else resolve();
      }

      next();
    });
  },
  info
};
`;
    const revisionNumber = currentState.revision.toString().padStart(8, "0");
    const filename = path.join(options.outDir, `${revisionNumber + (name !== "" ? `-${name.replace(/[\s-]/g, "_")}` : "")}.js`);
    fs.writeFileSync(filename, template);
    return { filename, info, revisionNumber };
}
exports.default = writeMigration;
//# sourceMappingURL=writeMigration.js.map