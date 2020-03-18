import { tokenizer } from "./tokenizer";
import { parser } from "./parser";
import { transformer } from "./transformer";

import { AstNode } from "./types";

export function compiler(json: string): AstNode {
  let tokens = tokenizer(json);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  return newAst;
}
