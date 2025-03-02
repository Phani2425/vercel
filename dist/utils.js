"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate = Generate;
// this is a function which creates aa random id for each project
const uuid_1 = require("uuid");
function Generate() {
    const id = (0, uuid_1.v4)();
    return id;
}
