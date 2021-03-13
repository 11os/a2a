<template>
  <index />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Index from "./pages/Index.vue";

export default defineComponent({
  name: "App",
  components: {
    Index,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  padding: 0;
  margin: 0;
}
</style>
