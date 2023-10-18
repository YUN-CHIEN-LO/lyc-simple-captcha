import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".ts", ".tsx", ".json", ".vue", ".scss"],
  },
  build: {
    target: "es6",
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: true,
    cssCodeSplit: true,
    lib: {
      // src/index.ts is where we have exported the component(s)
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "LycSimpleCaptchaVue",
      // the name of the output files when the build is run
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `lyc-simple-captcha-vue.${format}.js`,
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/index.ts"),
      },
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
