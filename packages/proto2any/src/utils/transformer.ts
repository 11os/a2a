export interface Clazz {
  name: string
  type: string
  fields: Field[]
  isList?: boolean
}

export interface Field {
  name: string
  type: string
}

export function transform(root: any) {
  const clazzes: Clazz[] = []

  function deconstruction({ node, clazzName }: { node: any; clazzName?: string }) {
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
          } as Field
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
            type: node.values[key]
          } as Field
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
