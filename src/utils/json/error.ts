import { Location } from "./types";

export interface CompilerError extends SyntaxError {
  code: ErrorCodes;
  msg: String;
  location: Location;
}

export function createCompilerError(
  code: ErrorCodes,
  location: Location,
  messages?: { [code: number]: string }
) {
  const msg = (messages || errorMessages)[code];
  const error = new SyntaxError(String(msg)) as CompilerError;
  error.code = code;
  error.location = location;
  return error;
}

export enum ErrorCodes {
  TOKENIZER_ERROR,
  TOKENIZER_PAIR_ERROR
}

export const errorMessages: { [code: number]: string } = {
  // tokenizer errors
  [ErrorCodes.TOKENIZER_ERROR]: "tokenizer error",
  [ErrorCodes.TOKENIZER_PAIR_ERROR]: "tokenizer pair error"
};
