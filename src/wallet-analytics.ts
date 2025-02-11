import { analytics } from "./fun/analytics";
import { uploadFile } from "./util/upload";

analytics().then((result) => {
  uploadFile({data: result.groupedWallets, fileName: "wallet-analytics.json"});
});
