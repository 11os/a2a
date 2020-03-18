import { AstNode } from "@json2any/pson/dist/index";

export interface ParamInfo {
  type: string;
  key: string;
  comment?: string;
}
export interface LoopInfo {
  node: AstNode | undefined;
  clazz: string;
}
