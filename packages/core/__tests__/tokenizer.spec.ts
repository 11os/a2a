import { tokenizer } from '../src/tokenizer'
import { TokenTypes } from '../src/types'
import { ErrorCodes } from '../src/error'

describe('tokenizer object', () => {
  test('empty object', () => {
    const json = `{}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.object, value: '}' }
    ])
  })

  test('object as parent', () => {
    const json = `{"a": "1"}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.string, value: '1' },
      { type: TokenTypes.object, value: '}' }
    ])
  })

  test('object as parent with empty key', () => {
    const json = `{"": ""}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: '' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.string, value: '' },
      { type: TokenTypes.object, value: '}' }
    ])
  })

  test('object as parent with float child', () => {
    const json = `{"a": 100.00}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.number, value: '100.00' },
      { type: TokenTypes.object, value: '}' }
    ])
  })

  test('object as parent with null child', () => {
    const json = `{"a": null}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      {
        type: TokenTypes.null,
        value: 'null',
        location: {
          start: {
            line: 1,
            column: 7
          },
          end: {
            line: 1,
            column: 11
          },
          source: 'null'
        }
      },
      { type: TokenTypes.object, value: '}' }
    ])
  })

  test('object as parent with array child', () => {
    const json = `{"a": ["1"]}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.array, value: '[' },
      { type: TokenTypes.string, value: '1' },
      { type: TokenTypes.array, value: ']' },
      { type: TokenTypes.object, value: '}' }
    ])
  })

  test('object as parent with bool child', () => {
    const json = `{"a": true}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.bool, value: 'true' },
      { type: TokenTypes.object, value: '}' }
    ])
  })

  test('object as parent with all type child', () => {
    const json = `{"a": ["1"], "b": "string", "c": 1, "d": null, "e": true, "f": false}`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.object, value: '{' },
      // index 0
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.array, value: '[' },
      { type: TokenTypes.string, value: '1' },
      { type: TokenTypes.array, value: ']' },
      { type: TokenTypes.split, value: ',' },
      // index 1
      { type: TokenTypes.string, value: 'b' },
      { type: TokenTypes.assign, value: ':' },
      {
        type: TokenTypes.string,
        value: 'string',
        location: { source: '"string"' }
      },
      { type: TokenTypes.split, value: ',' },
      // index 2
      { type: TokenTypes.string, value: 'c' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.number, value: '1' },
      { type: TokenTypes.split, value: ',' },
      // index 3
      { type: TokenTypes.string, value: 'd' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.null, value: 'null', location: { source: 'null' } },
      { type: TokenTypes.split, value: ',' },
      // index 4
      { type: TokenTypes.string, value: 'e' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.bool, value: 'true', location: { source: 'true' } },
      { type: TokenTypes.split, value: ',' },
      // index 5
      { type: TokenTypes.string, value: 'f' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.bool, value: 'false' },
      // end
      { type: TokenTypes.object, value: '}' }
    ])
  })
})

describe('tokenizer array', () => {
  test('empty array', () => {
    const json = `[]`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.array, value: '[' },
      { type: TokenTypes.array, value: ']' }
    ])
  })

  test('array as parent', () => {
    const json = `["a"]`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.array, value: '[' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.array, value: ']' }
    ])
  })

  test('array as parent with object child', () => {
    const json = `[{"a": "1"}]`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.array, value: '[' },
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.string, value: '1' },
      { type: TokenTypes.object, value: '}' },
      { type: TokenTypes.array, value: ']' }
    ])
  })

  test('array as parent with all type child', () => {
    const json = `[{"a": "1"}, null, true, "b", 2, false]`
    const tokens = tokenizer(json)
    expect(tokens).toMatchObject([
      { type: TokenTypes.array, value: '[' },
      // index 0
      { type: TokenTypes.object, value: '{' },
      { type: TokenTypes.string, value: 'a' },
      { type: TokenTypes.assign, value: ':' },
      { type: TokenTypes.string, value: '1' },
      { type: TokenTypes.object, value: '}' },
      { type: TokenTypes.split, value: ',' },
      // index 1
      { type: TokenTypes.null, value: 'null' },
      { type: TokenTypes.split, value: ',' },
      // index 2
      { type: TokenTypes.bool, value: 'true' },
      { type: TokenTypes.split, value: ',' },
      // index 3
      { type: TokenTypes.string, value: 'b' },
      { type: TokenTypes.split, value: ',' },
      // index 4
      { type: TokenTypes.number, value: '2' },
      { type: TokenTypes.split, value: ',' },
      // index 5
      { type: TokenTypes.bool, value: 'false' },
      { type: TokenTypes.array, value: ']' }
    ])
  })
})

describe('tokenizer error', () => {
  describe('invalid key', () => {
    test('invalid key', () => {
      try {
        const json = `{a: 1}`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 1,
              column: 2
            },
            end: {
              line: 1,
              column: 3
            },
            source: 'a'
          }
        })
      }
    })

    test('invalid key with new line', () => {
      try {
        const json = `{\na: 1}`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 2,
              column: 1
            }
          }
        })
      }
    })
  })

  describe('invalid object', () => {
    test('invalid object start', () => {
      try {
        const json = `"a": 1}`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_PAIR_ERROR,
          location: {
            start: {
              line: 1,
              column: 1
            }
          }
        })
      }
    })

    test('invalid object param', () => {
      try {
        const json = `{"a }`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 1,
              column: 2
            },
            end: {
              line: 1,
              column: 6
            }
          }
        })
      }
    })

    test('invalid object end', () => {
      try {
        const json = `{"a": 1`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_PAIR_ERROR,
          location: {
            end: {
              line: 1,
              column: 8
            }
          }
        })
      }
    })
  })
  describe('invalid literial', () => {
    test('invalid json', () => {
      try {
        const json = `}}`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_PAIR_ERROR,
          location: {
            start: {
              line: 1,
              column: 1
            },
            source: '}'
          }
        })
      }
    })

    test('extra comma', () => {
      try {
        const json = `{"a": 1, }`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 1,
              column: 10
            },
            source: '}'
          }
        })
      }
    })

    test('number with number', () => {
      try {
        const json = `{"a": 1  1}`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 1,
              column: 10
            }
          }
        })
      }
    })

    test('newlines number newlines', () => {
      try {
        const json = `\n 123 \n`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 2,
              column: 2
            }
          }
        })
      }
    })

    test('single number', () => {
      try {
        const json = `123`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              column: 4
            }
          }
        })
      }
    })

    test('single string', () => {
      try {
        const json = `"1"`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_PAIR_ERROR,
          location: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              column: 4
            },
            source: `"1"`
          }
        })
      }
    })

    test('double', () => {
      try {
        const json = `[10.0.0]`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              column: 6
            },
            end: {
              column: 7
            },
            source: `.`
          }
        })
      }
    })

    test('single null', () => {
      try {
        const json = `null`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_PAIR_ERROR,
          location: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              column: 5
            },
            source: `null`
          }
        })
      }
    })

    test('invalid comma with all type', () => {
      try {
        const json = `{\n"a": ["1"], \n"b": "string", \n"c": 1, , \n"d": null, \n"e": true, \n"f": false\n}`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 4,
              column: 9
            },
            end: {
              line: 4,
              column: 10
            },
            source: `,`
          }
        })
      }
    })

    test('invalid quotes with all type', () => {
      try {
        const json = `{\n\r\t"a": ["1"], \r"b": "string", \r\n"c": 1, \n"d": null, \n"e": true, \n""g": false\n}`
        tokenizer(json)
      } catch (error) {
        expect(error).toMatchObject({
          code: ErrorCodes.TOKENIZER_ERROR,
          location: {
            start: {
              line: 6,
              column: 3
            },
            end: {
              line: 6,
              column: 4
            },
            source: `g`
          }
        })
      }
    })
  })
})
