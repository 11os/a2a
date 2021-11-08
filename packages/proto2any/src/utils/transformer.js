import { dartValueType, tsValueType } from './valueType'

export function transform(root) {
  const clazzes = []

  function deconstruction({ node, clazzName }) {
    if (undefined !== node.fields) {
      // clazz
      clazzes.push({
        name: clazzName ?? '',
        type: 'clazz',
        fields: Object.keys(node.fields).map((key) => {
          return {
            name: key,
            type: node.fields[key].type,
            isList: node.fields[key].rule === 'repeated'
          }
        })
      })
      return
    }
    if (undefined !== node.values) {
      // enum
      clazzes.push({
        name: clazzName ?? '',
        type: 'enum',
        fields: Object.keys(node.values).map((key) => {
          return {
            name: key,
            type: 'enum',
            value: node.values[key]
          }
        })
      })
      return
    }
    if (undefined !== node.nested) {
      // continue recursion
      deconstruction({ node: node.nested })
      return
    } else if (Object.keys(node).length > 0) {
      Object.keys(node).forEach((key) => {
        deconstruction({ node: node[key], clazzName: key })
      })
    }
  }

  deconstruction({ node: root.nested })

  return clazzes
}

export function buildDartCode(clazzes) {
  const dartClazzTemplate = `@JsonSerializable()
class ###CLAZZ_NAME### { 
###CLAZZ_DEFINE###

  ###CLAZZ_NAME###({ ###CLAZZ_PARAMS### });

  factory ###CLAZZ_NAME###.fromJson(Map<String, dynamic> json) => _$###CLAZZ_NAME###FromJson(json); 
  Map<String, dynamic> toJson() => _$###CLAZZ_NAME###ToJson(this); 
}`
  const dartEnumTemplate = `
class ###CLAZZ_NAME### { 
###ENUM_PARAMS###
}
`
  return clazzes
    .map((clazz) => {
      const clazzName = clazz.name
      if (clazz.type === 'clazz') {
        const clazzDefine = clazz.fields
          .map((field) => {
            const type = field.isList ? `List<${dartValueType(field.type)}>` : dartValueType(field.type)
            return `  ${type} ${field.name};`
          })
          .join('\n')
        const clazzParams = clazz.fields
          .map((field) => {
            return `this.${field.name}`
          })
          .join(',')
        return dartClazzTemplate
          .replace(/###CLAZZ_NAME###/g, clazzName)
          .replace(/###CLAZZ_DEFINE###/g, clazzDefine)
          .replace(/###CLAZZ_PARAMS###/g, clazzParams)
      } else {
        const enumParams = clazz.fields
          .map((field) => {
            return `  static const String ${field.name} = '${field.name}';`
          })
          .join('\n')
        return dartEnumTemplate.replace(/###CLAZZ_NAME###/g, clazzName).replace(/###ENUM_PARAMS###/g, enumParams)
      }
    })
    .join('\n')
}

export function buildTsCode(clazzes) {
  const tsClazzTemplate = `export interface ###CLAZZ_NAME### { 
###CLAZZ_DEFINE###
}
`
  const tsEnumTemplate = `export type ###CLAZZ_NAME### = ###CLAZZ_DEFINE###
`
  return clazzes
    .map((clazz) => {
      const clazzName = clazz.name
      if (clazz.type !== 'enum') {
        const clazzDefine = clazz.fields
          .map((field) => {
            const type = field.isList ? `${tsValueType(field.type)}[]` : tsValueType(field.type)
            return `  ${field.name}: ${type};`
          })
          .join('\n')
        return tsClazzTemplate.replace(/###CLAZZ_NAME###/g, clazzName).replace(/###CLAZZ_DEFINE###/g, clazzDefine)
      } else {
        const clazzDefine = clazz.fields
          .map((field) => {
            return `'${field.name}'`
          })
          .join(' | ')
        return tsEnumTemplate.replace(/###CLAZZ_NAME###/g, clazzName).replace(/###CLAZZ_DEFINE###/g, clazzDefine)
      }
    })
    .join('\n')
}
