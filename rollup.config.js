import typescript from "@rollup/plugin-typescript";

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "./src/index.ts",
  output: {
    file: "./dist/index.js",
    format: "esm"
  },
  external: [
    "fs",
    "fs/promises",
    "path"
  ],
  plugins: [
    typescript()
  ]
};

export default config;
