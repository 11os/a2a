"use strict";
exports.__esModule = true;
var commander = require("commander");
var j2a_1 = require("./src/utils/j2a");
var program = new commander.Command();
program
    .option("-i, --input <path>", "json source directory path")
    .option("-o, --output <path>", "export directory path")
    .option("-t, --type <type>", "typescript(default) or dart");
program.parse(process.argv);
function main() {
    var input = program.input, output = program.output, _a = program.type, type = _a === void 0 ? "typescript" : _a;
    var parseType = j2a_1.ParseType[type];
    if (!parseType) {
        console.log("type <" + type + "> is not support");
        return;
    }
    if (input && output) {
        j2a_1.j2a(input, output, parseType);
    }
    else {
        console.log("j2a -i dir/input -o dir/output --typescript");
    }
}
main();
