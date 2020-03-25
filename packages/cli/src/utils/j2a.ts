import * as fs from "fs";

import {
  AstNode,
  LoopAst,
  JsonItem,
  compiler,
  NodeTypes,
  JsonType,
  traverser
} from "@j2a/j2a";

export const TEMPLATE_TYPESCRIPT = `export interface ###CLAZZ### {###PARAMS###
}

###LOOPS###`;

export const TEMPLATE_DART = `@JsonSerializable()
class ###CLAZZ### {###PARAMS###
  ###CLAZZ###({ ###CONSTRUCTOR### });

  factory ###CLAZZ###.fromJson(Map<String, dynamic> json) => _$###CLAZZ###FromJson(json);

  Map<String, dynamic> toJson() => _$###CLAZZ###ToJson(this);
}

###LOOPS###`;

export enum ParseTypeEnum {
  typescript = 1,
  dart
}

export const ParseType: {
  [key: string]: ParseTypeEnum;
} = {
  typescript: ParseTypeEnum.typescript,
  dart: ParseTypeEnum.dart
};

export const fileSuffix = {
  [ParseTypeEnum.typescript]: "ts",
  [ParseTypeEnum.dart]: "dart"
};

export const KeymapTypescript = (identifier: string) => {
  return {
    [JsonType.int]: "number",
    [JsonType.bigInt]: "number",
    [JsonType.double]: "number",
    [JsonType.string]: "string",
    [JsonType.object]: `${FirstUpperCase(identifier)}`,
    [JsonType.array]: `${FirstUpperCase(identifier)}[]`,
    [JsonType.bool]: "boolean",
    [JsonType.null]: "any",
    [JsonType.any]: "any"
  };
};

export const KeymapDart = (identifier: string) => {
  return {
    [JsonType.int]: "number",
    [JsonType.bigInt]: "Int64",
    [JsonType.double]: "double",
    [JsonType.string]: "String",
    [JsonType.object]: `${FirstUpperCase(identifier)}`,
    [JsonType.array]: `List<${FirstUpperCase(identifier)}>`,
    [JsonType.bool]: "bool",
    [JsonType.null]: "Null",
    [JsonType.any]: "Null"
  };
};

export const getKeymap = (type: ParseTypeEnum) => {
  return {
    [ParseTypeEnum.typescript]: KeymapTypescript,
    [ParseTypeEnum.dart]: KeymapDart
  }[type];
};

export const getGenerator = (type: ParseTypeEnum) => {
  return {
    [ParseTypeEnum.typescript]: generateTypescript,
    [ParseTypeEnum.dart]: generateDart
  }[type];
};

export function j2a(
  input: fs.PathLike,
  output: fs.PathLike,
  type: ParseTypeEnum
) {
  try {
    // input dir
    const inputFiles: fs.Dirent[] = fs.readdirSync(input, {
      withFileTypes: true
    });
    // console.log(`inputFiles = `, inputFiles);
    // output dir
    const outputFiles: fs.Dirent[] = fs.readdirSync(output, {
      withFileTypes: true
    });
    // console.log(`outputFiles =`, outputFiles);
    // start
    inputFiles.forEach(file => {
      let json = fs.readFileSync(`${input}/${file.name}`, "utf8");
      // console.log(json);
      let fileName = file.name.split(".")[0];
      let result = generate({
        json,
        clazz: fileName,
        type
      });
      fs.writeFileSync(`${output}/${fileName}.${fileSuffix[type]}`, result);
      console.log(`generate ${output}/${fileName}.${fileSuffix[type]} success`);
    });
  } catch (error) {
    console.log(error);
  }
}

export function generate({
  json,
  clazz,
  type
}: {
  json?: string;
  clazz?: string;
  type: ParseTypeEnum;
}): string {
  let keymap = getKeymap(type);
  let gen = getGenerator(type);
  return gen({ json, clazz, keymap });
}

export function generateTypescript({
  json,
  ast,
  clazz,
  keymap
}: {
  json?: string;
  ast?: AstNode;
  clazz?: string;
  keymap: Function;
}) {
  const { params, loops } = ast ? parse({ ast }) : parse({ json });
  let template = TEMPLATE_TYPESCRIPT;
  let paramsString = params
    .map(
      param =>
        `\n  ${param.identifier}: ${
          keymap(param.identifier)[param.type]
        };${param.comment && ` // ${param.comment}`}`
    )
    .join("");
  template = template.replace(/###PARAMS###/g, paramsString);
  template = template.replace(/###CLAZZ###/g, clazz || "");
  template = template.replace(
    /###LOOPS###/g,
    loops
      .map(loop =>
        generateTypescript({ ast: loop.node, clazz: loop.clazz, keymap })
      )
      .join("")
  );
  return template;
}

export function generateDart({
  json,
  ast,
  clazz,
  keymap
}: {
  json?: string;
  ast?: AstNode;
  clazz?: string;
  keymap: Function;
}) {
  const { params, loops } = ast ? parse({ ast }) : parse({ json });
  let template = TEMPLATE_DART;
  let paramsString = params
    .map(
      param =>
        `\n  ${keymap(param.identifier)[param.type]}: ${
          param.identifier
        };${param.comment && ` // ${param.comment}`}`
    )
    .join("");
  template = template.replace(/###PARAMS###/g, paramsString);
  let constructor = params.map(param => `this.${param.identifier}`).join(", ");
  template = template.replace(/###CONSTRUCTOR###/g, constructor);
  template = template.replace(/###CLAZZ###/g, clazz || "");
  template = template.replace(
    /###LOOPS###/g,
    loops
      .map(loop => generateDart({ ast: loop.node, clazz: loop.clazz, keymap }))
      .join("")
  );
  return template;
}

export function parse({ json = "", ast }: { json?: string; ast?: AstNode }) {
  let newAst: AstNode = ast ? ast : compiler(json);
  let loops: LoopAst[] = [];
  let params: JsonItem[] = [];
  function pushParams({ type, identifier, comment }: JsonItem) {
    params.push({
      type,
      identifier,
      comment: comment ? comment : !identifier ? "⚠️⚠️⚠️ empty name" : ""
    });
  }
  traverser({
    ast: newAst,
    deep: false,
    visitor: {
      [NodeTypes.ObjectProperty]: {
        enter(node: AstNode, parent?: AstNode) {
          let nodeValue: AstNode | undefined = node.params?.[0];
          let identifier = node.identifier || "";
          let clazz = FirstUpperCase(identifier);
          switch (nodeValue?.type) {
            case NodeTypes.BooleanLiteral:
              pushParams({
                type: JsonType.bool,
                identifier
              });
              break;
            case NodeTypes.NumericLiteral:
              let type = JsonType.int;
              let value = nodeValue?.value ?? "0";
              if (value.includes(".")) {
                type = JsonType.double;
              } else if (value?.length >= 10) {
                type = JsonType.bigInt;
              }
              pushParams({
                type,
                identifier
              });
              break;
            case NodeTypes.ObjectExpression:
              pushParams({
                type: JsonType.object,
                identifier
              });
              loops.push({
                node: nodeValue,
                clazz: clazz
              });
              break;
            case NodeTypes.ArrayExpression:
              pushParams({
                type: JsonType.array,
                identifier
              });
              loops.push({
                node: nodeValue?.params?.[0],
                clazz: clazz
              });
              break;
            case NodeTypes.StringLiteral:
              pushParams({
                type: JsonType.string,
                identifier
              });
              break;
            case NodeTypes.NullLiteral:
            default:
              pushParams({
                type: JsonType.any,
                identifier,
                comment: "⚠️⚠️⚠️ null value"
              });
              break;
          }
        }
      }
    }
  });
  return { params, loops };
}

export const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
