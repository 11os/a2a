import { Location } from "./types";
export interface CompilerError extends SyntaxError {
    code: ErrorCodes;
    msg: String;
    location: Location;
}
export declare function createCompilerError(code: ErrorCodes, location: Location, messages?: {
    [code: number]: string;
}): CompilerError;
export declare enum ErrorCodes {
    TOKENIZER_ERROR = 0,
    TOKENIZER_PAIR_ERROR = 1
}
export declare const errorMessages: {
    [code: number]: string;
};
//# sourceMappingURL=error.d.ts.map