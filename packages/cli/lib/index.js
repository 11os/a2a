"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const j2a_1 = require("./utils/j2a");
const program = new commander.Command();
program
    .option("-i, --input <path>", "json source directory path")
    .option("-o, --output <path>", "export directory path")
    .option("-t, --type <type>", "typescript(default) or dart");
program.parse(process.argv);
function main() {
    const { input, output, type = "typescript" } = program;
    let parseType = j2a_1.ParseType[type];
    if (!parseType) {
        console.log(`type <${type}> is not support`);
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
