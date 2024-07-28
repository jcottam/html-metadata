import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default {
  input: "src/index.ts", // Adjust this to your entry file
  output: [
    {
      file: "dist/index.cjs.js", // CommonJS output file
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.min.js", // Minified CommonJS output file
      format: "cjs",
      sourcemap: false,
      plugins: [terser()],
    },
    {
      file: "dist/index.esm.js", // ES Module output file
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // so Rollup can find `node_modules`
    commonjs(), // convert CommonJS to ES6
    typescript(), // convert TypeScript to JavaScript
  ],
}
