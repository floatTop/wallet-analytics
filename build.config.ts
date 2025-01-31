import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/wallet-analytics"],
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
});
