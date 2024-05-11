// rollup.config.mjs
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: false,
    },
    {
      file: "dist/index.min.js",
      format: "cjs",
      sourcemap: false,
      plugins: [terser()],
    },
  ],
  plugins: [typescript()],
};
