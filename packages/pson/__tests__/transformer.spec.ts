import { transformer } from "../src/transformer";
import { parser } from "../src/parser";
import { tokenizer } from "../src/tokenizer";
import { NodeTypes } from "../src/types";

describe("transfomer object", () => {
  test("newAst = ast", () => {
    let json = `{"a": 1}`;
    let tokens = tokenizer(json);
    let ast = parser(tokens);
    let newAst = transformer(ast);
    expect(newAst).toMatchObject({
      type: NodeTypes.Daddy,
      params: [
        {
          type: NodeTypes.ObjectExpression,
          params: [
            {
              type: NodeTypes.ObjectProperty,
              identifier: "a",
              params: [
                { type: NodeTypes.NumericLiteral, value: "1", params: [] }
              ]
            }
          ]
        }
      ]
    });
    expect(ast).toMatchObject(newAst);
  });
  test("newAst = ast", () => {
    let json = `{"a": 1, "b": "2"}`;
    let tokens = tokenizer(json);
    let ast = parser(tokens);
    let newAst = transformer(ast);
    expect(newAst).toMatchObject({
      type: NodeTypes.Daddy,
      params: [
        {
          type: NodeTypes.ObjectExpression,
          params: [
            {
              type: NodeTypes.ObjectProperty,
              identifier: "a",
              params: [
                { type: NodeTypes.NumericLiteral, value: "1", params: [] }
              ]
            },
            {
              type: NodeTypes.ObjectProperty,
              identifier: "b",
              params: [
                { type: NodeTypes.StringLiteral, value: "2", params: [] }
              ]
            }
          ]
        }
      ]
    });
    expect(ast).toMatchObject(newAst);
  });
});
