export function getProtoDemo() {
  return `syntax = "proto3";
message Human {
  string name = 1;
  string sex = 2;
  Head head = 3;
  Body body = 4;
  SkinEnum skinEnum = 5;
  repeated string collections = 6;
}
enum SkinEnum {
  WHITE = 0;
  BLACK = 1;
  YELLOW = 2;
  BROWN = 3;
}
message Head {
  double iq =  1;
}
message Body {
  double height = 1;
  double weight = 2;
}
message Foot {
  bool isShort = 1;
}`;
}
