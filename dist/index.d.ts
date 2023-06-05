import { ReverseModelsOptions } from "./utils/getTablesFromModels";
export declare type IMigrationOptions = {
    /**
     * directory where migration file saved. We recommend that you specify this path to sequelize migration path.
     */
    outDir: string;
    /**
     * if true, it doesn't generate files but just prints result action.
     */
    preview?: boolean;
    /**
     * migration file name, default is "noname"
     */
    migrationName?: string;
    /**
     * comment of migration.
     */
    comment?: string;
    debug?: boolean;
} & ReverseModelsOptions;
export declare class SequelizeTypescriptMigration {
    /**
     * generates migration file including up, down code
     * after this, run 'npx sequelize-cli db:migrate'.
     * @param sequelize sequelize-typescript instance
     * @param options options
     */
    static makeMigration: (sequelize: Sequelize, options: IMigrationOptions) => Promise<{
        msg: string;
    }>;
}
