import { AstNode, compiler, JsonItem, JsonType, LoopAst, NodeTypes, traverser } from '@a2a/core'
import { TEMPLATE_DART, TEMPLATE_TYPESCRIPT } from './templates'
import { FirstUpperCase } from './utils'

export enum ParseTypeEnum {
  typescript = 1,
  dart
}

export const ParseType: {
  [key: string]: ParseTypeEnum
} = {
  typescript: ParseTypeEnum.typescript,
  dart: ParseTypeEnum.dart
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

export const KeymapTypescript = (identifier: string) => {
  return {
    [JsonType.int]: 'number',
    [JsonType.bigInt]: 'number',
    [JsonType.double]: 'number',
    [JsonType.string]: 'string',
    [JsonType.object]: `${FirstUpperCase(identifier)}`,
    [JsonType.array]: `${FirstUpperCase(identifier)}[]`,
    [JsonType.bool]: 'boolean',
    [JsonType.null]: 'any',
    [JsonType.any]: 'any'
  }
}

export const KeymapDart = (identifier: string) => {
  return {
    [JsonType.int]: 'number',
    [JsonType.bigInt]: 'Int64',
    [JsonType.double]: 'double',
    [JsonType.string]: 'String',
    [JsonType.object]: `${FirstUpperCase(identifier)}`,
    [JsonType.array]: `List<${FirstUpperCase(identifier)}>`,
    [JsonType.bool]: 'bool',
    [JsonType.null]: 'Null',
    [JsonType.any]: 'Null'
  }
}

export const getKeymap = (type: ParseTypeEnum) => {
  return {
    [ParseTypeEnum.typescript]: KeymapTypescript,
    [ParseTypeEnum.dart]: KeymapDart
  }[type]
}

export const getGenerator = (type: ParseTypeEnum) => {
  return {
    [ParseTypeEnum.typescript]: generateTypescript,
    [ParseTypeEnum.dart]: generateDart
  }[type]
}

export function generate({ json, clazz, type }: { json?: string; clazz?: string; type: ParseTypeEnum }): string {
  const keymap = getKeymap(type)
  const gen = getGenerator(type)
  return gen({ json, clazz, keymap })
}

export function generateTypescript({
  json,
  ast,
  clazz,
  keymap
}: {
  json?: string
  ast?: AstNode
  clazz?: string
  keymap: (str?: any) => any
}) {
  const { params, loops } = ast ? parse({ ast }) : parse({ json })
  let template = TEMPLATE_TYPESCRIPT
  const paramsString = params
    .map(
      (param) =>
        `\n  ${param.identifier}: ${keymap(param.identifier)[param.type] || param.type};${
          param.comment && ` // ${param.comment}`
        }`
    )
    .join('')
  template = template.replace(/###PARAMS###/g, paramsString)
  template = template.replace(/###CLAZZ###/g, clazz || '')
  template = template.replace(
    /###LOOPS###/g,
    loops.map((loop) => generateTypescript({ ast: loop.node, clazz: loop.clazz, keymap })).join('')
  )
  return template
}

export function generateDart({
  json,
  ast,
  clazz,
  keymap
}: {
  json?: string
  ast?: AstNode
  clazz?: string
  keymap: (str?: any) => any
}) {
  const { params, loops } = ast ? parse({ ast }) : parse({ json })
  let template = TEMPLATE_DART
  const paramsString = params
    .map(
      (param) =>
        `\n  ${keymap(param.identifier)[param.type]}: ${param.identifier};${param.comment && ` // ${param.comment}`}`
    )
    .join('')
  template = template.replace(/###PARAMS###/g, paramsString)
  const constructor = params.map((param) => `this.${param.identifier}`).join(', ')
  template = template.replace(/###CONSTRUCTOR###/g, constructor)
  template = template.replace(/###CLAZZ###/g, clazz || '')
  template = template.replace(
    /###LOOPS###/g,
    loops.map((loop) => generateDart({ ast: loop.node, clazz: loop.clazz, keymap })).join('')
  )
  return template
}

export function parse({ json = '', ast }: { json?: string; ast?: AstNode }) {
  const newAst: AstNode = ast ? ast : compiler(json)
  const loops: LoopAst[] = []
  const params: JsonItem[] = []
  function pushParams({ type, identifier, comment }: JsonItem) {
    params.push({
      type,
      identifier,
      comment: comment ? comment : !identifier ? '⚠️⚠️⚠️ empty name' : ''
    })
  }
  traverser({
    ast: newAst,
    deep: false,
    visitor: {
      [NodeTypes.ObjectProperty]: {
        enter(node: AstNode) {
          const nodeValue: AstNode | undefined = node.params?.[0]
          const identifier = node.identifier || ''
          const clazz = FirstUpperCase(identifier)
          let type
          let value
          switch (nodeValue?.type) {
            case NodeTypes.BooleanLiteral:
              pushParams({
                type: JsonType.bool,
                identifier
              })
              break
            case NodeTypes.NumericLiteral:
              type = JsonType.int
              value = nodeValue?.value ?? '0'
              if (value.includes('.')) {
                type = JsonType.double
              } else if (value?.length >= 10) {
                type = JsonType.bigInt
              }
              pushParams({
                type,
                identifier
              })
              break
            case NodeTypes.ObjectExpression:
              pushParams({
                type: JsonType.object,
                identifier
              })
              loops.push({
                node: nodeValue,
                clazz: clazz
              })
              break
            case NodeTypes.ArrayExpression:
              // eslint-disable-next-line no-case-declarations
              const node = nodeValue?.params?.[0]
              if (node?.type === NodeTypes.ObjectExpression) {
                pushParams({
                  type: `${clazz}[]`,
                  identifier
                })
                loops.push({
                  node: node,
                  clazz: clazz
                })
              } else {
                pushParams({
                  type: `${parseLiteral(node?.type)}[]`,
                  identifier
                })
              }
              break
            case NodeTypes.StringLiteral:
              pushParams({
                type: JsonType.string,
                identifier
              })
              break
            case NodeTypes.NullLiteral:
            default:
              pushParams({
                type: JsonType.any,
                identifier,
                comment: '⚠️⚠️⚠️ null value'
              })
              break
          }
        }
      }
    }
  })
  return { params, loops }
}
