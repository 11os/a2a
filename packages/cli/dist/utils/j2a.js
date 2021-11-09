import { compiler, JsonType, NodeTypes, traverser } from '@a2a/core';
import * as fs from 'fs';
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
export var ParseTypeEnum;
(function (ParseTypeEnum) {
    ParseTypeEnum[ParseTypeEnum["typescript"] = 1] = "typescript";
    ParseTypeEnum[ParseTypeEnum["dart"] = 2] = "dart";
})(ParseTypeEnum || (ParseTypeEnum = {}));
export const ParseType = {
    typescript: ParseTypeEnum.typescript,
    dart: ParseTypeEnum.dart
};
export const fileSuffix = {
    [ParseTypeEnum.typescript]: 'ts',
    [ParseTypeEnum.dart]: 'dart'
};
export const KeymapTypescript = (identifier) => {
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
    };
};
export const KeymapDart = (identifier) => {
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
    };
};
export const getKeymap = (type) => {
    return {
        [ParseTypeEnum.typescript]: KeymapTypescript,
        [ParseTypeEnum.dart]: KeymapDart
    }[type];
};
export const getGenerator = (type) => {
    return {
        [ParseTypeEnum.typescript]: generateTypescript,
        [ParseTypeEnum.dart]: generateDart
    }[type];
};
export function j2a(input, output, type) {
    try {
        // input dir
        const inputFiles = fs.readdirSync(input, {
            withFileTypes: true
        });
        // console.log(`inputFiles = `, inputFiles);
        // output dir
        // const outputFiles: fs.Dirent[] = fs.readdirSync(output, {
        //   withFileTypes: true
        // })
        // console.log(`outputFiles =`, outputFiles);
        // start
        inputFiles.forEach((file) => {
            j2aFile(input, file.name, output, type);
        });
    }
    catch (error) {
        console.log(error);
    }
}
export function j2aFile(input, fileName, output, type) {
    try {
        const json = fs.readFileSync(`${input}/${fileName}`, 'utf8');
        const prefix = fileName.split('.')[0];
        const result = generate({
            json,
            clazz: prefix,
            type
        });
        fs.writeFileSync(`${output}/${prefix}.${fileSuffix[type]}`, result);
        console.log(`generate ${output}/${prefix}.${fileSuffix[type]} success`);
    }
    catch (error) {
        console.log(error);
    }
}
export function generate({ json, clazz, type }) {
    const keymap = getKeymap(type);
    const gen = getGenerator(type);
    return gen({ json, clazz, keymap });
}
export function generateTypescript({ json, ast, clazz, keymap }) {
    const { params, loops } = ast ? parse({ ast }) : parse({ json });
    let template = TEMPLATE_TYPESCRIPT;
    const paramsString = params
        .map((param) => `\n  ${param.identifier}: ${keymap(param.identifier)[param.type]};${param.comment && ` // ${param.comment}`}`)
        .join('');
    template = template.replace(/###PARAMS###/g, paramsString);
    template = template.replace(/###CLAZZ###/g, clazz || '');
    template = template.replace(/###LOOPS###/g, loops.map((loop) => generateTypescript({ ast: loop.node, clazz: loop.clazz, keymap })).join(''));
    return template;
}
export function generateDart({ json, ast, clazz, keymap }) {
    const { params, loops } = ast ? parse({ ast }) : parse({ json });
    let template = TEMPLATE_DART;
    const paramsString = params
        .map((param) => `\n  ${keymap(param.identifier)[param.type]}: ${param.identifier};${param.comment && ` // ${param.comment}`}`)
        .join('');
    template = template.replace(/###PARAMS###/g, paramsString);
    const constructor = params.map((param) => `this.${param.identifier}`).join(', ');
    template = template.replace(/###CONSTRUCTOR###/g, constructor);
    template = template.replace(/###CLAZZ###/g, clazz || '');
    template = template.replace(/###LOOPS###/g, loops.map((loop) => generateDart({ ast: loop.node, clazz: loop.clazz, keymap })).join(''));
    return template;
}
export function parse({ json = '', ast }) {
    const newAst = ast ? ast : compiler(json);
    const loops = [];
    const params = [];
    function pushParams({ type, identifier, comment }) {
        params.push({
            type,
            identifier,
            comment: comment ? comment : !identifier ? '⚠️⚠️⚠️ empty name' : ''
        });
    }
    traverser({
        ast: newAst,
        deep: false,
        visitor: {
            [NodeTypes.ObjectProperty]: {
                enter(node) {
                    var _a, _b, _c;
                    const nodeValue = (_a = node.params) === null || _a === void 0 ? void 0 : _a[0];
                    const identifier = node.identifier || '';
                    const clazz = FirstUpperCase(identifier);
                    let type;
                    let value;
                    switch (nodeValue === null || nodeValue === void 0 ? void 0 : nodeValue.type) {
                        case NodeTypes.BooleanLiteral:
                            pushParams({
                                type: JsonType.bool,
                                identifier
                            });
                            break;
                        case NodeTypes.NumericLiteral:
                            type = JsonType.int;
                            value = (_b = nodeValue === null || nodeValue === void 0 ? void 0 : nodeValue.value) !== null && _b !== void 0 ? _b : '0';
                            if (value.includes('.')) {
                                type = JsonType.double;
                            }
                            else if ((value === null || value === void 0 ? void 0 : value.length) >= 10) {
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
                                node: (_c = nodeValue === null || nodeValue === void 0 ? void 0 : nodeValue.params) === null || _c === void 0 ? void 0 : _c[0],
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
                                comment: '⚠️⚠️⚠️ null value'
                            });
                            break;
                    }
                }
            }
        }
    });
    return { params, loops };
}
export const FirstUpperCase = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};
