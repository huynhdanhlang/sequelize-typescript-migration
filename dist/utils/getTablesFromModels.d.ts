import type { Model, ModelStatic } from "sequelize/types";
import type { Sequelize } from "sequelize-typescript";
export declare type ReverseModelsOptions = {
    useSnakeCase?: boolean;
};
export default function reverseModels(sequelize: Sequelize, models: Record<string, ModelStatic<Model>>, options?: ReverseModelsOptions): {};
