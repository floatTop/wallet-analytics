import { uploadFile } from "./util/upload";

// analytics(true).then((result) => {
  // console.log(result.groupedWallets);
  uploadFile({
    data: [],
    fileName: `wallet-analytics-${new Date().toLocaleString()}.json`,
  });
// });
