import { analytics } from "./fun/analytics";
import { uploadFile } from "./util/upload";

analytics().then((result) => {
  console.log(result.groupedWallets);
  uploadFile({
    data: result.groupedWallets,
    fileName: `wallet-analytics-${new Date().toLocaleString()}.json`,
  });
});
