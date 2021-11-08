import { AstNode } from '@a2a/core'

export interface ParamInfo {
  type: string
  key: string
  comment?: string
}
export interface LoopInfo {
  node: AstNode | undefined
  clazz: string
}
