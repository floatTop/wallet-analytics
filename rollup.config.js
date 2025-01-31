const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");
const glob = require("glob");

const inputFiles = glob.sync("src/**/*.ts"); // 使用 glob 语法获取所有 .ts 文件


module.exports = {
  input: inputFiles, 
  output: {
    dir: "dist",  // 合并成一个文件
    format: "cjs",
    // preserveModules: false,  // 确保打包成一个文件
  },
  plugins: [resolve(), commonjs(), typescript()],
  // 使用 manualChunks 把所有文件打包成一个 chunk
};