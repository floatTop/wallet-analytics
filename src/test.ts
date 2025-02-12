import { uploadFile } from "./util/upload";

uploadFile({
  data: [],
  fileName: `wallet-analytics-${new Date().toLocaleString()}.json`,
});