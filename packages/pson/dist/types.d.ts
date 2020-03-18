export interface Position {
    line: number;
    column: number;
}
export interface Location {
    start: Position;
    end: Position;
    source: string;
}
export declare enum TokenTypes {
    null = 0,
    bool = 1,
    number = 2,
    string = 3,
    assign = 4,
    split = 5,
    object = 6,
    array = 7
}
export interface Token {
    type: TokenTypes;
    value?: string;
    location: Location;
}
export declare enum NodeTypes {
    Daddy = 0,
    BooleanLiteral = 1,
    NullLiteral = 2,
    NumericLiteral = 3,
    ObjectProperty = 4,
    StringLiteral = 5,
    AssignmentExpression = 6,
    SplitExpression = 7,
    ObjectExpression = 8,
    ArrayExpression = 9
}
export interface AstNode {
    type: NodeTypes;
    identifier?: string;
    params?: AstNode[];
    value?: string;
    _context?: any;
}
export declare type ObjectExpression = {};
export interface VisitorCallback {
    (node: AstNode, parent?: AstNode): void;
}
export declare type Visitor = {
    [key in NodeTypes]?: {
        enter: VisitorCallback;
        exit?: VisitorCallback;
    };
};
//# sourceMappingURL=types.d.ts.map