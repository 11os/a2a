import { AstNode } from "@json2any/pson";

export interface ParamInfo {
  type: string;
  key: string;
  comment?: string;
}
export interface LoopInfo {
  node: AstNode | undefined;
  clazz: string;
}
