# a2a

any to any

from **json** to
- [x] typescript
- [x] dart

from **proto** to
- [x] typescript
- [x] dart

## demo

- [https://json2dart.surge.sh](https://json2dart.surge.sh)
- [https://json2ts.surge.sh](https://json2ts.surge.sh)
- [https://proto2dart.surge.sh](https://proto2dart.surge.sh)
- [https://proto2ts.surge.sh](https://proto2ts.surge.sh)

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

to ts

```ts
export  interface BaseResponse {
  code: number;
  bigInt: number;
  doubleValue: number;
  message: any; // ⚠️⚠️⚠️ contact ur backend developer plz
  : string; // ⚠️⚠️⚠️ name it
  auth: bool;
  pageInfo: PageInfo;
  enum: string[];
  data: Data[];
}
export  interface PageInfo {
  pageNum: number;
  pageSize: number;
}
export  interface Data {
  id: string;
  title: string;
  price: number;
  hasBuy: bool;
  studentNum: number;
}
```

to dart

```dart
@JsonSerializable()
class BaseResponse {
  num code;
  Int64 bigInt;
  num doubleValue;
  Null message; // ⚠️⚠️⚠️ contact ur backend developer plz
  String ; // ⚠️⚠️⚠️ name it
  bool auth;
  PageInfo pageInfo;
  List<String> enum;
  List<Data> data;

  BaseResponse({ this.code, this.bigInt, this.doubleValue, this.message, this., this.auth, this.pageInfo, this.enum, this.data, });

  factory BaseResponse.fromJson(Map<String, dynamic> json) => _$BaseResponseFromJson(json);

  Map<String, dynamic> toJson() => _$BaseResponseToJson(this);
}


@JsonSerializable()
class PageInfo {
  num pageNum;
  num pageSize;

  PageInfo({ this.pageNum, this.pageSize, });

  factory PageInfo.fromJson(Map<String, dynamic> json) => _$PageInfoFromJson(json);

  Map<String, dynamic> toJson() => _$PageInfoToJson(this);
}

@JsonSerializable()
class Data {
  String id;
  String title;
  num price;
  bool hasBuy;
  num studentNum;

  Data({ this.id, this.title, this.price, this.hasBuy, this.studentNum, });

  factory Data.fromJson(Map<String, dynamic> json) => _$DataFromJson(json);

  Map<String, dynamic> toJson() => _$DataToJson(this);
}
```

## proto to dart/js

- [https://github.com/11os/p2a](https://github.com/11os/p2a)

## directory

```
a2a
  package
    core          core
    cli           cli
    json2dart     cra
    json2ts       next
```

## installation

```sh
$ yarn global add @a2a/cli # or npm i -g @a2a/cli
```

## usage

```sh
$ a2a -i path/to/json -o path/to/dist -t typescript # convert json to any

$ a2a --help
Usage: a2a [options]

convert path/to/*.json to path/to/*.any

Options:
  -V, --version        output the version number
  -i, --input <path>   json source directory path
  -o, --output <path>  export directory path
  -t, --type <type>    typescript dart (default: "typescript")
  -w, --watch          watch mode
  -h, --help           display help for command
```
