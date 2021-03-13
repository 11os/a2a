<template>
  <div v-if="clazz.type === 'clazz'">
    <!-- class -->
    <div>
      <span className="blue">export interface </span
      ><span className="green">{{ clazz?.name }}</span> {
    </div>
    <!-- params -->
    <div v-for="(ele, idx) in clazz?.fields" :key="'ele.key' + idx">
      &nbsp;&nbsp;{{ ele.name }}:
      <span v-if="ele.isList" className="green"
        >{{ tsValueType(ele.type) }}[];</span
      >
      <span v-else className="green">{{ tsValueType(ele.type) }};</span>
      <span v-if="ele.comment" className="red"> // {{ ele.comment }}</span>
    </div>
    &rbrace;
    <br />
    <br />
  </div>
  <div v-else></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Clazz } from "../utils/transformer";
import { tsValueType } from "../utils/valueType";
export default defineComponent({
  name: "TsItem",
  props: {
    clazz: { type: Object as PropType<Clazz> },
  },
  setup() {
    return { tsValueType };
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
