"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snakeCase_1 = require("./snakeCase");
const cases = [
    {
        input: "camelCase",
        expected: "camel_case",
    },
    {
        input: "CamelCase123",
        expected: "camel_case_123",
    },
    {
        input: "__FOO-BAR__123.2CamelCase_",
        expected: "foo_bar_123_2_camel_case",
    },
];
it.each(cases)("snakeCase($input) should return $expected", ({ input, expected }) => {
    expect((0, snakeCase_1.snakeCase)(input)).toEqual(expected);
});
//# sourceMappingURL=snakeCase.spec.js.map