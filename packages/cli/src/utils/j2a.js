"use strict";
var _a;
exports.__esModule = true;
var fs = require("fs");
var j2a_1 = require("@j2a/j2a");
exports.TEMPLATE_TYPESCRIPT = "export interface ###CLAZZ### {###PARAMS###\n}\n\n###LOOPS###";
exports.TEMPLATE_DART = "@JsonSerializable()\nclass ###CLAZZ### {###PARAMS###\n  ###CLAZZ###({ ###CONSTRUCTOR### });\n\n  factory ###CLAZZ###.fromJson(Map<String, dynamic> json) => _$###CLAZZ###FromJson(json);\n\n  Map<String, dynamic> toJson() => _$###CLAZZ###ToJson(this);\n}\n\n###LOOPS###";
var ParseTypeEnum;
(function (ParseTypeEnum) {
    ParseTypeEnum[ParseTypeEnum["typescript"] = 1] = "typescript";
    ParseTypeEnum[ParseTypeEnum["dart"] = 2] = "dart";
})(ParseTypeEnum = exports.ParseTypeEnum || (exports.ParseTypeEnum = {}));
exports.ParseType = {
    typescript: ParseTypeEnum.typescript,
    dart: ParseTypeEnum.dart
};
exports.fileSuffix = (_a = {},
    _a[ParseTypeEnum.typescript] = "ts",
    _a[ParseTypeEnum.dart] = "dart",
    _a);
exports.KeymapTypescript = function (identifier) {
    var _a;
    return _a = {},
        _a[j2a_1.JsonType.int] = "number",
        _a[j2a_1.JsonType.bigInt] = "number",
        _a[j2a_1.JsonType.double] = "number",
        _a[j2a_1.JsonType.string] = "string",
        _a[j2a_1.JsonType.object] = "" + exports.FirstUpperCase(identifier),
        _a[j2a_1.JsonType.array] = exports.FirstUpperCase(identifier) + "[]",
        _a[j2a_1.JsonType.bool] = "boolean",
        _a[j2a_1.JsonType["null"]] = "any",
        _a[j2a_1.JsonType.any] = "any",
        _a;
};
exports.KeymapDart = function (identifier) {
    var _a;
    return _a = {},
        _a[j2a_1.JsonType.int] = "number",
        _a[j2a_1.JsonType.bigInt] = "Int64",
        _a[j2a_1.JsonType.double] = "double",
        _a[j2a_1.JsonType.string] = "String",
        _a[j2a_1.JsonType.object] = "" + exports.FirstUpperCase(identifier),
        _a[j2a_1.JsonType.array] = "List<" + exports.FirstUpperCase(identifier) + ">",
        _a[j2a_1.JsonType.bool] = "bool",
        _a[j2a_1.JsonType["null"]] = "Null",
        _a[j2a_1.JsonType.any] = "Null",
        _a;
};
exports.getKeymap = function (type) {
    var _a;
    return (_a = {},
        _a[ParseTypeEnum.typescript] = exports.KeymapTypescript,
        _a[ParseTypeEnum.dart] = exports.KeymapDart,
        _a)[type];
};
exports.getGenerator = function (type) {
    var _a;
    return (_a = {},
        _a[ParseTypeEnum.typescript] = generateTypescript,
        _a[ParseTypeEnum.dart] = generateDart,
        _a)[type];
};
function j2a(input, output, type) {
    try {
        // input dir
        var inputFiles = fs.readdirSync(input, {
            withFileTypes: true
        });
        // console.log(`inputFiles = `, inputFiles);
        // output dir
        var outputFiles = fs.readdirSync(output, {
            withFileTypes: true
        });
        // console.log(`outputFiles =`, outputFiles);
        // start
        inputFiles.forEach(function (file) {
            var json = fs.readFileSync(input + "/" + file.name, "utf8");
            // console.log(json);
            var fileName = file.name.split(".")[0];
            var result = generate({
                json: json,
                clazz: fileName,
                type: type
            });
            fs.writeFileSync(output + "/" + fileName + "." + exports.fileSuffix[type], result);
            console.log("generate " + output + "/" + fileName + "." + exports.fileSuffix[type] + " success");
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.j2a = j2a;
function generate(_a) {
    var json = _a.json, clazz = _a.clazz, type = _a.type;
    var keymap = exports.getKeymap(type);
    var gen = exports.getGenerator(type);
    return gen({ json: json, clazz: clazz, keymap: keymap });
}
exports.generate = generate;
function generateTypescript(_a) {
    var json = _a.json, ast = _a.ast, clazz = _a.clazz, keymap = _a.keymap;
    var _b = ast ? parse({ ast: ast }) : parse({ json: json }), params = _b.params, loops = _b.loops;
    var template = exports.TEMPLATE_TYPESCRIPT;
    var paramsString = params
        .map(function (param) {
        return "\n  " + param.identifier + ": " + keymap(param.identifier)[param.type] + ";" + (param.comment && " // " + param.comment);
    })
        .join("");
    template = template.replace(/###PARAMS###/g, paramsString);
    template = template.replace(/###CLAZZ###/g, clazz || "");
    template = template.replace(/###LOOPS###/g, loops
        .map(function (loop) {
        return generateTypescript({ ast: loop.node, clazz: loop.clazz, keymap: keymap });
    })
        .join(""));
    return template;
}
exports.generateTypescript = generateTypescript;
function generateDart(_a) {
    var json = _a.json, ast = _a.ast, clazz = _a.clazz, keymap = _a.keymap;
    var _b = ast ? parse({ ast: ast }) : parse({ json: json }), params = _b.params, loops = _b.loops;
    var template = exports.TEMPLATE_DART;
    var paramsString = params
        .map(function (param) {
        return "\n  " + keymap(param.identifier)[param.type] + ": " + param.identifier + ";" + (param.comment && " // " + param.comment);
    })
        .join("");
    template = template.replace(/###PARAMS###/g, paramsString);
    var constructor = params.map(function (param) { return "this." + param.identifier; }).join(", ");
    template = template.replace(/###CONSTRUCTOR###/g, constructor);
    template = template.replace(/###CLAZZ###/g, clazz || "");
    template = template.replace(/###LOOPS###/g, loops
        .map(function (loop) { return generateDart({ ast: loop.node, clazz: loop.clazz, keymap: keymap }); })
        .join(""));
    return template;
}
exports.generateDart = generateDart;
function parse(_a) {
    var _b;
    var _c = _a.json, json = _c === void 0 ? "" : _c, ast = _a.ast;
    var newAst = ast ? ast : j2a_1.compiler(json);
    var loops = [];
    var params = [];
    function pushParams(_a) {
        var type = _a.type, identifier = _a.identifier, comment = _a.comment;
        params.push({
            type: type,
            identifier: identifier,
            comment: comment ? comment : !identifier ? "⚠️⚠️⚠️ empty name" : ""
        });
    }
    j2a_1.traverser({
        ast: newAst,
        deep: false,
        visitor: (_b = {},
            _b[j2a_1.NodeTypes.ObjectProperty] = {
                enter: function (node, parent) {
                    var _a, _b, _c, _d, _e, _f, _g;
                    var nodeValue = (_a = node.params) === null || _a === void 0 ? void 0 : _a[0];
                    var identifier = node.identifier || "";
                    var clazz = exports.FirstUpperCase(identifier);
                    switch ((_b = nodeValue) === null || _b === void 0 ? void 0 : _b.type) {
                        case j2a_1.NodeTypes.BooleanLiteral:
                            pushParams({
                                type: j2a_1.JsonType.bool,
                                identifier: identifier
                            });
                            break;
                        case j2a_1.NodeTypes.NumericLiteral:
                            var type = j2a_1.JsonType.int;
                            var value = (_d = (_c = nodeValue) === null || _c === void 0 ? void 0 : _c.value, (_d !== null && _d !== void 0 ? _d : "0"));
                            if (value.includes(".")) {
                                type = j2a_1.JsonType.double;
                            }
                            else if (((_e = value) === null || _e === void 0 ? void 0 : _e.length) >= 10) {
                                type = j2a_1.JsonType.bigInt;
                            }
                            pushParams({
                                type: type,
                                identifier: identifier
                            });
                            break;
                        case j2a_1.NodeTypes.ObjectExpression:
                            pushParams({
                                type: j2a_1.JsonType.object,
                                identifier: identifier
                            });
                            loops.push({
                                node: nodeValue,
                                clazz: clazz
                            });
                            break;
                        case j2a_1.NodeTypes.ArrayExpression:
                            pushParams({
                                type: j2a_1.JsonType.array,
                                identifier: identifier
                            });
                            loops.push({
                                node: (_g = (_f = nodeValue) === null || _f === void 0 ? void 0 : _f.params) === null || _g === void 0 ? void 0 : _g[0],
                                clazz: clazz
                            });
                            break;
                        case j2a_1.NodeTypes.StringLiteral:
                            pushParams({
                                type: j2a_1.JsonType.string,
                                identifier: identifier
                            });
                            break;
                        case j2a_1.NodeTypes.NullLiteral:
                        default:
                            pushParams({
                                type: j2a_1.JsonType.any,
                                identifier: identifier,
                                comment: "⚠️⚠️⚠️ null value"
                            });
                            break;
                    }
                }
            },
            _b)
    });
    return { params: params, loops: loops };
}
exports.parse = parse;
exports.FirstUpperCase = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
};
