import fs from 'fs';
import bnbAnalytics from "./fun/bnbAnalytics";
import { uploadFile } from './util/upload';


bnbAnalytics().then((wallets) => {
  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }
  fs.writeFileSync(
    "output/bnbAnalytics.json",
    JSON.stringify(wallets, null, 2)
  );
  uploadFile({
    data: wallets,
    fileName: "bnbAnalytics.json",
  });
});
