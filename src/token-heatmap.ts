import { ApiResponse, SignalInfo } from "./type";

const gold = new Set();
const silver = new Set();
const bronze = new Set();
const double = new Set();
const stupid = new Map();
const tokenList = new Set();
const signal: { [token: string]: SignalInfo } = {};
const walletList: {
  [wallet: string]: {
    tokens: string[];
    gold?: number;
    silver?: number;
    bronze?: number;
  };
} = {};

const fs = require("fs");

const updateWalletCount = (wallet: string, level: string) => {
  const count = stupid.get(wallet) || {
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    stupidCount: 0,
  };

  const newCount = { ...count };
  switch (level) {
    case "gold":
      newCount.goldCount++;
      break;
    case "silver":
      newCount.silverCount++;
      break;
    case "bronze":
      newCount.bronzeCount++;
      break;
    default:
      newCount.stupidCount++;
      break;
  }

  stupid.set(wallet, newCount);
};

async function fetchAllTokens(next = "") {
  try {
    const response = await fetch(
      `https://preapi.debot.ai/api/official/signal/channel/list?page_size=50&next=${next}`,
      {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9",
          // 注意：浏览器环境下无法直接设置cookie等敏感header
          origin: "https://localhost:3000",
          priority: "u=1, i",
          referer: "https://localhost:3000/",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res: ApiResponse = await response.json();

    const data = res.data;

    Object.keys(data.meta.signals).forEach((token) => {
      signal[token] = data.meta.signals[token];
      const tokenLevel = data.meta.signals[token].token_level;
      const max_price_gain = data.meta.signals[token].max_price_gain;
      if (tokenLevel === "gold") {
        gold.add(token);
      } else if (tokenLevel === "silver") {
        silver.add(token);
      } else if (tokenLevel === "bronze") {
        bronze.add(token);
      }
      if (max_price_gain > 1) {
        double.add(token);
      }

      const wallets = data.results
        .filter((item) => item.monitor_data.record_data.token === token)
        .map((item) => item.monitor_data.record_data.wallet_stats)
        .flatMap((item) => item);
      debugger
      if (wallets) {
        wallets.forEach((item) => {
          if (!walletList[item.alias]) {
            walletList[item.alias] = {
              tokens: [],
              gold: 0,
              silver: 0,
              bronze: 0,
            };
          }
          walletList[item.alias]?.tokens.push(token);
          if (tokenLevel === "gold") {
            walletList[item.alias].gold =
              (walletList[item.alias].gold || 0) + 1;
          } else if (tokenLevel === "silver") {
            walletList[item.alias].silver =
              (walletList[item.alias].silver || 0) + 1;
          } else if (tokenLevel === "bronze") {
            walletList[item.alias].bronze =
              (walletList[item.alias].bronze || 0) + 1;
          }
        });
      }

      data.results
        .filter((item) => item.monitor_data.record_data.token === token)
        .forEach((item) => {
          item.monitor_data.record_data.wallet_stats.forEach((wallet) => {
            if (wallet.alias) {
              const level = tokenLevel || "stupid";
              updateWalletCount(wallet.alias, level);
            }
          });
        });

      tokenList.add(token);
    });

    if (data.next) {
      await fetchAllTokens(data.next);
    }
  } catch (error) {
    console.error("获取token时出错:", error);
  }
}

function displayResults() {
  const results = {
    token_count: tokenList.size,
    gold_count: gold.size,
    silver_count: silver.size,
    bronze_count: bronze.size,
    double_count: double.size,
    double_rate: ((double.size / tokenList.size) * 100).toFixed(2) + "%",
    gold_rate: ((gold.size / tokenList.size) * 100).toFixed(2) + "%",
    silver_rate: ((silver.size / tokenList.size) * 100).toFixed(2) + "%",
    bronze_rate: ((bronze.size / tokenList.size) * 100).toFixed(2) + "%",
    total_rate:
      (
        ((gold.size + silver.size + bronze.size) / tokenList.size) *
        100
      ).toFixed(2) + "%",
  };

  console.table(results);

  // 将统计结果写入csv

  findOptimalTakeProfit(Object.values(signal));
  fs.writeFileSync(
    "stupid.json",
    JSON.stringify(Object.keys(walletList).map((key) => {
      const wallet = walletList[key];
      if (wallet.gold === 0 && wallet.silver === 0 && wallet.bronze === 0) {
        return key;
      }
    }).filter(wallet => wallet !== undefined))
  );
  fs.writeFileSync(
    "token-heatmap.json",
    JSON.stringify(walletList, null, 2)
  );
}

fetchAllTokens().then(displayResults);

function findOptimalTakeProfit(data: SignalInfo[], step = 0.01) {
  let bestTakeProfit = 0;
  let maxTotalProfit = 0;
  let bestTradeCount = 0;
  let totalSignals = data.length;

  for (let tp = step; tp <= 3; tp += step) {
    // 扩大搜索范围到200%
    let totalProfit = 0;
    let profitableTrades = 0;

    data.forEach((signal) => {
      let entryPrice = signal.first_price;
      let maxPrice = signal.max_price;
      let takeProfitPrice = entryPrice * (1 + tp);

      if (maxPrice >= takeProfitPrice) {
        totalProfit += tp; // 累加收益率
        profitableTrades++; // 累加成功数量
      }
    });

    // 计算这个止盈点的综合得分
    let successRate = profitableTrades / totalSignals;
    let score = totalProfit * successRate; // 考虑成功率和总收益的综合得分
    // score =
    if (score > maxTotalProfit) {
      maxTotalProfit = score;
      bestTakeProfit = tp;
      bestTradeCount = profitableTrades;
    }
  }

  console.log(`最佳止盈点: ${(bestTakeProfit * 100).toFixed(2)}%`);
  console.log(`在该止盈点下:`);
  console.log(`- 成功触发止盈的信号数量: ${bestTradeCount}`);
  console.log(
    `- 成功率: ${((bestTradeCount / totalSignals) * 100).toFixed(2)}%`
  );
  console.log(`- 综合得分: ${maxTotalProfit.toFixed(2)}`);
  const totalInput = 0.1 * totalSignals;
  const totalOutput = 0.1 * (bestTakeProfit + 1) * bestTradeCount;

  console.log(
    `- 每个输入0.1, 总输入${totalInput.toFixed(2)}, 输出 ${totalOutput.toFixed(
      2
    )}, 盈利${(totalOutput - totalInput).toFixed(2)}(${(
      ((totalOutput - totalInput) / totalInput) *
      100
    ).toFixed(2)}%)`
  );

  return bestTakeProfit * 100;
}

// 示例数据
