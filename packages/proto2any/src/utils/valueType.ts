export function dartValueType(type: String) {
  if (type.toLowerCase().indexOf("enum") > -1) return "String";
  switch (type) {
    case "string":
      return "String";
    case "bool":
      return "bool";
    case "float":
    case "double":
      return "double";
    case "int32":
      return "int";
    case "int64":
      return "Int64";
    default:
      return type;
  }
}

export function tsValueType(type: String) {
  if (type.toLowerCase().indexOf("enum") > -1) return "String";
  switch (type) {
    case "string":
    case "int64":
      return "String";
    case "bool":
      return "Boolean";
    case "float":
    case "double":
    case "int32":
      return "Number";
    default:
      return type;
  }
}
