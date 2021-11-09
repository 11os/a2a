export const TEMPLATE_TYPESCRIPT = `export interface ###CLAZZ### {###PARAMS###
}

###LOOPS###`

export const TEMPLATE_DART = `@JsonSerializable()
class ###CLAZZ### {###PARAMS###
  ###CLAZZ###({ ###CONSTRUCTOR### });

  factory ###CLAZZ###.fromJson(Map<String, dynamic> json) => _$###CLAZZ###FromJson(json);

  Map<String, dynamic> toJson() => _$###CLAZZ###ToJson(this);
}

###LOOPS###`
