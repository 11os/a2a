import { tokenizer } from './tokenizer'
import { parser } from './parser'
import { transformer } from './transformer'

import { AstNode } from './types'

export function compiler(json: string): AstNode {
  const tokens = tokenizer(json)
  const ast = parser(tokens)
  const newAst = transformer(ast)
  return newAst
}
