<template>
  <div v-if="clazz.type === 'clazz'">
    <div><span className="blue">@JsonSerializable</span>()</div>
    <!-- class -->
    <div>
      <span className="blue">class </span
      ><span className="green">{{ clazz?.name }}</span> {
    </div>
    <!-- params -->
    <div v-for="(ele, idx) in clazz?.fields" :key="'ele.key' + idx">
      <span v-if="ele.isList" className="green"
        >List&lt;{{ dartValueType(ele.type) }}&gt;</span
      >
      <span v-else className="green">{{ dartValueType(ele.type) }}</span>
      {{ ele.name }};
      <span v-if="ele.comment" className="red"> // {{ ele.comment }}</span>
    </div>
    <br />
    <!-- define -->
    <div>
      <span className="green">{{ clazz?.name }}</span
      >({
      <span v-for="(ele, idx) in clazz?.fields" :key="'ele.key' + idx"
        ><span className="blue">this</span>.{{ ele.name }}, </span
      >});
    </div>
    <br />
    <div>
      <span className="blue">factory </span
      ><span className="green">{{ clazz?.name }}</span
      >.<span className="yellow">fromJson</span>(<span className="green"
        >Map&lt;String, dynamic&gt;</span
      >
      json) =&gt;
      <span className="green">_${{ clazz?.name }}FromJson</span>(json);
    </div>
    <br />
    <div>
      <span className="green">Map&lt;String, dynamic&gt;</span
      ><span className="yellow"> toJson</span>() =&gt;
      <span className="green">_${{ clazz?.name }}ToJson</span>(<span
        className="blue"
        >this</span
      >);
    </div>
    &rbrace;
    <br />
    <br />
  </div>
  <div v-else>
    <!-- class -->
    <div>
      <span className="blue">class </span
      ><span className="green">{{ clazz?.name }}</span> {
    </div>
    <!-- params -->
    <div v-for="(ele, idx) in clazz?.fields" :key="'ele.key' + idx">
      <span className="blue">static const </span>
      <span className="green">String {{ ele.name }} = </span>
      '{{ ele.name }}';
      <span v-if="ele.comment" className="red"> // {{ ele.comment }}</span>
    </div>
    &rbrace;
    <br />
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Clazz } from "../utils/transformer";
import { dartValueType } from "../utils/valueType";
export default defineComponent({
  name: "DartItem",
  props: {
    clazz: { type: Object as PropType<Clazz> },
  },
  setup() {
    return { dartValueType };
  },
});
</script>

<style scoped>
.green {
  color: #4ec9b0;
}

.blue {
  color: #569cd6;
}

.yellow {
  color: #dbdda4;
}

.red {
  color: #f84f4f;
}

.align-right {
  margin-top: 10px;
  text-align: right;
}
</style>
