import typescript from "@rollup/plugin-typescript";

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/index.cjs",
      format: "cjs"
    },
    {
      file: "./dist/index.mjs",
      format: "esm"
    }
  ],
  external: [
    "fs/promises",
    "path"
  ],
  plugins: [
    typescript()
  ]
};

export default config;
