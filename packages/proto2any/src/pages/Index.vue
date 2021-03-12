<template>
  <header>
    <h1>proto2any</h1>
    <p>protobuf to json to any</p>
  </header>
  <div class="body-wrapper">
    <textarea class="body-left" v-model="form.input"></textarea>
    <textarea class="body-center" v-model="form.temp"></textarea>
    <textarea class="body-right" v-model="form.output"></textarea>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, watchEffect } from "vue";
import { getProtoDemo } from "../api/mock";
import { transform } from "../utils/transformer";
import protobuf from "protobufjs";
export default defineComponent({
  name: "Index",
  setup: () => {
    const form = reactive({
      input: getProtoDemo(),
      temp: "",
      output: "",
    });
    watchEffect(() => {
      try {
        const { root } = protobuf.parse(form.input);
        form.temp = JSON.stringify(root);
        console.log(transform(root));
        form.output = JSON.stringify(transform(root));
      } catch (e) {
        form.output = e;
      }
    });
    return { form };
  },
});
</script>

<style scoped>
.body-wrapper {
  display: flex;
  flex-flow: row nowrap;
  height: 80vh;
  padding: 16px;
}
.body-left {
  flex: 1;
  padding: 8px;
}
.body-center {
  flex: 1;
  margin-left: 16px;
  padding: 8px;
}
.body-right {
  flex: 1;
  margin-left: 16px;
  padding: 8px;
}
</style>
