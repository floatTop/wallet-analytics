import { DuneClient } from "@duneanalytics/client-sdk";
import fs from "fs";

type PhonoDuneData = {
  blockchain: string;
  buyVolumeUSD: number;
  feesPaidUSD: number;
  firstTradeDate: string;
  lastTradeDate: string;
  netPnLUSD: number;
  numberOfActiveDays: number;
  numberOfTrades: number;
  sellVolumeUSD: number;
  totalVolumeUSD: number;
  user: string;
  userAddress: string;
  userAddress_url: string;
  userRank: number;
  user_url: string;
};

type DuneConfig = {
  queryId: number;
  limit: number;
  sort_by: string;
};

const apiKey = "EH6BsEYQOgXobDxQDLMJu76BjwubBjWZ"; // 你的 Dune API Key

async function dune() {
  const wallet = new Set();

  const data1 = await fetchDuneData({
    queryId: 4147755,
    limit: 2000,
    sort_by: "wins_2x desc",
  });
  const wallet1 = new Set();

  data1.forEach((item: any) => {
    wallet1.add(item.wallet);
    wallet.add(item.wallet);
  });

  // const data2 = await fetchDuneData({
  //   queryId: 3605798,
  //   limit: 2000,
  //   sort_by: "wins_2x desc",
  // });

  const wallet2 = new Set();

  // data2.forEach((item: any) => {
  //   const extractedString = item.userAddress.match(
  //     /<a href="https:\/\/solscan\.io\/account\/(.*?)" target=_blank>/
  //   )[1];
  //   wallet.add(extractedString);
  //   wallet2.add(extractedString);
  // });

  const data3 = await fetchDuneData({
    queryId: 3623302,
    limit: 2000,
    sort_by: "wins_2x desc",
  });

  const wallet3 = new Set();

  data3.forEach((item: any) => {
    wallet.add(item.trader);
    wallet3.add(item.trader);
  });

  fs.writeFileSync(
    `output/dune1.json`,
    JSON.stringify(Array.from(wallet1), null, 2)
  );

  // fs.writeFileSync(
  //   `output/dune2.json`,
  //   JSON.stringify(Array.from(wallet2), null, 2)
  // );

  fs.writeFileSync(
    `output/dune3.json`,
    JSON.stringify(Array.from(wallet3), null, 2)
  );

  fs.writeFileSync(
    `output/dune.json`,
    JSON.stringify(Array.from(wallet), null, 2)
  );
  // getBullWallet(duneConfig.bull);
}

async function fetchDuneData(config: DuneConfig) {
  const dune = new DuneClient(apiKey);
  const query_result = await dune.getLatestResult({
    queryId: config.queryId,
    limit: 2000,
  }).catch((err) => {
    console.log("------", config.queryId);
    console.log(err);
  });
  debugger
  return query_result?.result?.rows || [];
}

dune();
