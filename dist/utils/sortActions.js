"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortByLengthExists = (left, right) => {
    if (left.length === 0 && right.length > 0)
        return -1;
    // left < right
    if (right.length === 0 && left.length > 0)
        return 1;
    // right < left
    return 0;
};
function sortActions(actions) {
    const orderedActionTypes = [
        "removeIndex",
        "removeColumn",
        "dropTable",
        "createTable",
        "addColumn",
        "changeColumn",
        "addIndex",
    ];
    actions.sort((left, right) => {
        if (orderedActionTypes.indexOf(left.actionType) <
            orderedActionTypes.indexOf(right.actionType))
            return -1;
        if (orderedActionTypes.indexOf(left.actionType) >
            orderedActionTypes.indexOf(right.actionType))
            return 1;
        if (left.actionType === "dropTable" && right.actionType === "dropTable")
            return sortByLengthExists(right.depends, left.depends);
        return sortByLengthExists(left.depends, right.depends);
    });
    for (let i = 0; i < actions.length; i++) {
        const leftAction = actions[i];
        if (leftAction.depends.length === 0)
            continue;
        for (let j = 0; j < actions.length; j++) {
            const rightAction = actions[j];
            if (rightAction.depends.length === 0)
                continue;
            if (leftAction.actionType !== rightAction.actionType)
                continue;
            if (rightAction.depends.includes(leftAction.tableName))
                if (i > j) {
                    const c = actions[i];
                    actions[i] = actions[j];
                    actions[j] = c;
                }
        }
    }
    return actions;
}
exports.default = sortActions;
//# sourceMappingURL=sortActions.js.map