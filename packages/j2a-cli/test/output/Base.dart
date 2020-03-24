@JsonSerializable()
class Base {
  number: code;
  Int64: bigInt;
  double: doubleValue;
  Null: message; // ⚠️⚠️⚠️ null value
  String: ; // ⚠️⚠️⚠️ empty name
  bool: auth;
  PageInfo: pageInfo;
  List<Data>: data;
  Base({ this.code, this.bigInt, this.doubleValue, this.message, this., this.auth, this.pageInfo, this.data });

  factory Base.fromJson(Map<String, dynamic> json) => _$BaseFromJson(json);

  Map<String, dynamic> toJson() => _$BaseToJson(this);
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

