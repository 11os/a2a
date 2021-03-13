<template>
  <header>
    <span class="title">proto2{{ mLang }}</span>
    <span class="subtitle">protobuf to ast to {{ mLang }}</span>
  </header>
  <div class="control">
    <button class="show-ast-btn" @click="showDemo()">show demo</button>
    <button class="show-ast-btn" @click="clearForm()">clear</button>
    <button class="show-ast-btn" @click="mShowAst = !mShowAst">
      {{ mShowAst ? "hide" : "show" }} ast
    </button>
    <div style="flex: 1"></div>
    <div v-if="mCopySuccess" class="copy-hint">
      <span> 👿 copy to clipboard success </span>
    </div>
    <button
      class="show-ast-btn"
      id="copyOutput"
      @mouseleave="mCopySuccess = false"
    >
      copy
    </button>
  </div>
  <div class="body-wrapper">
    <textarea
      class="body-left"
      v-model="form.input"
      placeholder="paste proto here"
    />
    <div v-if="mShowAst" class="body-center">{{ form.ast }}</div>
    <div v-if="form.error" class="body-right">{{ form.error }}</div>
    <div v-else class="body-right">
      <div v-if="mLang === 'ts'">
        <ts-item
          v-for="(clazz, idx) in form.output"
          :key="clazz.name + idx"
          :clazz="clazz"
        />
      </div>
      <div v-if="mLang === 'dart'">
        <dart-item
          v-for="(clazz, idx) in form.output"
          :key="clazz.name + idx"
          :clazz="clazz"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watchEffect } from "vue";
import DartItem from "../components/DartItem.vue";
import TsItem from "../components/TsItem.vue";
import { getProtoDemo } from "../api/mock";
import { transform } from "../utils/transformer";
import protobuf from "protobufjs";
import ClipboardJS from "clipboard";

export default defineComponent({
  name: "Index",
  components: {
    DartItem,
    TsItem,
  },
  setup: () => {
    const mLang = ref("dart");
    const mShowAst = ref(false);
    const mCopySuccess = ref(false);
    if (window.location.href.indexOf("dart") > -1) {
      mLang.value = "dart";
    } else if (window.location.href.indexOf("ts") > -1) {
      mLang.value = "ts";
    }
    const form = reactive({
      input: getProtoDemo(),
      ast: "",
      output: [],
      error: "",
    });
    function showDemo() {
      form.input = getProtoDemo();
    }
    function clearForm() {
      form.input = "";
    }
    new ClipboardJS("#copyOutput", {
      text: function (trigger) {
        let source: any = document.querySelector(".body-right");
        return source.innerText;
      },
    }).on("success", () => {
      mCopySuccess.value = true;
    });
    watchEffect(() => {
      try {
        const { root } = protobuf.parse(form.input); // FIXME: Cannot read property 'emptyArray' of undefined cause by protobuf with commonjs
        form.ast = JSON.stringify(root);
        console.log("ast = ", root);
        const output = transform(root);
        form.output = output;
        console.log("clazzes = ", output);
        form.error = "";
      } catch (e) {
        form.error = e;
        // console.error(e);
      }
    });
    return { mLang, form, clearForm, mShowAst, mCopySuccess, showDemo };
  },
});
</script>

<style scoped>
/* header */
header {
  display: flex;
  align-items: center;
  background-color: #3078c6;
  color: white;
  padding: 8px;
}
.title {
  font-size: 32px;
}
.subtitle {
  margin-left: 16px;
}
/* control */
.row {
  display: flex;
  flex: 1;
}
.control {
  display: flex;
  padding: 8px;
  flex: 1;
}
.show-ast-btn + .show-ast-btn {
  margin-left: 8px;
}
.copy-hint {
  margin-right: 8px;
}
/* body */
.body-wrapper {
  display: flex;
  flex-flow: row nowrap;
  height: 80vh;
  padding: 0 8px;
}
.body-left {
  flex: 1;
  white-space: pre-wrap;
  padding: 8px;
  border: 1px #666 solid;
}
.body-center {
  flex: 1;
  margin-left: 8px;
  padding: 8px;
  border: 1px #666 solid;
}
.body-right {
  overflow: auto;
  white-space: pre-wrap;
  flex: 1;
  margin-left: 8px;
  padding: 8px;
  border: 1px #666 solid;
  background-color: #1e1e1e;
  text-align: left;
  color: white;
}
</style>
