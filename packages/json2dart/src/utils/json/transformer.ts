import { NodeTypes, AstNode, Visitor } from "./types";

export function traverser({
  ast,
  deep = true,
  visitor
}: {
  ast: AstNode;
  visitor: Visitor;
  deep?: boolean;
}) {
  function traveresArray(array: AstNode[], parent: AstNode) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node: AstNode, parent?: AstNode) {
    let method = visitor[node.type];
    if (method && method.enter) {
      method.enter(node, parent);
    }
    switch (node.type) {
      case NodeTypes.Daddy:
      case NodeTypes.ArrayExpression:
      case NodeTypes.ObjectExpression:
        node.params && traveresArray(node.params, node);
        break;
      case NodeTypes.ObjectProperty:
        deep && node.params && traveresArray(node.params, node);
        break;
      case NodeTypes.StringLiteral:
      case NodeTypes.NumericLiteral:
      case NodeTypes.BooleanLiteral:
      case NodeTypes.NullLiteral:
      case NodeTypes.SplitExpression:
        break;
      default:
        throw new TypeError(node.type.toString());
    }
    if (method && method.exit) {
      method.exit(node, parent);
    }
  }
  traverseNode(ast);
}

export function transformer(ast: AstNode): AstNode {
  let newAst: AstNode = {
    type: NodeTypes.Daddy,
    params: []
  };

  ast._context = newAst.params;

  traverser({
    ast: ast,
    visitor: {
      [NodeTypes.ObjectExpression]: {
        enter(node, parent) {
          node._context = node.params;
          let expression = {
            type: NodeTypes.ObjectExpression,
            params: []
          };
          node._context = expression.params;
          if (node.type === NodeTypes.ObjectExpression) {
          }
          parent?._context.push(expression);
        },
        exit(node, parent) {}
      },
      [NodeTypes.ObjectProperty]: {
        enter(node, parent) {
          let expression = {
            type: NodeTypes.ObjectProperty,
            identifier: node.identifier,
            params: []
          };
          node._context = expression.params;
          parent?._context.push(expression);
        },
        exit(node, parent) {}
      },
      [NodeTypes.ArrayExpression]: {
        enter(node, parent) {
          let expression = {
            type: NodeTypes.ArrayExpression,
            params: []
          };
          node._context = expression.params;
          parent?._context.push(expression);
        },
        exit(node, parent) {}
      },
      [NodeTypes.StringLiteral]: {
        enter(node, parent) {
          parent?._context.push(node);
        },
        exit(node, parent) {}
      },
      [NodeTypes.NumericLiteral]: {
        enter(node, parent) {
          parent?._context.push(node);
        },
        exit(node, parent) {}
      },
      [NodeTypes.NullLiteral]: {
        enter(node, parent) {
          parent?._context.push(node);
        },
        exit(node, parent) {}
      },
      [NodeTypes.BooleanLiteral]: {
        enter(node, parent) {
          parent?._context.push(node);
        },
        exit(node, parent) {}
      }
    }
  });
  return newAst;
}
