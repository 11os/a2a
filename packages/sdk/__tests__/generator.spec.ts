import { generate, ParseTypeEnum } from '../src/generator'

describe('tokenizer object', () => {
  test('shit', () => {
    const json = `{
      "code": 0,
      "bigInt": 9007199254740991,
      "doubleValue": 100.00,
      "message": null,
      "": "empty key name",
      "auth": false,
      "pageInfo": {
        "pageNum": 1,
        "pageSize": 10
      },
      "enum": ["a", "o", "e"],
      "data": [{
        "id": "4638977926580224",
        "title": "普通课程",
        "price": 1000,
        "hasBuy": false,
        "studentNum": 52
      }]
    }`
    const clazz = 'BaseResponse'
    const result = generate({ json, clazz, type: ParseTypeEnum.typescript })
    expect(result).toMatch(/enum: string\[\];/)
  })
})
