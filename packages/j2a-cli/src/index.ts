import { Command, flags } from "@oclif/command";
import { j2a, ParseType } from "./utils/j2a";

class J2ACli extends Command {
  static description = "describe the command here";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    input: flags.string({ char: "i" }),
    output: flags.string({ char: "o" }),
    type: flags.string({ char: "t" })
  };

  async run() {
    const { flags } = this.parse(J2ACli);
    const { input, output, type = "typescript" } = flags;
    let parseType = ParseType[type];
    if (!parseType) {
      this.log(`type [${type}] is not support`);
      return;
    }
    if (input && output) {
      j2a(input, output, parseType);
    }
  }
}

export = J2ACli;
