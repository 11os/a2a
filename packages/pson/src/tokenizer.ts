import { Token, TokenTypes, Location } from "./types";
import { ErrorCodes, createCompilerError } from "./error";

/**
 * json string to token array
 *
 * don't ask me why not merge same code
 *
 * @param text json string
 */
export function tokenizer(text: string) {
  // init cursor
  let line = 1,
    column = 1,
    cursor = 0;
  // init lexer array
  let tokens: Token[] = [];

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
        type: TokenTypes.object,
        value: char,
        location
      });
      cursor++;
      continue;
    }
    // }
    if (char === "}") {
      let location: Location = {
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
      if (preToken?.type === TokenTypes.split) {
        throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, location);
      }
      tokens.push({
        type: TokenTypes.object,
        value: char,
        location
      });
      cursor++;
      continue;
    }
    // [
    if (char === "[") {
      tokens.push({
        type: TokenTypes.array,
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
        type: TokenTypes.array,
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
      } else {
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
          type: TokenTypes.null,
          value: target,
          location
        });
      } else {
        throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, location);
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
          type: TokenTypes.bool,
          value,
          location
        });
      } else {
        throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, location);
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
          throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, {
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
      let preValue = preToken?.value ?? "";
      let preType = preToken?.type ?? TokenTypes.number;
      if (
        ["}", "]"].includes(preValue) ||
        ![TokenTypes.split, TokenTypes.assign, TokenTypes.array].includes(
          preType
        )
      ) {
        throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, location);
      }
      tokens.push({
        type: TokenTypes.number,
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
        if (cursor > text.length) {
          if (preToken?.type !== TokenTypes.string) {
            throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, {
              start,
              end: {
                line,
                column
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
        type: TokenTypes.string,
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
      if (preToken?.type !== TokenTypes.string) {
        throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, location);
      }
      tokens.push({
        type: TokenTypes.assign,
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
      let preValue = preToken?.value ?? "";
      if ([",", "[", "{"].includes(preValue)) {
        throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, location);
      }
      tokens.push({
        type: TokenTypes.split,
        value: char,
        location
      });
      cursor++;
      continue;
    }
    throw createCompilerError(ErrorCodes.TOKENIZER_ERROR, {
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

function checkTokens(tokens: Token[]) {
  if (tokens.length === 0) {
    return tokens;
  }
  if (tokens.length === 1) {
    let headToken = tokens[0];
    throw createCompilerError(
      ErrorCodes.TOKENIZER_PAIR_ERROR,
      headToken.location
    );
  }
  if (tokens.length > 1) {
    let headToken = tokens[0];
    let tailToken = tokens[tokens.length - 1];
    if (headToken?.value !== "{" && headToken?.value !== "[") {
      // start without { or [
      throw createCompilerError(
        ErrorCodes.TOKENIZER_PAIR_ERROR,
        headToken.location
      );
    }
    if (tailToken?.value !== "}" && tailToken?.value !== "]") {
      // end without ] or }
      throw createCompilerError(
        ErrorCodes.TOKENIZER_PAIR_ERROR,
        tailToken.location
      );
    }
  }
  // check pair [] {} ""
  let stack: Token[] = [];
  tokens.forEach((token, index) => {
    switch (token.type) {
      case TokenTypes.object:
      case TokenTypes.array:
        stack.push(token);
    }
  });
  if (stack.length === 0 || stack.length % 2 !== 0) {
    throw createCompilerError(ErrorCodes.TOKENIZER_PAIR_ERROR, {
      start: { column: 1, line: 1 },
      end: { column: 1, line: 1 },
      source: ""
    });
  } else {
    let start = 0;
    let end = stack.length - 1;
    while (end - start >= 1) {
      let headToken = stack[start];
      let tailToken = stack[end];
      // FIXME: start type !== end type
      if (headToken.type !== tailToken.type) {
        // throw createCompilerError(
        //   ErrorCodes.TOKENIZER_PAIR_ERROR,
        //   headToken.location
        // );
      }
      start++;
      end--;
    }
  }
  return tokens;
}

export default tokenizer;
