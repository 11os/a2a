# a2a

any to any

| from | to | demo |
| --- | --- | --- |
| json | typescript | [https://json2ts.surge.sh](https://json2ts.surge.sh) |
| json | dart | [https://json2dart.surge.sh](https://json2dart.surge.sh) |
| protobuf | typescript | [https://proto2ts.surge.sh](https://proto2ts.surge.sh) |
| ptotobuf | dart | [https://proto2dart.surge.sh](https://proto2dart.surge.sh) |

## directory

[项目结构说明](./INTRODUCTION.md) 

## demo

from **json** or **proto**

```json
{
  "code": 0,
  "bigInt": 9007199254740991,
  "doubleValue": 100.0,
  "message": null,
  "": "empty key name",
  "auth": false,
  "pageInfo": {
    "pageNum": 1,
    "pageSize": 10
  },
  "enum": ["a", "o", "e"],
  "data": [
    {
      "id": "4638977926580224",
      "title": "普通课程",
      "price": 1000,
      "hasBuy": false,
      "studentNum": 52
    }
  ]
}
```

### to ts

```ts
export interface BaseResponse {
  code: number;
  bigInt: number;
  doubleValue: number;
  message: any; // ⚠️⚠️⚠️ null value
  : string; // ⚠️⚠️⚠️ empty name
  auth: boolean;
  pageInfo: PageInfo;
  enum: string[];
  data: Data[];
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface Data {
  id: string;
  title: string;
  price: number;
  hasBuy: boolean;
  studentNum: number;
}
```

### to dart

众所周知flutter中无法使用反射，需搭配 [JSON and serialization
](https://flutter.dev/docs/development/data-and-backend/json)使用

```dart
@JsonSerializable()
class BaseResponse {
  number: code;
  Int64: bigInt;
  double: doubleValue;
  Null: message; // ⚠️⚠️⚠️ null value
  String: ; // ⚠️⚠️⚠️ empty name
  bool: auth;
  PageInfo: pageInfo;
  undefined: enum;
  undefined: data;
  BaseResponse({ this.code, this.bigInt, this.doubleValue, this.message, this., this.auth, this.pageInfo, this.enum, this.data });

  factory BaseResponse.fromJson(Map<String, dynamic> json) => _$BaseResponseFromJson(json);

  Map<String, dynamic> toJson() => _$BaseResponseToJson(this);
}

@JsonSerializable()
class PageInfo {
  number: pageNum;
  number: pageSize;
  PageInfo({ this.pageNum, this.pageSize });

  factory PageInfo.fromJson(Map<String, dynamic> json) => _$PageInfoFromJson(json);

  Map<String, dynamic> toJson() => _$PageInfoToJson(this);
}

@JsonSerializable()
class Data {
  String: id;
  String: title;
  number: price;
  bool: hasBuy;
  number: studentNum;
  Data({ this.id, this.title, this.price, this.hasBuy, this.studentNum });

  factory Data.fromJson(Map<String, dynamic> json) => _$DataFromJson(json);

  Map<String, dynamic> toJson() => _$DataToJson(this);
}
```

## proto to dart/js

- [https://github.com/11os/p2a](https://github.com/11os/p2a)

## installation

- [x] 将废弃j2a，扩展为a2a

```sh
$ yarn global add @j2a/cli # or npm i -g @j2a/cli
```

## usage

```sh
$ j2a -i path/to/json -o path/to/dist -t typescript # convert json to any

$ j2a --help
Usage: j2a [options]

convert path/to/*.json to path/to/*.any

Options:
  -V, --version        output the version number
  -i, --input <path>   json source directory path
  -o, --output <path>  export directory path
  -t, --type <type>    typescript dart (default: "typescript")
  -w, --watch          watch mode
  -h, --help           display help for command
```
