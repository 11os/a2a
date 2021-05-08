import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: false,
    commonjsOptions: {
      // dynamicRequireTargets: ["!node_modules/protobufjs/*.js"],
    },
    rollupOptions: {
      // plugins: [commonjs],
    },
  },
});
