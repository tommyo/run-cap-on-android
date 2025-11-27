"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLineEndings = void 0;
const removeLineEndings = () => {
    return `| tr -d $'\r' | tr -d $'\n'`;
};
exports.removeLineEndings = removeLineEndings;
