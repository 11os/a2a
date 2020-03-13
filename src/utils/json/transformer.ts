import { NodeTypes, Node, Visitor } from "./types";

export default function traverser(ast: Node, visitor: Visitor) {
  function traveresArray(array: Node[], parent: Node) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node: Node, parent?: Node) {
    let method = visitor[node.type];
    if (method && method.enter) {
      method.enter(node, parent);
    }
    switch (node.type) {
      case NodeTypes.Daddy:
      case NodeTypes.ArrayExpression:
      case NodeTypes.ObjectExpression:
        traveresArray(node.params || [], node);
        break;
      case NodeTypes.ObjectProperty:
        traveresArray(node.params || [], node);
        break;
      case NodeTypes.StringLiteral:
      case NodeTypes.NumberLiteral:
      case NodeTypes.BooleanLiteral:
      case NodeTypes.NullLiteral:
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

function transformer(ast: Node) {
  let newAst = {
    type: NodeTypes.Daddy,
    params: []
  };

  ast._context = newAst.params;

  traverser(ast, {
    ObjectExpression: {
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
    ObjectProperty: {
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
    ArrayExpression: {
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
    StringLiteral: {
      enter(node, parent) {
        parent?._context.push(node);
      },
      exit(node, parent) {}
    },
    NumberLiteral: {
      enter(node, parent) {
        parent?._context.push(node);
      },
      exit(node, parent) {}
    },
    NullLiteral: {
      enter(node, parent) {
        parent?._context.push(node);
      },
      exit(node, parent) {}
    },
    BooleanLiteral: {
      enter(node, parent) {
        parent?._context.push(node);
      },
      exit(node, parent) {}
    }
  });
  return newAst;
}
