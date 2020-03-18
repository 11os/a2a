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

  var _a;
  function createCompilerError(code, location, messages) {
      var msg = messages
          ? errorMessages[code] + " " + messages
          : errorMessages[code];
      var error = new SyntaxError(String(msg));
      error.code = code;
      error.location = location;
      return error;
  }
  (function (ErrorCodes) {
      ErrorCodes[ErrorCodes["TOKENIZER_ERROR"] = 0] = "TOKENIZER_ERROR";
      ErrorCodes[ErrorCodes["TOKENIZER_PAIR_ERROR"] = 1] = "TOKENIZER_PAIR_ERROR";
      ErrorCodes[ErrorCodes["PARSER_ERROR"] = 2] = "PARSER_ERROR";
  })(exports.ErrorCodes || (exports.ErrorCodes = {}));
  var errorMessages = (_a = {},
      // tokenizer errors
      _a[exports.ErrorCodes.TOKENIZER_ERROR] = "tokenizer error",
      _a[exports.ErrorCodes.TOKENIZER_PAIR_ERROR] = "tokenizer pair error",
      _a[exports.ErrorCodes.PARSER_ERROR] = "parser error",
      _a);

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
      var line = 1, column = 1, cursor = 0;
      // init lexer array
      var tokens = [];
      while (cursor < text.length) {
          var char = text.charAt(cursor);
          var preToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
          // {
          if (char === "{") {
              var location = {
                  start: {
                      line: line,
                      column: column
                  },
                  end: {
                      line: line,
                      column: ++column
                  },
                  source: char
              };
              tokens.push({
                  type: exports.TokenTypes.object,
                  value: char,
                  location: location
              });
              cursor++;
              continue;
          }
          // }
          if (char === "}") {
              var location = {
                  start: {
                      line: line,
                      column: column
                  },
                  end: {
                      line: line,
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
                  location: location
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
                          line: line,
                          column: column
                      },
                      end: {
                          line: line,
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
                          line: line,
                          column: column
                      },
                      end: {
                          line: line,
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
              var value = "";
              var target = "null";
              var start = {
                  line: line,
                  column: column
              };
              while (target.indexOf(char) > -1) {
                  value += char;
                  char = text[++cursor];
                  ++column;
              }
              var location = {
                  start: start,
                  end: {
                      line: line,
                      column: column
                  },
                  source: value
              };
              if (value === target) {
                  tokens.push({
                      type: exports.TokenTypes.null,
                      value: target,
                      location: location
                  });
              }
              else {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              continue;
          }
          if (char === "t" || char === "f") {
              var value = "";
              var target = {
                  t: "true",
                  f: "false"
              }[char];
              var start = {
                  line: line,
                  column: column
              };
              while (target.indexOf(char) > -1) {
                  value += char;
                  char = text[++cursor];
                  ++column;
              }
              var location = {
                  start: start,
                  end: {
                      line: line,
                      column: column + value.length
                  },
                  source: value
              };
              if (value === target) {
                  tokens.push({
                      type: exports.TokenTypes.bool,
                      value: value,
                      location: location
                  });
              }
              else {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              continue;
          }
          // number
          if (/[0-9]/.test(char)) {
              var value = "";
              var start = {
                  line: line,
                  column: column
              };
              var point = 0;
              while (/[0-9]/.test(char) || "." === char) {
                  value += char;
                  char = text[++cursor];
                  ++column;
                  if (point > 1) {
                      throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, {
                          start: {
                              line: line,
                              column: column - 1
                          },
                          end: {
                              line: line,
                              column: column
                          },
                          source: "."
                      });
                  }
                  if ("." === char) {
                      point++;
                  }
              }
              var location = {
                  start: start,
                  end: {
                      line: line,
                      column: column
                  },
                  source: value
              };
              var preValue = (_a = preToken === null || preToken === void 0 ? void 0 : preToken.value) !== null && _a !== void 0 ? _a : "";
              var preType = (_b = preToken === null || preToken === void 0 ? void 0 : preToken.type) !== null && _b !== void 0 ? _b : exports.TokenTypes.number;
              if (["}", "]"].includes(preValue) ||
                  ![exports.TokenTypes.split, exports.TokenTypes.assign, exports.TokenTypes.array].includes(preType)) {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              tokens.push({
                  type: exports.TokenTypes.number,
                  value: value,
                  location: location
              });
              continue;
          }
          // string
          if (char === '"') {
              var value = "";
              char = text[++cursor];
              var start = {
                  line: line,
                  column: column
              };
              while (char !== '"') {
                  if (cursor > text.length) {
                      if ((preToken === null || preToken === void 0 ? void 0 : preToken.type) !== exports.TokenTypes.string) {
                          throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, {
                              start: start,
                              end: {
                                  line: line,
                                  column: column
                              },
                              source: value
                          });
                      }
                  }
                  value += char;
                  char = text[++cursor];
                  ++column;
              }
              char = text[++cursor];
              column += 2;
              tokens.push({
                  type: exports.TokenTypes.string,
                  value: value,
                  location: {
                      start: start,
                      end: {
                          line: line,
                          column: column
                      },
                      source: "\"" + value + "\""
                  }
              });
              continue;
          }
          // :
          if (char === ":") {
              var location = {
                  start: {
                      line: line,
                      column: column
                  },
                  end: {
                      line: line,
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
                  location: location
              });
              cursor++;
              continue;
          }
          // ,
          if (char === ",") {
              var location = {
                  start: {
                      line: line,
                      column: column
                  },
                  end: {
                      line: line,
                      column: ++column
                  },
                  source: char
              };
              var preValue = (_c = preToken === null || preToken === void 0 ? void 0 : preToken.value) !== null && _c !== void 0 ? _c : "";
              if ([",", "[", "{"].includes(preValue)) {
                  throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, location);
              }
              tokens.push({
                  type: exports.TokenTypes.split,
                  value: char,
                  location: location
              });
              cursor++;
              continue;
          }
          throw createCompilerError(exports.ErrorCodes.TOKENIZER_ERROR, {
              start: {
                  line: line,
                  column: column
              },
              end: {
                  line: line,
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
          var headToken = tokens[0];
          throw createCompilerError(exports.ErrorCodes.TOKENIZER_PAIR_ERROR, headToken.location);
      }
      if (tokens.length > 1) {
          var headToken = tokens[0];
          var tailToken = tokens[tokens.length - 1];
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
      var stack = [];
      tokens.forEach(function (token, index) {
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
          var start = 0;
          var end = stack.length - 1;
          while (end - start >= 1) {
              var headToken = stack[start];
              var tailToken = stack[end];
              // FIXME: start type !== end type
              if (headToken.type !== tailToken.type) ;
              start++;
              end--;
          }
      }
      return tokens;
  }

  function parser(tokens) {
      var cursor = 0;
      function walk() {
          var _a, _b, _c, _d;
          var token = tokens[cursor];
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
              var next = tokens[cursor];
              if (next.type === exports.TokenTypes.assign) {
                  cursor++;
                  return {
                      type: exports.NodeTypes.ObjectProperty,
                      identifier: "" + token.value,
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
              var node = {
                  type: exports.NodeTypes.ObjectExpression,
                  params: []
              };
              while (token.type !== exports.TokenTypes.object ||
                  (token.type === exports.TokenTypes.object && token.value !== "}")) {
                  var next = walk();
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
              var node = {
                  type: exports.NodeTypes.ArrayExpression,
                  params: []
              };
              while (token.type !== exports.TokenTypes.array ||
                  (token.type === exports.TokenTypes.array && token.value !== "]")) {
                  var next = walk();
                  if ((next === null || next === void 0 ? void 0 : next.type) !== exports.NodeTypes.SplitExpression) {
                      (_d = (_c = node === null || node === void 0 ? void 0 : node.params) === null || _c === void 0 ? void 0 : _c.push) === null || _d === void 0 ? void 0 : _d.call(_c, next);
                  }
                  token = tokens[cursor];
              }
              cursor++;
              return node;
          }
          // not found
          throw createCompilerError(exports.ErrorCodes.PARSER_ERROR, token.location, "token not found " + JSON.stringify(token));
      }
      var ast = {
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
  function traverser(_a) {
      var ast = _a.ast, _b = _a.deep, deep = _b === void 0 ? true : _b, visitor = _a.visitor;
      function traveresArray(array, parent) {
          array.forEach(function (child) {
              traverseNode(child, parent);
          });
      }
      function traverseNode(node, parent) {
          var method = visitor[node.type];
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
      var _a;
      var newAst = {
          type: exports.NodeTypes.Daddy,
          params: []
      };
      ast._context = newAst.params;
      traverser({
          ast: ast,
          visitor: (_a = {},
              _a[exports.NodeTypes.ObjectExpression] = {
                  enter: function (node, parent) {
                      node._context = node.params;
                      var expression = {
                          type: exports.NodeTypes.ObjectExpression,
                          params: []
                      };
                      node._context = expression.params;
                      if (node.type === exports.NodeTypes.ObjectExpression) ;
                      parent === null || parent === void 0 ? void 0 : parent._context.push(expression);
                  },
                  exit: function (node, parent) { }
              },
              _a[exports.NodeTypes.ObjectProperty] = {
                  enter: function (node, parent) {
                      var expression = {
                          type: exports.NodeTypes.ObjectProperty,
                          identifier: node.identifier,
                          params: []
                      };
                      node._context = expression.params;
                      parent === null || parent === void 0 ? void 0 : parent._context.push(expression);
                  },
                  exit: function (node, parent) { }
              },
              _a[exports.NodeTypes.ArrayExpression] = {
                  enter: function (node, parent) {
                      var expression = {
                          type: exports.NodeTypes.ArrayExpression,
                          params: []
                      };
                      node._context = expression.params;
                      parent === null || parent === void 0 ? void 0 : parent._context.push(expression);
                  },
                  exit: function (node, parent) { }
              },
              _a[exports.NodeTypes.StringLiteral] = {
                  enter: function (node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit: function (node, parent) { }
              },
              _a[exports.NodeTypes.NumericLiteral] = {
                  enter: function (node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit: function (node, parent) { }
              },
              _a[exports.NodeTypes.NullLiteral] = {
                  enter: function (node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit: function (node, parent) { }
              },
              _a[exports.NodeTypes.BooleanLiteral] = {
                  enter: function (node, parent) {
                      parent === null || parent === void 0 ? void 0 : parent._context.push(node);
                  },
                  exit: function (node, parent) { }
              },
              _a)
      });
      return newAst;
  }

  function compiler(json) {
      var tokens = tokenizer(json);
      var ast = parser(tokens);
      var newAst = transformer(ast);
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
