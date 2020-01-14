export const json2dart = (json: string, clazz: string) => {
  if (!json) return "";
  try {
    let jsonObject = JSON.parse(json);
    let loop = [];
    let result = span(`${blue("@JsonSerializable")}()`);
    result += `<br />`;
    result += span(`${blue("class")} ${green(clazz)} {`);
    result += `<br />`;
    let params = "";
    let constructor = "";
    for (let key in jsonObject) {
      let value = jsonObject[key];
      switch (Object.prototype.toString.call(value)) {
        case "[object Boolean]":
          params += span(`  ${green("bool")} ${key}; `);
          break;
        case "[object Number]":
          params += span(`  ${green("int")} ${key}; `);
          break;
        case "[object Array]":
          let obj = value?.[0];
          obj &&
            loop.push({
              json: JSON.stringify(obj),
              clazz: FirstUpperCase(key)
            });
          params += span(
            `  ${green(`List&lt;${FirstUpperCase(key)}&gt;`)} ${key}; `
          );
          break;
        case "[object Object]":
          loop.push({
            json: JSON.stringify(value),
            clazz: FirstUpperCase(key)
          });
          params += span(`  ${green(`${FirstUpperCase(key)}`)} ${key}; `);
          break;
        case "[object String]":
        default:
          params += span(`  ${green("String")} ${key}; `);
          break;
      }
      params += `<br />`;
      constructor += `${blue("this")}.${key}, `;
    }
    // build params
    result += params;
    result += `<br />`;
    // build constructor
    result += span(`  ${green(clazz)}({${constructor}});`);
    result += `<br />`;
    result += `<br />`;
    result += span(
      `  ${blue("factory")} ${green(clazz)}.${yellow("fromJson")}(${green(
        "Map&lt;String, dynamic&gt;"
      )} json) => _$${wrap(`${clazz}FromJson`, "green")}(json);`
    );
    result += `<br />`;
    result += `<br />`;
    result += span(
      `  ${green("Map&lt;String, dynamic&gt;")} ${yellow(
        "toJson"
      )}() => ${green(`_$${clazz}ToJson`)}(${blue("this")});`
    );
    result += `<br />`;
    result += `}`;
    result += `<br />`;
    result += `<br />`;
    result += loop
      .map(({ json, clazz }) => json2dart(json, clazz))
      .join("<br />");
    return result;
  } catch (error) {
    return error.message;
  }
};

const wrap = (value: string, clazz?: string) =>
  `<span ${wrapClazz(clazz)}>${value}</span>`;
const span = wrap;
const green = (value: string) => wrap(value, "green");
const blue = (value: string) => wrap(value, "blue");
const yellow = (value: string) => wrap(value, "yellow");
const wrapClazz = (clazz?: string) => (clazz ? `class="${clazz}"` : "");

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
