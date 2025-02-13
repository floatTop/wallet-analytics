import fs from "fs";
import getBnbBalance from "../api/getBnbBalance";
import { getHolding } from "../api/getHolding";
import { getWallet } from "../api/getWallet";
import cliProgress from "../util/cliProgress";

export default async function bnbAnalytics() {
  const data1 = fs.readFileSync("files/1.txt", "utf8");
  const data2 = fs.readFileSync("files/2.txt", "utf8");
  const data3 = fs.readFileSync("files/3.txt", "utf8");
  const jsonData = data1.split("\n");
  const jsonData2 = data2.split("\n");
  const jsonData3 = data3.split("\n");
  const wallets = [...jsonData, ...jsonData2, ...jsonData3];
  const walletSet = new Set(wallets.map((wallet) => wallet.trim()));

  console.log(walletSet.size);

  const progress = cliProgress("Analyzing Wallet");

  progress.start(walletSet.size, 0);

  const concurrencyLimit = 20;
  const walletArray = new Set();
  const firstWallet = new Set();
  const walletList = Array.from(walletSet);
  let index = 0;

  async function processWallet() {
    while (index < walletList.length) {
      if (index % 20 === 0 && index > 0) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      const wallet = walletList[index++];
      const { data } = await getWallet(wallet, "bsc");
      console.log(index, walletList.length);
      if (data.buy_times_7d + data.sell_times_7d > 1500) {
        continue;
      }
      if (data.token_winrate_7d > 0.3) {
        continue;
      }

      if (
        data.last_active_timestamp &&
        Date.now() / 1000 - data.last_active_timestamp > 3 * 24 * 60 * 60
      ) {
        continue;
      }

      if (data.token_num < 3) {
        continue;
      }

      if (data.pnl_7d < 0.1) {
        continue;
      }

      firstWallet.add(wallet);

      const balance = await getBnbBalance(wallet);
      if (balance < 0.001) {
        continue;
      }
      let holding;
      for (let i = 0; i < 5; i++) {
        try {
          holding = await getHolding({
            chain: "bsc",
            wallet,
          });
          break;
        } catch (error) {
          if (i === 4) throw error;
        }
      }

      if (holding) {
        const holdingBalance = holding.data.holding_tokens.reduce(
          (acc: number, token: any) => {
            if (token.balance) {
              acc += token.balance;
            }
            return acc;
          },
          0
        );
        if (balance + holdingBalance < 0.001) {
          continue;
        }
      }

      walletArray.add(wallet);
      progress.increment();
    }
  }

  const tasks = Array.from({ length: concurrencyLimit }, () => processWallet());
  await Promise.all(tasks);

  console.log(walletArray.size, firstWallet.size);

  const diffWallets1 = new Set(
    [...walletArray].filter((wallet) => !firstWallet.has(wallet))
  );
  const diffWallets2 = new Set(
    [...firstWallet].filter((wallet) => !walletArray.has(wallet))
  );
  console.log("Difference between walletArray and firstWallet:", diffWallets1);
  console.log("Difference between firstWallet and walletArray:", diffWallets2);

  return Array.from(walletArray);
}
