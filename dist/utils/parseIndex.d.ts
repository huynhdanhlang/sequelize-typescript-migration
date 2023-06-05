import type { IndexesOptions } from "sequelize/types";
export default function parseIndex(idx: IndexesOptions): {
    [x: string]: unknown;
};
