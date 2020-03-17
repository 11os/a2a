import { LoopInfo, ParamInfo } from "../entity/ClazzInfo";
import { AstNode, NodeTypes } from "@json2any/pson/dist/index";
import { traverser } from "@json2any/pson/dist/index";
import { compiler } from "@json2any/pson/dist/index";

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function json2dart({
  result = "",
  ast
}: {
  result?: string;
  ast?: AstNode;
}) {
  let newAst: AstNode = ast ? ast : compiler(result);
  let loop: LoopInfo[] = [];
  let params: ParamInfo[] = [];
  function pushParams({ type, key, comment }: ParamInfo) {
    params.push({
      type,
      key,
      comment: comment ? comment : !key ? "⚠️⚠️⚠️ name it" : ""
    });
  }
  traverser({
    ast: newAst,
    deep: false,
    visitor: {
      [NodeTypes.ObjectProperty]: {
        enter(node: AstNode, parent?: AstNode) {
          let nodeValue: AstNode | undefined = node.params?.[0];
          let key = node.identifier || "";
          let clazz = FirstUpperCase(key);
          switch (nodeValue?.type) {
            case NodeTypes.BooleanLiteral:
              pushParams({
                type: "bool",
                key
              });
              break;
            case NodeTypes.NumericLiteral:
              let type = "int";
              let value = nodeValue?.value ?? "0";
              if (value.includes(".")) {
                type = "double";
              } else if (value?.length >= 10) {
                type = "Int64";
              }
              pushParams({
                type,
                key
              });
              break;
            case NodeTypes.ObjectExpression:
              pushParams({
                type: clazz,
                key
              });
              loop.push({
                node: nodeValue,
                clazz: clazz
              });
              break;
            case NodeTypes.ArrayExpression:
              pushParams({
                type: `List<${clazz}>`,
                key
              });
              loop.push({
                node: nodeValue?.params?.[0],
                clazz: clazz
              });
              break;
            case NodeTypes.StringLiteral:
              pushParams({
                type: "String",
                key
              });
              break;
            case NodeTypes.NullLiteral:
            default:
              pushParams({
                type: "Null",
                key,
                comment: "⚠️⚠️⚠️ contact ur backend developer plz"
              });
              break;
          }
        }
      }
    }
  });
  return { params, loop };
}
