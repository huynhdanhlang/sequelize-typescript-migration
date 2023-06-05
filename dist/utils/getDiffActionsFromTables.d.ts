import type { Json } from "../constants";
export interface IAction {
    actionType: "addColumn" | "addIndex" | "changeColumn" | "createTable" | "dropTable" | "removeColumn" | "removeIndex";
    tableName: string;
    attributes?: any;
    attributeName?: any;
    options?: any;
    columnName?: any;
    fields?: any[];
    depends: string[];
}
export default function getDiffActionsFromTables(previousStateTables: Json, currentStateTables: Json): IAction[];
