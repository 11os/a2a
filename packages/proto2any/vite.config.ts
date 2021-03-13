import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    commonjsOptions: {
      dynamicRequireTargets: ["!node_modules/protobufjs/*,js"],
    },
    rollupOptions: {
      plugins: [],
    },
  },
});
