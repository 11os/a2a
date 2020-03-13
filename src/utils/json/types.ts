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
  NumberLiteral,
  ObjectProperty,
  StringLiteral,
  AssignmentExpression,
  SplitExpression,
  ObjectExpression,
  ArrayExpression
}

export interface Node {
  type: NodeTypes;
  identifier?: string;
  params?: Node[];
  value?: string | boolean | number | null;
  _context?: any;
}

export type ObjectExpression = {};

export interface VisitorFunc {
  (node: Node, parent?: Node): void;
}

export type Visitor = {
  [key in keyof typeof NodeTypes]?: {
    enter: VisitorFunc;
    exit: VisitorFunc;
  };
};
