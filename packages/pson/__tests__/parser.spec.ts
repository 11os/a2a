import { parser } from "../src/main";
import { tokenizer } from "../src/main";
import { NodeTypes } from "../src/main";

describe("parse object", () => {
  test("parse object with all type", () => {
    let json = `{"a": "string", "b": [123, {"bb": 456}], "c": null, "d": true, "e": 789}`;
    let token = tokenizer(json);
    let ast = parser(token);
    expect(ast).toMatchObject({
      type: NodeTypes.Daddy,
      params: [
        {
          type: NodeTypes.ObjectExpression,
          params: [
            {
              type: NodeTypes.ObjectProperty,
              identifier: "a",
              params: [
                { type: NodeTypes.StringLiteral, value: "string", params: [] }
              ]
            },
            {
              type: NodeTypes.ObjectProperty,
              identifier: "b",
              params: [
                {
                  type: NodeTypes.ArrayExpression,
                  params: [
                    {
                      type: NodeTypes.NumericLiteral,
                      value: "123",
                      params: []
                    },
                    {
                      type: NodeTypes.ObjectExpression,
                      params: [
                        {
                          type: NodeTypes.ObjectProperty,
                          identifier: "bb",
                          params: [{ type: 3, value: "456", params: [] }]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: NodeTypes.ObjectProperty,
              identifier: "c",
              params: [
                { type: NodeTypes.NullLiteral, value: "null", params: [] }
              ]
            },
            {
              type: NodeTypes.ObjectProperty,
              identifier: "d",
              params: [
                { type: NodeTypes.BooleanLiteral, value: "true", params: [] }
              ]
            },
            {
              type: NodeTypes.ObjectProperty,
              identifier: "e",
              params: [
                { type: NodeTypes.NumericLiteral, value: "789", params: [] }
              ]
            }
          ]
        }
      ]
    });
  });
});
