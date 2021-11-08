import { AstNode, NodeTypes, Visitor } from './types'

/**
 * enter & exit ast node
 *
 * @param ast
 * @param deep
 * @param visitor
 */
export function traverser({ ast, deep = true, visitor }: { ast: AstNode; visitor: Visitor; deep?: boolean }) {
  function traveresArray(array: AstNode[], parent: AstNode) {
    array.forEach((child) => {
      traverseNode(child, parent)
    })
  }
  function traverseNode(node: AstNode, parent?: AstNode) {
    const method = visitor[node.type]
    if (method && method.enter) {
      method.enter(node, parent)
    }
    switch (node.type) {
      case NodeTypes.Daddy:
      case NodeTypes.ArrayExpression:
      case NodeTypes.ObjectExpression:
        node.params && traveresArray(node.params, node)
        break
      case NodeTypes.ObjectProperty:
        deep && node.params && traveresArray(node.params, node)
        break
      case NodeTypes.StringLiteral:
      case NodeTypes.NumericLiteral:
      case NodeTypes.BooleanLiteral:
      case NodeTypes.NullLiteral:
      case NodeTypes.SplitExpression:
        break
      default:
        throw new TypeError(node.type.toString())
    }
    if (method && method.exit) {
      method.exit(node, parent)
    }
  }
  traverseNode(ast)
}

/**
 * TODO: ts or dart
 *
 * origin ast to transformed ast
 *
 * @param ast
 */
export function transformer(ast: AstNode): AstNode {
  const newAst: AstNode = {
    type: NodeTypes.Daddy,
    params: []
  }

  ast._context = newAst.params

  traverser({
    ast: ast,
    visitor: {
      [NodeTypes.ObjectExpression]: {
        enter(node, parent) {
          node._context = node.params
          const expression = {
            type: NodeTypes.ObjectExpression,
            params: []
          }
          node._context = expression.params
          parent?._context.push(expression)
        }
        // exit(node, parent) {}
      },
      [NodeTypes.ObjectProperty]: {
        enter(node, parent) {
          const expression = {
            type: NodeTypes.ObjectProperty,
            identifier: node.identifier,
            params: []
          }
          node._context = expression.params
          parent?._context.push(expression)
        }
        // exit(node, parent) {}
      },
      [NodeTypes.ArrayExpression]: {
        enter(node, parent) {
          const expression = {
            type: NodeTypes.ArrayExpression,
            params: []
          }
          node._context = expression.params
          parent?._context.push(expression)
        }
        // exit(node, parent) {}
      },
      [NodeTypes.StringLiteral]: {
        enter(node, parent) {
          parent?._context.push(node)
        }
        // exit(node, parent) {}
      },
      [NodeTypes.NumericLiteral]: {
        enter(node, parent) {
          parent?._context.push(node)
        }
        // exit(node, parent) {}
      },
      [NodeTypes.NullLiteral]: {
        enter(node, parent) {
          parent?._context.push(node)
        }
        // exit(node, parent) {}
      },
      [NodeTypes.BooleanLiteral]: {
        enter(node, parent) {
          parent?._context.push(node)
        }
        // exit(node, parent) {}
      }
    }
  })
  return newAst
}
