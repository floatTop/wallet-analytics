import { getBalance } from "@/api/getBalanace";
import { getHolding } from "@/api/getHolding";
import { getSignalList } from "@/api/getSignalList";
import { getWallet } from "@/api/getWallet";
import { getWalletByGroup } from "@/api/getWalletByGroup";
import { getWalletGroup } from "@/api/getWalletGroup";
import { getWalletList } from "@/api/getWalletList";
import cliProgress from "@/util/cliProgress";

export async function analytics() {
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
  const tokens = Object.keys(signalList.meta.tokens);

  const signalListBatchSize = 10; // 设置并发数为10

  for (let i = 0; i < tokens.length; i += signalListBatchSize) {
    const batch = tokens.slice(i, i + signalListBatchSize);
    const promises = batch.map(async (token) => {
      const element = signalList.meta.tokens[token];
      const signal = signalList.meta.signals[token];
      const chain = element.chain;
      let walletList;
      let retries = 3;
      while (retries > 0) {
        try {
          walletList = await getWalletList(token, chain);
          break; // 成功获取数据后跳出循环
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒后重试
        }
      }
      walletList?.data.forEach((wallet) => {
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
            (signal.first_price * element.total_supply) /
            10 ** element.decimals;
          if (matCup < 1e7) {
            walletMap[wallet.wallet].stupid++;
          }
        }
      });
      progress.increment();
    });
    await Promise.all(promises);
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

  const batchSize = 20;
  for (let i = 0; i < stupidWallet.length; i += batchSize) {
    const batch = stupidWallet.slice(i, i + batchSize);
    const promises = batch.map(async (wallet) => {
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
        let balance;
        for (let i = 0; i < 5; i++) {
          try {
            balance = await getBalance(wallet);
            break;
          } catch (error) {
            if (i === 4) throw error;
          }
        }

        if (balance !== undefined && balance < 2) {
          let holding;
          for (let i = 0; i < 5; i++) {
            try {
              holding = await getHolding({
                chain: "solana",
                wallet,
              });
              break;
            } catch (error) {
              if (i === 4) throw error;
            }
          }

          if (holding) {
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
      }
      stupidProgress.increment();
    });
    await Promise.all(promises);
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

  const lowWinLowPnlWallets = await getLowWinLowPnl(wallets);

  for (const wallet of lowWinLowPnlWallets) {
    walletSet.set(wallet, "token胜率小于40%且7天收益小于20%");
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
  fileProgress.increment();
  fileProgress.stop();

  console.log(
    `Done! wallet count: ${Object.keys(walletMap).length} token count: ${
      Object.keys(signalList.meta.tokens).length
    }`
  );

 return {
  groupedWallets,
  walletSet,
  sortedWallets,
  lowWinLowPnlWallets,
 }
}

export async function getLowWinLowPnl(wallets: {
  [groupId: string]: string[];  
}) {
  console.log("开始分析低胜率低盈利钱包");

  const lowWinLowPnlWallets = new Set<string>();
  const walletsArray = Object.values(wallets).flat();
  const batchSize = 100;

  const analysisProgress = cliProgress("Low Win Low Pnl Wallets Analysis");
  analysisProgress.start(walletsArray.length, 0);

  for (let i = 0; i < walletsArray.length; i += batchSize) {
    const batch = walletsArray.slice(i, i + batchSize);
    const promises = batch.map(async (wallet) => {
      let walletStats;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const { data } = await getWallet(wallet);
          walletStats = data;
          break; // 成功获取数据后跳出循环
        } catch (error) {
          debugger;
          console.log(error);
          if (attempt === 4) throw error; // 最后一次重试失败则抛出错误
        }
      }
      if (
        walletStats &&
        walletStats.token_winrate_7d < 0.4 &&
        walletStats.pnl_7d < 0.2
      ) {
        lowWinLowPnlWallets.add(wallet);
      }
      if (walletStats && walletStats.buy_times_7d + walletStats.sell_times_7d > 1400) {
        lowWinLowPnlWallets.add(wallet);
      }
      analysisProgress.increment();
    });
    await Promise.all(promises);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 每次运行完暂停1s
  }

  analysisProgress.stop();

  return lowWinLowPnlWallets;
}
