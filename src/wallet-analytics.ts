import fs from "fs";
import path from "path";
import { analytics } from "./fun/analytics";

analytics().then((result) => {
  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }
  fs.writeFileSync("output/wallet-analytics.json", JSON.stringify(result.groupedWallets, null, 2));
  console.log(
    "钱包分析结果",
    path.resolve(
      `output/wallet-analytics-${new Date().toLocaleDateString()}.json`
    )
  );
});
