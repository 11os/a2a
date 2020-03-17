(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.json = {}));
}(this, (function (exports) { 'use strict';

  (function (TokenTypes) {
      TokenTypes[TokenTypes["null"] = 0] = "null";
      TokenTypes[TokenTypes["bool"] = 1] = "bool";
      TokenTypes[TokenTypes["number"] = 2] = "number";
      TokenTypes[TokenTypes["string"] = 3] = "string";
      TokenTypes[TokenTypes["assign"] = 4] = "assign";
      TokenTypes[TokenTypes["split"] = 5] = "split";
      TokenTypes[TokenTypes["object"] = 6] = "object";
      TokenTypes[TokenTypes["array"] = 7] = "array";
  })(exports.TokenTypes || (exports.TokenTypes = {}));
  (function (NodeTypes) {
      NodeTypes[NodeTypes["Daddy"] = 0] = "Daddy";
      NodeTypes[NodeTypes["BooleanLiteral"] = 1] = "BooleanLiteral";
      NodeTypes[NodeTypes["NullLiteral"] = 2] = "NullLiteral";
      NodeTypes[NodeTypes["NumericLiteral"] = 3] = "NumericLiteral";
      NodeTypes[NodeTypes["ObjectProperty"] = 4] = "ObjectProperty";
      NodeTypes[NodeTypes["StringLiteral"] = 5] = "StringLiteral";
      NodeTypes[NodeTypes["AssignmentExpression"] = 6] = "AssignmentExpression";
      NodeTypes[NodeTypes["SplitExpression"] = 7] = "SplitExpression";
      NodeTypes[NodeTypes["ObjectExpression"] = 8] = "ObjectExpression";
      NodeTypes[NodeTypes["ArrayExpression"] = 9] = "ArrayExpression";
  })(exports.NodeTypes || (exports.NodeTypes = {}));

  function createCompilerError(code, location, messages) {
      const msg = (messages || errorMessages)[code];
      const error = new SyntaxError(String(msg));
      error.code = code;
      error.location = location;
      return error;
  }
  (function (ErrorCodes) {
      ErrorCodes[ErrorCodes["TOKENIZER_ERROR"] = 0] = "TOKENIZER_ERROR";
      ErrorCodes[ErrorCodes["TOKENIZER_PAIR_ERROR"] = 1] = "TOKENIZER_PAIR_ERROR";
  })(exports.ErrorCodes || (exports.ErrorCodes = {}));
  const errorMessages = {
      // tokenizer errors
      [exports.ErrorCodes.TOKENIZER_ERROR]: "tokenizer error",
      [exports.ErrorCodes.TOKENIZER_PAIR_ERROR]: "tokenizer pair error"
  };

  /**
   * json string to token array
   *
   * don't ask me why not merge same code
   *
   * @param text json string
   */
  function tokenizer(text) {
      var _a, _b, _c;
      // init cursor
      let line = 1, column = 1, cursor = 0;
      // init lexer array
      let tokens = [];
      while (cursor < text.length) {
          let char = text.charAt(cursor);
          let preToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
          // {
          if (char === "{") {
              let location = {
                  start: {
                      line,
                      column
                  },
                  end: {
                      line,
                      column: ++column
                  },
                  source: char
              };
              tokens.push({
                  type: exports.TokenTypes.object,
                  value: char,
                  location
              });
              cursor++;
              continue;
          }
          // }
          if (char === "}") {
              let location = {
                  start: {
                      line,
                      column
                  },
                  end: {
                      line,
                      column: ++column
                  },
                  source: char
              };
              if ((preToken === null || preToken === void 0 ? void 0 : preToken.type) === exports.TokenTypes.split) {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              tokens.push({
                  type: exports.TokenTypes.object,
                  value: char,
                  location
              });
              cursor++;
              continue;
          }
          // [
          if (char === "[") {
              tokens.push({
                  type: exports.TokenTypes.array,
                  value: char,
                  location: {
                      start: {
                          line,
                          column
                      },
                      end: {
                          line,
                          column: ++column
                      },
                      source: char
                  }
              });
              cursor++;
              continue;
          }
          // ]
          if (char === "]") {
              tokens.push({
                  type: exports.TokenTypes.array,
                  value: char,
                  location: {
                      start: {
                          line,
                          column
                      },
                      end: {
                          line,
                          column: ++column
                      },
                      source: char
                  }
              });
              cursor++;
              continue;
          }
          // space
          if (/\s/.test(char)) {
              if (/\n/.test(char)) {
                  line++;
                  column = 1;
              }
              else {
                  column++;
              }
              cursor++;
              continue;
          }
          if (char === "n") {
              let value = "";
              let target = "null";
              let start = {
                  line,
                  column
              };
              while (target.indexOf(char) > -1) {
                  value += char;
                  char = text[++cursor];
                  ++column;
              }
              let location = {
                  start,
                  end: {
                      line,
                      column: column
                  },
                  source: value
              };
              if (value === target) {
                  tokens.push({
                      type: exports.TokenTypes.null,
                      value: target,
                      location
                  });
              }
              else {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              continue;
          }
          if (char === "t" || char === "f") {
              let value = "";
              const target = {
                  t: "true",
                  f: "false"
              }[char];
              let start = {
                  line,
                  column
              };
              while (target.indexOf(char) > -1) {
                  value += char;
                  char = text[++cursor];
                  ++column;
              }
              let location = {
                  start,
                  end: {
                      line,
                      column: column + value.length
                  },
                  source: value
              };
              if (value === target) {
                  tokens.push({
                      type: exports.TokenTypes.bool,
                      value,
                      location
                  });
              }
              else {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              continue;
          }
          // number
          if (/[0-9]/.test(char)) {
              let value = "";
              let start = {
                  line,
                  column
              };
              let point = 0;
              while (/[0-9]/.test(char) || "." === char) {
                  value += char;
                  char = text[++cursor];
                  ++column;
                  if (point > 1) {
                      throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, {
                          start: {
                              line,
                              column: column - 1
                          },
                          end: {
                              line,
                              column
                          },
                          source: "."
                      });
                  }
                  if ("." === char) {
                      point++;
                  }
              }
              let location = {
                  start,
                  end: {
                      line,
                      column: column
                  },
                  source: value
              };
              let preValue = (_a = preToken === null || preToken === void 0 ? void 0 : preToken.value) !== null && _a !== void 0 ? _a : "";
              let preType = (_b = preToken === null || preToken === void 0 ? void 0 : preToken.type) !== null && _b !== void 0 ? _b : exports.TokenTypes.number;
              if (["}", "]"].includes(preValue) ||
                  ![exports.TokenTypes.split, exports.TokenTypes.assign, exports.TokenTypes.array].includes(preType)) {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              tokens.push({
                  type: exports.TokenTypes.number,
                  value,
                  location
              });
              continue;
          }
          // string
          if (char === '"') {
              let value = "";
              char = text[++cursor];
              let start = {
                  line,
                  column
              };
              while (char !== '"') {
                  value += char;
                  char = text[++cursor];
                  ++column;
              }
              char = text[++cursor];
              column += 2;
              tokens.push({
                  type: exports.TokenTypes.string,
                  value,
                  location: {
                      start,
                      end: {
                          line,
                          column
                      },
                      source: `"${value}"`
                  }
              });
              continue;
          }
          // :
          if (char === ":") {
              let location = {
                  start: {
                      line,
                      column
                  },
                  end: {
                      line,
                      column: ++column
                  },
                  source: char
              };
              // "x" :
              if ((preToken === null || preToken === void 0 ? void 0 : preToken.type) !== exports.TokenTypes.string) {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              tokens.push({
                  type: exports.TokenTypes.assign,
                  value: char,
                  location
              });
              cursor++;
              continue;
          }
          // ,
          if (char === ",") {
              let location = {
                  start: {
                      line,
                      column
                  },
                  end: {
                      line,
                      column: ++column
                  },
                  source: char
              };
              let preValue = (_c = preToken === null || preToken === void 0 ? void 0 : preToken.value) !== null && _c !== void 0 ? _c : "";
              if ([",", "[", "{"].includes(preValue)) {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              tokens.push({
                  type: exports.TokenTypes.split,
                  value: char,
                  location
              });
              cursor++;
              continue;
          }
          throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, {
              start: {
                  line,
                  column
              },
              end: {
                  line,
                  column: ++column
              },
              source: char
          });
      }
      return checkTokens(tokens);
  }
  function checkTokens(tokens) {
      if (tokens.length === 0) {
          return tokens;
      }
      if (tokens.length === 1) {
          let headToken = tokens[0];
          throw createCompilerError(exports.ErrorCodes.TOKENIZER_PAIR_ERROR, headToken.location);
      }
      if (tokens.length > 1) {
          let headToken = tokens[0];
          let tailToken = tokens[tokens.length - 1];
          if ((headToken === null || headToken === void 0 ? void 0 : headToken.value) !== "{" && (headToken === null || headToken === void 0 ? void 0 : headToken.value) !== "[") {
              // start without { or [
              throw createCompilerError(exports.ErrorCodes.TOKENIZER_PAIR_ERROR, headToken.location);
          }
          if ((tailToken === null || tailToken === void 0 ? void 0 : tailToken.value) !== "}" && (tailToken === null || tailToken === void 0 ? void 0 : tailToken.value) !== "]") {
              // end without ] or }
              throw createCompilerError(exports.ErrorCodes.TOKENIZER_PAIR_ERROR, tailToken.location);
          }
      }
      // check pair [] {} ""
      let stack = [];
      tokens.forEach((token, index) => {
          switch (token.type) {
              case exports.TokenTypes.object:
              case exports.TokenTypes.array:
                  stack.push(token);
          }
      });
      if (stack.length === 0 || stack.length % 2 !== 0) {
          throw createCompilerError(exports.ErrorCodes.TOKENIZER_PAIR_ERROR, {
              start: { column: 1, line: 1 },
              end: { column: 1, line: 1 },
              source: ""
          });
      }
      else {
          let start = 0;
          let end = stack.length - 1;
          while (end - start >= 1) {
              let headToken = stack[start];
              let tailToken = stack[end];
              // FIXME: start type !== end type
              if (headToken.type !== tailToken.type) ;
              start++;
              end--;
          }
      }
      return tokens;
  }

  function parser(tokens) {
      let cursor = 0;
      function walk() {
          var _a, _b, _c, _d;
          let token = tokens[cursor];
          // null
          if (token.type === exports.TokenTypes.null) {
              cursor++;
              return {
                  type: exports.NodeTypes.NullLiteral,
                  value: token.value,
                  params: []
              };
          }
          // boolean
          if (token.type === exports.TokenTypes.bool) {
              cursor++;
              return {
                  type: exports.NodeTypes.BooleanLiteral,
                  value: token.value,
                  params: []
              };
          }
          // number
          if (token.type === exports.TokenTypes.number) {
              cursor++;
              return {
                  type: exports.NodeTypes.NumericLiteral,
                  value: token.value,
                  params: []
              };
          }
          // string
          if (token.type === exports.TokenTypes.string) {
              cursor++;
              let next = tokens[cursor];
              if (next.type === exports.TokenTypes.assign) {
                  cursor++;
                  return {
                      type: exports.NodeTypes.ObjectProperty,
                      identifier: `${token.value}`,
                      params: [walk()]
                  };
              }
              return {
                  type: exports.NodeTypes.StringLiteral,
                  value: token.value,
                  params: []
              };
          }
          // assign
          if (token.type === exports.TokenTypes.assign) {
              cursor++;
              return {
                  type: exports.NodeTypes.AssignmentExpression,
                  value: token.value,
                  params: []
              };
          }
          // split
          if (token.type === exports.TokenTypes.split) {
              cursor++;
              return {
                  type: exports.NodeTypes.SplitExpression,
                  value: token.value,
                  params: []
              };
          }
          // object
          if (token.type === exports.TokenTypes.object && token.value === "{") {
              token = tokens[++cursor];
              let node = {
                  type: exports.NodeTypes.ObjectExpression,
                  params: []
              };
              while (token.type !== exports.TokenTypes.object ||
                  (token.type === exports.TokenTypes.object && token.value !== "}")) {
                  let next = walk();
                  if ((next === null || next === void 0 ? void 0 : next.type) !== exports.NodeTypes.SplitExpression) {
                      (_b = (_a = node === null || node === void 0 ? void 0 : node.params) === null || _a === void 0 ? void 0 : _a.push) === null || _b === void 0 ? void 0 : _b.call(_a, next);
                  }
                  token = tokens[cursor];
              }
              cursor++;
              return node;
          }
          // array
          if (token.type === exports.TokenTypes.array && token.value === "[") {
              token = tokens[++cursor];
              let node = {
                  type: exports.NodeTypes.ArrayExpression,
                  params: []
              };
              while (token.type !== exports.TokenTypes.array ||
                  (token.type === exports.TokenTypes.array && token.value !== "]")) {
                  let next = walk();
                  if ((next === null || next === void 0 ? void 0 : next.type) !== exports.NodeTypes.SplitExpression) {
                      (_d = (_c = node === null || node === void 0 ? void 0 : node.params) === null || _c === void 0 ? void 0 : _c.push) === null || _d === void 0 ? void 0 : _d.call(_c, next);
                  }
                  token = tokens[cursor];
              }
              cursor++;
              return node;
          }
          // not found
          console.log("not found", token);
          throw Error(`not found ${token}`);
      }
      let ast = {
          type: exports.NodeTypes.Daddy,
          params: []
      };
      while (cursor < tokens.length) {
          ast.params && ast.params.push(walk());
      }
      // console.log(JSON.stringify(ast));
      return ast;
  }

  /**
   * enter & exit ast node
   *
   * @param ast
   * @param deep
   * @param visitor
   */
  function traverser({ ast, deep = true, visitor }) {
      function traveresArray(array, parent) {
          array.forEach(child => {
              traverseNode(child, parent);
          });
      }
      function traverseNode(node, parent) {
          let method = visitor[node.type];
          if (method && method.enter) {
              method.enter(node, parent);
          }
          switch (node.type) {
              case exports.NodeTypes.Daddy:
              case exports.NodeTypes.ArrayExpression:
              case exports.NodeTypes.ObjectExpression:
                  node.params && traveresArray(node.params, node);
                  break;
              case exports.NodeTypes.ObjectProperty:
                  deep && node.params && traveresArray(node.params, node);
                  break;
              case exports.NodeTypes.StringLiteral:
              case exports.NodeTypes.NumericLiteral:
              case exports.NodeTypes.BooleanLiteral:
              case exports.NodeTypes.NullLiteral:
              case exports.NodeTypes.SplitExpression:
                  break;
              default:
                  throw new TypeError(node.type.toString());
          }
          if (method && method.exit) {
              method.exit(node, parent);
          }
      }
      traverseNode(ast);
  }
  /**
   * origin ast to transformed ast
   *
   * @param ast
   */
  function transformer(ast) {
      let newAst = {
          type: exports.NodeTypes.Daddy,
          params: []
      };
      ast._context = newAst.params;
      traverser({
          ast: ast,
          visitor: {
              [exports.NodeTypes.ObjectExpression]: {
                  enter(node, parent) {
                      node._context = node.params;
                      let expression = {
                          type: exports.NodeTypes.ObjectExpression,
                          params: []
                      };
                      node._context = expression.params;
                      if (node.type === exports.NodeTypes.ObjectExpression) ;
                      parent === null || parent === void 0 ? void 0 : parent._context.push(expression);
                  },
                  exit(node, parent) { }
              },
              [exports.NodeTypes.ObjectProperty]: {
                  enter(node, parent) {
                      let expression = {
                          type: exports.NodeTypes.ObjectProperty,
                          identifier: node.identifier,
                          params: []
                      };
                      node._context = expression.params;
                      parent === null || parent === void 0 ? void 0 : parent._context.push(expression);
                  },
                  exit(node, parent) { }
              },
              [exports.NodeTypes.ArrayExpression]: {
                  enter(node, parent) {
                      let expression = {
                          type: exports.NodeTypes.ArrayExpression,
                          params: []
                      };
                      node._context = expression.params;
                      parent === null || parent === void 0 ? void 0 : parent._context.push(expression);
                  },
                  exit(node, parent) { }
              },
              [exports.NodeTypes.StringLiteral]: {
                  enter(node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit(node, parent) { }
              },
              [exports.NodeTypes.NumericLiteral]: {
                  enter(node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit(node, parent) { }
              },
              [exports.NodeTypes.NullLiteral]: {
                  enter(node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit(node, parent) { }
              },
              [exports.NodeTypes.BooleanLiteral]: {
                  enter(node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit(node, parent) { }
              }
          }
      });
      return newAst;
  }

  function compiler(json) {
      let tokens = tokenizer(json);
      let ast = parser(tokens);
      let newAst = transformer(ast);
      return newAst;
  }

  exports.compiler = compiler;
  exports.createCompilerError = createCompilerError;
  exports.errorMessages = errorMessages;
  exports.parser = parser;
  exports.tokenizer = tokenizer;
  exports.transformer = transformer;
  exports.traverser = traverser;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
