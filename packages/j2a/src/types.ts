export interface Position {
  line: number;
  column: number;
}

export interface Location {
  start: Position;
  end: Position;
  source: string;
}

export enum TokenTypes {
  null,
  bool,
  number,
  string,
  assign,
  split,
  object,
  array
}

export interface Token {
  type: TokenTypes;
  value?: string;
  location: Location;
}

export enum NodeTypes {
  Daddy,
  BooleanLiteral,
  NullLiteral,
  NumericLiteral,
  ObjectProperty,
  StringLiteral,
  AssignmentExpression,
  SplitExpression,
  ObjectExpression,
  ArrayExpression
}

export interface AstNode {
  type: NodeTypes;
  identifier?: string;
  params?: AstNode[];
  value?: string;
  _context?: any;
}

export type ObjectExpression = {};

export interface VisitorCallback {
  (node: AstNode, parent?: AstNode): void;
}

export type Visitor = {
  [key in NodeTypes]?: {
    enter: VisitorCallback;
    exit?: VisitorCallback;
  };
};

export enum JsonType {
  int,
  bigInt,
  double,
  string,
  object,
  array,
  bool,
  null,
  any
}

export type JsonItem = {
  type: JsonType;
  identifier?: string;
  comment?: string;
};

export type LoopAst = {
  node?: AstNode;
  clazz?: string;
};
