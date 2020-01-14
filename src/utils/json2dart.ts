const template =
  '<div><span><span class="blue">@JsonSerializable</span>()</span><br/><span><span class="blue">class </span><span class="green">###CLASS_NAME###</span> {</span><br/>###PARAMS###<br/><span><span class="green">  ###CLASS_NAME###</span>({ ###CONSTRUCTOR###});</span><br/><br/><span><span class="blue">  factory </span><span class="green">###CLASS_NAME###</span>.<span class="yellow">fromJson</span>(<span class="green">Map&lt;String, dynamic&gt;</span> json) =&gt; <span class="green">_$###CLASS_NAME###FromJson</span>(json);</span><br/><br/><span><span class="green">  Map&lt;String, dynamic&gt;</span><span class="yellow"> toJson</span>() =&gt; <span class="green">_$###CLASS_NAME###ToJson</span>(<span class="blue">this</span>);</span><br/>}<br/><br/></div>';

const buildClazz = ({
  clazz,
  params,
  constructor
}: {
  clazz: string;
  params: string;
  constructor: string;
}) =>
  template
    .replace(/###CLASS_NAME###/g, clazz)
    .replace(/###PARAMS###/g, params)
    .replace(/###CONSTRUCTOR###/g, constructor);

export const json2dart = (json: string, clazz: string) => {
  if (!json) return "";
  try {
    let jsonObject = JSON.parse(json);
    let loop = [];
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
    let result = "";
    result += buildClazz({ clazz, params, constructor });
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
const wrapClazz = (clazz?: string) => (clazz ? `class="${clazz}"` : "");

const FirstUpperCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
