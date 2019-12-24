export const json2dart = (json: string, clazz: string) => {
  if (!json) return "";
  try {
    let jsonObject = JSON.parse(json);
    let loop = [];
    let result = wrap(`${wrap("@JsonSerializable", "blue")}()`);
    result += `<br />`;
    result += wrap(`${wrap("class", "blue")} ${wrap(clazz, "green")} {`);
    result += `<br />`;
    let params = "";
    let constructor = "";
    for (let key in jsonObject) {
      let value = jsonObject[key];
      switch (Object.prototype.toString.call(value)) {
        case "[object String]":
          params += wrap(`  ${wrap("String", "green")} ${key}; `);
          break;
        case "[object Boolean]":
          params += wrap(`  ${wrap("bool", "green")} ${key}; `);
          break;
        case "[object Number]":
          params += wrap(`  ${wrap("int", "green")} ${key}; `);
          break;
        case "[object Array]":
          let obj = value?.[0];
          obj &&
            loop.push({
              json: JSON.stringify(obj),
              clazz: FirstUpperCase(key)
            });
          params += wrap(
            `  ${wrap(`List&lt;${FirstUpperCase(key)}&gt;`, "green")} ${key}; `
          );
          break;
        case "[object Object]":
          loop.push({
            json: JSON.stringify(value),
            clazz: FirstUpperCase(key)
          });
          params += wrap(
            `  ${wrap(`${FirstUpperCase(key)}`, "green")} ${key}; `
          );
          break;
        default:
          params += wrap(`  ${wrap("String", "green")} ${key}; `);
          break;
      }
      params += `<br />`;
      constructor += `${wrap("this", "blue")}.${key}, `;
    }
    // build params
    result += params;
    result += `<br />`;
    // build constructor
    result += wrap(`  ${wrap(clazz, "green")}({${constructor}});`);
    result += `<br />`;
    result += `<br />`;
    result += wrap(
      `  ${wrap("factory", "blue")} ${wrap(clazz, "green")}.${wrap(
        "fromJson",
        "yellow"
      )}(${wrap("Map&lt;String, dynamic&gt;", "green")} json) => _$${wrap(
        `${clazz}FromJson`,
        "green"
      )}(json);`
    );
    result += `<br />`;
    result += `<br />`;
    result += wrap(
      `  ${wrap("Map&lt;String, dynamic&gt;", "green")} ${wrap(
        "toJson",
        "yellow"
      )}() => ${wrap(`_$${clazz}ToJson`, "green")}(${wrap("this", "blue")});`
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
const wrapClazz = (clazz?: string) => (clazz ? `class="${clazz}"` : "");

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
