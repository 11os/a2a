export const json2dart = (json: string) => {
  if (!json) return "";
  try {
    let jsonObject = JSON.parse(json);
    let loop = [];
    let params = [];
    for (let key in jsonObject) {
      let value = jsonObject[key];
      switch (Object.prototype.toString.call(value)) {
        case "[object Boolean]":
          params.push({
            type: "bool",
            key: key
          });
          break;
        case "[object Number]":
          params.push({
            type: "int",
            key: key
          });
          break;
        case "[object Array]":
          let obj = value?.[0];
          obj &&
            loop.push({
              json: JSON.stringify(obj),
              clazz: FirstUpperCase(key)
            });
          params.push({
            type: `List<${FirstUpperCase(key)}>`,
            key: key
          });
          break;
        case "[object Object]":
          loop.push({
            json: JSON.stringify(value),
            clazz: FirstUpperCase(key)
          });
          params.push({
            type: `${FirstUpperCase(key)}`,
            key: key
          });
          break;
        case "[object String]":
        default:
          params.push({
            type: `String`,
            key: key
          });
          break;
      }
    }
    return { params, loop };
  } catch (error) {
    return error.message;
  }
};

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
