import * as commander from "commander";
import { j2a, ParseType } from "./utils/j2a";

const program = new commander.Command();

program
  .description("convert path/to/*.json to path/to/*.any")
  .version(require("../package.json").version)
  .option("-i, --input <path>", "json source directory path")
  .option("-o, --output <path>", "export directory path")
  .option("-t, --type <type>", "typescript dart", "typescript")
  .option("-w, --watch", "coming soon...");

program.parse(process.argv);

function main() {
  const { input, output, type = "typescript" } = program;
  let parseType = ParseType[type];
  if (!parseType) {
    console.log(`type <${type}> is not support`);
    return;
  }
  if (input && output) {
    j2a(input, output, parseType);
  } else {
    console.log("j2a -i dir/input -o dir/output --typescript");
  }
}

main();
