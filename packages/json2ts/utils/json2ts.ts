import { LoopInfo, ParamInfo } from "../entity/ClazzInfo";
import { AstNode, NodeTypes } from "@j2a/j2a/dist/index";
import { traverser } from "@j2a/j2a/dist/index";
import { compiler } from "@j2a/j2a/dist/index";

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function json2ts({
  result = "",
  ast
}: {
  result?: string;
  ast?: AstNode;
}): {
  loop: LoopInfo[];
  params: ParamInfo[];
} {
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
        enter(node: AstNode) {
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
              let type = "number";
              let value = nodeValue?.value ?? "0";
              if (value.includes(".")) {
                type = "number";
              } else if (value?.length >= 10) {
                type = "number";
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
                type: `${clazz}[]`,
                key
              });
              loop.push({
                node: nodeValue?.params?.[0],
                clazz: clazz
              });
              break;
            case NodeTypes.StringLiteral:
              pushParams({
                type: "string",
                key
              });
              break;
            case NodeTypes.NullLiteral:
            default:
              pushParams({
                type: "any",
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
