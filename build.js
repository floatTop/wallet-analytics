require("esbuild").build({
  entryPoints: ["src/wallet-analytics.ts"],
  bundle: true, // 👈 这个会自动打包 `node_modules` 的依赖
  platform: "node",
  target: "node16",
  outfile: "dist/wallet-analytics.js",
  external: [], // 👈 如果你不想排除任何依赖，可以设为空数组
  treeShaking: true,
}).catch(() => process.exit(1));
