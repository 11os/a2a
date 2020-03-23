import { AstNode, Visitor } from "./types";
/**
 * enter & exit ast node
 *
 * @param ast
 * @param deep
 * @param visitor
 */
export declare function traverser({ ast, deep, visitor }: {
    ast: AstNode;
    visitor: Visitor;
    deep?: boolean;
}): void;
/**
 * TODO: ts or dart
 *
 * origin ast to transformed ast
 *
 * @param ast
 */
export declare function transformer(ast: AstNode): AstNode;
//# sourceMappingURL=transformer.d.ts.map