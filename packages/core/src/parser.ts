import { Token, AstNode, NodeTypes, TokenTypes } from './types'
import { ErrorCodes, createCompilerError } from './error'

export function parser(tokens: Token[]) {
  let cursor = 0
  function walk(): AstNode {
    let token: Token = tokens[cursor]
    // null
    if (token.type === TokenTypes.null) {
      cursor++
      return {
        type: NodeTypes.NullLiteral,
        value: token.value,
        params: []
      }
    }
    // boolean
    if (token.type === TokenTypes.bool) {
      cursor++
      return {
        type: NodeTypes.BooleanLiteral,
        value: token.value,
        params: []
      }
    }
    // number
    if (token.type === TokenTypes.number) {
      cursor++
      return {
        type: NodeTypes.NumericLiteral,
        value: token.value,
        params: []
      }
    }
    // string
    if (token.type === TokenTypes.string) {
      cursor++
      const next = tokens[cursor]
      if (next.type === TokenTypes.assign) {
        cursor++
        return {
          type: NodeTypes.ObjectProperty,
          identifier: `${token.value}`,
          params: [walk()]
        }
      }
      return {
        type: NodeTypes.StringLiteral,
        value: token.value,
        params: []
      }
    }
    // assign
    if (token.type === TokenTypes.assign) {
      cursor++
      return {
        type: NodeTypes.AssignmentExpression,
        value: token.value,
        params: []
      }
    }
    // split
    if (token.type === TokenTypes.split) {
      cursor++
      return {
        type: NodeTypes.SplitExpression,
        value: token.value,
        params: []
      }
    }
    // object
    if (token.type === TokenTypes.object && token.value === '{') {
      token = tokens[++cursor]
      const node: AstNode = {
        type: NodeTypes.ObjectExpression,
        params: []
      }
      while (token.type !== TokenTypes.object || (token.type === TokenTypes.object && token.value !== '}')) {
        const next = walk()
        if (next?.type !== NodeTypes.SplitExpression) {
          node?.params?.push?.(next)
        }
        token = tokens[cursor]
      }
      cursor++
      return node
    }
    // array
    if (token.type === TokenTypes.array && token.value === '[') {
      token = tokens[++cursor]
      const node: AstNode = {
        type: NodeTypes.ArrayExpression,
        params: []
      }
      while (token.type !== TokenTypes.array || (token.type === TokenTypes.array && token.value !== ']')) {
        const next = walk()
        if (next?.type !== NodeTypes.SplitExpression) {
          node?.params?.push?.(next)
        }
        token = tokens[cursor]
      }
      cursor++
      return node
    }
    // not found
    throw createCompilerError(ErrorCodes.PARSER_ERROR, token.location, `token not found ${JSON.stringify(token)}`)
  }
  const ast: AstNode = {
    type: NodeTypes.Daddy,
    params: []
  }
  while (cursor < tokens.length) {
    ast.params && ast.params.push(walk())
  }
  // console.log(JSON.stringify(ast));
  return ast
}
