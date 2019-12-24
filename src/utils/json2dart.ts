export const handleJson = (json: string, clazz: string) => {
  try {
    let jsonObject = JSON.parse(json);
    let loop = [];
    let result = `@JsonSerializable()`;
    result += `\n`;
    result += `class ${clazz} {`;
    result += `\n`;
    let params = "";
    let constructor = "";
    for (let key in jsonObject) {
      let value = jsonObject[key];
      switch (Object.prototype.toString.call(value)) {
        case "[object String]":
          params += `  String ${key}; \n`;
          break;
        case "[object Boolean]":
          params += `  bool ${key}; \n`;
          break;
        case "[object Number]":
          params += `  int ${key}; \n`;
          break;
        case "[object Array]":
          let obj = value?.[0];
          obj &&
            loop.push({
              json: JSON.stringify(obj),
              clazz: FirstUpperCase(key)
            });
          params += `  List<${FirstUpperCase(key)}> ${key}; \n`;
          break;
        case "[object Object]":
          loop.push({
            json: JSON.stringify(value),
            clazz: FirstUpperCase(key)
          });
          params += `  ${FirstUpperCase(key)} ${key}; \n`;
          break;
        default:
          params += `  String ${key}; \n`;
          break;
      }
      constructor += `this.${key}, `;
    }
    // build params
    result += params;
    result += `\n`;
    // build constructor
    result += `  ${clazz}({${constructor}});`;
    result += `\n`;
    result += `\n`;
    result += `  factory ${clazz}.fromJson(Map<String, dynamic> json) => _$${clazz}FromJson(json);`;
    result += `\n`;
    result += `\n`;
    result += `  Map<String, dynamic> toJson() => _$${clazz}ToJson(this);`;
    result += `\n`;
    result += `}`;
    result += `\n`;
    result += `\n`;
    result += loop.map(({ json, clazz }) => handleJson(json, clazz)).join("\n");
    return result;
  } catch (error) {
    return error.message;
  }
};

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
