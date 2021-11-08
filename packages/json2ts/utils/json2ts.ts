/* eslint-disable no-case-declarations */
import { AstNode, compiler, NodeTypes, traverser } from '@a2a/core'
import { LoopInfo, ParamInfo } from '../entity/ClazzInfo'

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function parseLiteral(type?: NodeTypes) {
  return type
    ? {
        [NodeTypes.NullLiteral]: 'any',
        [NodeTypes.BooleanLiteral]: 'bool',
        [NodeTypes.StringLiteral]: 'string',
        [NodeTypes.NumericLiteral]: 'number',
        [NodeTypes.Daddy]: '',
        [NodeTypes.ObjectProperty]: '',
        [NodeTypes.AssignmentExpression]: '',
        [NodeTypes.SplitExpression]: '',
        [NodeTypes.ObjectExpression]: '',
        [NodeTypes.ArrayExpression]: ''
      }[type]
    : ''
}

export function json2ts({ result = '', ast }: { result?: string; ast?: AstNode }): {
  loop: LoopInfo[]
  params: ParamInfo[]
} {
  const newAst: AstNode = ast ? ast : compiler(result)
  const loop: LoopInfo[] = []
  const params: ParamInfo[] = []

  function pushParams({ type, key, comment }: ParamInfo) {
    params.push({
      type,
      key,
      comment: comment ? comment : !key ? '⚠️⚠️⚠️ name it' : ''
    })
  }
  traverser({
    ast: newAst,
    deep: false,
    visitor: {
      [NodeTypes.ObjectProperty]: {
        enter(node: AstNode) {
          const nodeValue: AstNode | undefined = node.params?.[0]
          const key = node.identifier || ''
          const clazz = FirstUpperCase(key)
          const typeName = parseLiteral(nodeValue?.type)
          switch (nodeValue?.type) {
            case NodeTypes.BooleanLiteral:
              pushParams({
                type: typeName,
                key
              })
              break
            case NodeTypes.NumericLiteral:
              let type = typeName
              const value = nodeValue?.value ?? '0'
              if (value.includes('.')) {
                type = typeName
              } else if (value?.length >= 10) {
                type = typeName
              }
              pushParams({
                type,
                key
              })
              break
            case NodeTypes.ObjectExpression:
              pushParams({
                type: clazz,
                key
              })
              loop.push({
                node: nodeValue,
                clazz: clazz
              })
              break
            case NodeTypes.ArrayExpression:
              const node = nodeValue?.params?.[0]
              if (node?.type === NodeTypes.ObjectExpression) {
                pushParams({
                  type: `${clazz}[]`,
                  key
                })
                loop.push({
                  node: node,
                  clazz: clazz
                })
              } else {
                pushParams({
                  type: `${parseLiteral(node?.type)}[]`,
                  key
                })
              }
              break
            case NodeTypes.StringLiteral:
              pushParams({
                type: typeName,
                key
              })
              break
            case NodeTypes.NullLiteral:
            default:
              pushParams({
                type: typeName,
                key,
                comment: '⚠️⚠️⚠️ contact ur backend developer plz'
              })
              break
          }
        }
      }
    }
  })
  return { params, loop }
}
