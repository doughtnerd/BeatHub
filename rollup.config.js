import svelte from "rollup-plugin-svelte";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import resolve from "@rollup/plugin-node-resolve";
import { autoPreprocess } from "svelte-preprocess/dist/autoProcess";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "umd",
    name: "beathub",
    file: "public/bundle.js"
  },
  plugins: [
    svelte({
      dev: !production,
      preprocess: autoPreprocess(),
      css: css => {
        css.write("public/bundle.css");
      },
      emitCss: true
    }),
    resolve({
      browser: true,
      dedupe: importee =>
        importee === "svelte" || importee.startsWith("svelte/")
    }),
    commonjs(),
    // globals(),
    // builtins(),
    postcss({
      extract: true,
      minimize: true,
      use: [
        [
          "sass",
          {
            includePaths: ["./src/theme/", "./node_modules/"]
          }
        ]
      ]
    }),
    !production && livereload("public"),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
