import { LoopInfo, ParamInfo } from "../entity/ClazzInfo";
import { Node, NodeTypes } from "./json/types";

export const json2dart = (json: string) => {
  if (!json) return "";
  try {
    let jsonObject = JSON.parse(json);
    let loop: LoopInfo[] = [];
    let params: ParamInfo[] = [];
    for (let key in jsonObject) {
      let value = jsonObject[key];
      switch (Object.prototype.toString.call(value)) {
        case "[object Boolean]":
          params.push({
            type: "bool",
            key: key
          });
          break;
        case "[object Number]":
          params.push({
            type: "int",
            key: key
          });
          break;
        case "[object Array]":
          let obj = value?.[0];
          obj &&
            loop.push({
              json: JSON.stringify(obj),
              clazz: FirstUpperCase(key)
            });
          params.push({
            type: `List<${FirstUpperCase(key)}>`,
            key: key
          });
          break;
        case "[object Object]":
          loop.push({
            json: JSON.stringify(value),
            clazz: FirstUpperCase(key)
          });
          params.push({
            type: `${FirstUpperCase(key)}`,
            key: key
          });
          break;
        case "[object String]":
        default:
          params.push({
            type: `String`,
            key: key
          });
          break;
      }
    }
    return { params, loop };
  } catch (error) {
    return error.message;
  }
};

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

function genDart(node: Node) {
  let loop: LoopInfo[] = [];
  let params: ParamInfo[] = [];
  switch (node.type) {
    case NodeTypes.Daddy:
      break;
    case NodeTypes.ObjectExpression:
      break;
    case NodeTypes.ObjectProperty:
      break;
    case NodeTypes.ArrayExpression:
      break;
    case NodeTypes.StringLiteral:
      break;
    case NodeTypes.NumberLiteral:
      break;
    case NodeTypes.NullLiteral:
      break;
    case NodeTypes.BooleanLiteral:
      break;
    default:
      break;
  }
}
