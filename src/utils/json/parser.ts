import { Token, Node, NodeTypes, TokenTypes } from "./types";

export default function parser(tokens: Token[]) {
  let cursor = 0;
  function walk(): Node {
    let token: Token = tokens[cursor];
    // null
    if (token.type === TokenTypes.null) {
      cursor++;
      return {
        type: NodeTypes.NullLiteral,
        value: token.value,
        params: []
      };
    }
    // boolean
    if (token.type === TokenTypes.bool) {
      cursor++;
      return {
        type: NodeTypes.BooleanLiteral,
        value: token.value,
        params: []
      };
    }
    // number
    if (token.type === TokenTypes.number) {
      cursor++;
      return {
        type: NodeTypes.NumberLiteral,
        value: token.value,
        params: []
      };
    }
    // string
    if (token.type === TokenTypes.string) {
      cursor++;
      let next = tokens[cursor];
      if (next.type === TokenTypes.assign) {
        cursor++;
        return {
          type: NodeTypes.ObjectProperty,
          identifier: `${token.value}`,
          params: [walk()]
        };
      }
      return {
        type: NodeTypes.StringLiteral,
        value: token.value,
        params: []
      };
    }
    // assign
    if (token.type === TokenTypes.assign) {
      cursor++;
      return {
        type: NodeTypes.AssignmentExpression,
        value: token.value,
        params: []
      };
    }
    // split
    if (token.type === TokenTypes.split) {
      cursor++;
      return {
        type: NodeTypes.SplitExpression,
        value: token.value,
        params: []
      };
    }
    // object
    if (token.type === TokenTypes.object && token.value === "{") {
      token = tokens[++cursor];
      let node: Node = {
        type: NodeTypes.ObjectExpression,
        params: []
      };
      while (
        token.type !== TokenTypes.object ||
        (token.type === TokenTypes.object && token.value !== "}")
      ) {
        let next = walk();
        if (next?.type !== NodeTypes.SplitExpression) {
          node?.params?.push?.(next);
        }
        token = tokens[cursor];
      }
      cursor++;
      return node;
    }
    // array
    if (token.type === TokenTypes.array && token.value === "[") {
      token = tokens[++cursor];
      let node: Node = {
        type: NodeTypes.ArrayExpression,
        params: []
      };
      while (
        token.type !== TokenTypes.array ||
        (token.type === TokenTypes.array && token.value !== "]")
      ) {
        let next = walk();
        if (next?.type !== NodeTypes.SplitExpression) {
          node?.params?.push?.(next);
        }
        token = tokens[cursor];
      }
      cursor++;
      return node;
    }
    // not found
    console.log("not found", token);
    throw Error(`not found ${token}`);
  }
  let ast: Node = {
    type: NodeTypes.Daddy,
    params: []
  };
  while (cursor < tokens.length) {
    ast.params && ast.params.push(walk());
  }
  // console.log(ast);
  return ast;
}
