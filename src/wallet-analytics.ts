import fs from "fs";
import path from "path";
import { getBalance } from "./api/getBalanace";
import { getHolding } from "./api/getHolding";
import { getSignalList } from "./api/getSignalList";
import { getWallet } from "./api/getWallet";
import { getWalletByGroup } from "./api/getWalletByGroup";
import { getWalletGroup } from "./api/getWalletGroup";
import { getWalletList } from "./api/getWalletList";
import cliProgress from "./util/cliProgress";

async function main() {
  const progress = cliProgress("Analyzing Wallet");
  const signalList = await getSignalList();
  progress.start(Object.keys(signalList.meta.tokens).length, 0, {
    speed: "N/A",
  });
  const walletMap: {
    [token: string]: {
      gold: number;
      silver: number;
      bronze: number;
      double: number;
      stupid: number;
    };
  } = {};
  for (const token of Object.keys(signalList.meta.tokens)) {
    const element = signalList.meta.tokens[token];
    const signal = signalList.meta.signals[token];
    const chain = element.chain;
    const walletList = await getWalletList(token, chain);
    walletList.data.forEach((wallet) => {
      if (!walletMap[wallet.wallet]) {
        walletMap[wallet.wallet] = {
          gold: 0,
          silver: 0,
          bronze: 0,
          double: 0,
          stupid: 0,
        };
      }
      if (signal.token_level === "gold") {
        walletMap[wallet.wallet].gold++;
      }
      if (signal.token_level === "silver") {
        walletMap[wallet.wallet].silver++;
      }
      if (signal.token_level === "bronze") {
        walletMap[wallet.wallet].bronze++;
      }
      if (signal.max_price_gain > 1) {
        walletMap[wallet.wallet].double++;
      }
      if (signal.max_price_gain < 1) {
        const matCup =
          (signal.first_price * element.total_supply) / 10 ** element.decimals;
        if (matCup < 1e7) {
          walletMap[wallet.wallet].stupid++;
        }
      }
    });
    progress.increment();
  }

  const sortedWallets = Object.keys(walletMap)
    .map((wallet) => ({
      wallet,
      ...walletMap[wallet],
      stupidDoubleRatio:
        walletMap[wallet].double + walletMap[wallet].stupid === 0
          ? 0 // 当没有任何交易时，将比率设为0
          : walletMap[wallet].stupid /
            (walletMap[wallet].double + walletMap[wallet].stupid),
    }))
    .sort((a, b) => b.stupidDoubleRatio - a.stupidDoubleRatio)
    .reduce((acc, curr) => {
      acc[curr.wallet] = {
        gold: curr.gold,
        silver: curr.silver,
        bronze: curr.bronze,
        double: curr.double,
        stupid: curr.stupid,
        stupidDoubleRatio: curr.stupidDoubleRatio,
      };
      return acc;
    }, {} as Record<string, any>);

  const stupidWallet = Object.keys(sortedWallets).filter(
    (wallet) => sortedWallets[wallet].stupidDoubleRatio === 1
  );
  progress.stop();

  const walletSet = new Map<string, string>();
  const stupidProgress = cliProgress("Stupid Wallet Analysis");
  stupidProgress.start(stupidWallet.length, 0);

  for (const wallet of stupidWallet) {
    const { data: walletStats } = await getWallet(wallet);
    if (
      walletStats.last_active_timestamp &&
      Date.now() / 1000 - walletStats.last_active_timestamp > 3 * 24 * 60 * 60
    ) {
      walletSet.set(
        wallet,
        `活跃时间小于3天 ${new Date(
          walletStats.last_active_timestamp * 1000
        ).toLocaleString()}`
      );
    } else if (walletStats.token_winrate_7d < 0.4) {
      walletSet.set(wallet, "7天token胜率小于40%");
    } else if (walletStats.token_num < 3) {
      walletSet.set(wallet, "token数量小于3");
    } else {
      const balance = await getBalance(wallet);
      if (balance < 2) {
        const holding = await getHolding({
          chain: "solana",
          wallet,
        });
        const solBalance = holding.data.holding_tokens.reduce(
          (acc: number, token: any) => {
            if (token.token.symbol === "SOL") {
              acc += token.balance;
            }
            return acc;
          },
          0
        );
        if (balance + solBalance < 2) {
          walletSet.set(wallet, "余额小于2SOL");
        }
      }
    }
    stupidProgress.increment();
  }
  stupidProgress.stop();

  const allWalletProgress = cliProgress("Get All Wallets");
  const { data: groupGroupList } = await getWalletGroup();

  allWalletProgress.start(groupGroupList.length, 0);
  const wallets: { [groupId: string]: string[] } = {};
  for (const group of groupGroupList) {
    const { data: walletList } = await getWalletByGroup(group.id);
    walletList?.items.forEach((item) => {
      wallets[group.id] = [...(wallets[group.id] || []), item.wallet_address];
    });
    allWalletProgress.increment();
  }
  allWalletProgress.stop();

  await getLowWinLowPnl(wallets);

  const fileProgress = cliProgress("Writing Files");
  fileProgress.start(3, 0);

  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }

  // 将钱包按照分组ID组织
  const groupedWallets: { [groupId: string]: string[] } = {};
  for (const [wallet, reason] of walletSet) {
    // 查找钱包所属的分组
    for (const [groupId, walletList] of Object.entries(wallets)) {
      if (walletList.includes(wallet)) {
        if (!groupedWallets[groupId]) {
          groupedWallets[groupId] = [];
        }
        groupedWallets[groupId].push(wallet);
        break;
      }
    }
  }
  // 写入按分组组织的钱包列表
  fs.writeFileSync(
    "output/wallet-list.json",
    JSON.stringify(groupedWallets, null, 2)
  );
  fileProgress.increment();

  fs.writeFileSync(
    "output/wallet-reason-list.json",
    JSON.stringify(Array.from(walletSet), null, 2)
  );
  fileProgress.increment();

  fs.writeFileSync(
    "output/wallet-analytics.json",
    JSON.stringify(sortedWallets, null, 2)
  );
  fileProgress.increment();
  fileProgress.stop();

  console.log(
    `Done! wallet count: ${Object.keys(walletMap).length} token count: ${
      Object.keys(signalList.meta.tokens).length
    }`
  );

  // 输出文件绝对路径
  console.log("钱包分析结果", path.resolve("output/wallet-analytics.json"));
  console.log("不太聪敏的钱包列表", path.resolve("output/wallet-list.json"));
  console.log("不太聪明的钱包以及理由列表", path.resolve("output/wallet-reason-list.json"));
  console.log("低胜率且低收益的钱包列表", path.resolve("output/low-win-low-pnl-wallets.json"));
}

main();

async function getLowWinLowPnl(wallets: { [groupId: string]: string[] }) {
  console.log("开始分析低胜率低盈利钱包");

  const lowWinLowPnlWallets = new Set<string>();
  const walletsArray = Object.values(wallets).flat();
  const batchSize = 20;
  
  const analysisProgress = cliProgress("Low Win Low Pnl Wallets Analysis");
  analysisProgress.start(walletsArray.length, 0);

  for (let i = 0; i < walletsArray.length; i += batchSize) {
    const batch = walletsArray.slice(i, i + batchSize);
    const promises = batch.map(async (wallet) => {
      const { data: walletStats } = await getWallet(wallet);
      if (walletStats.token_winrate_7d < 0.4 && walletStats.pnl_7d < 0.2) {
        lowWinLowPnlWallets.add(wallet);
      }
      analysisProgress.increment();
    });
    await Promise.all(promises);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 每次运行完暂停3s
  }
  
  analysisProgress.stop();

  fs.writeFileSync(
    "output/low-win-low-pnl-wallets.json",
    JSON.stringify(Array.from(lowWinLowPnlWallets), null, 2)
  );
}
