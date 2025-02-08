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
  const duneConfig: Record<string, DuneConfig> = {
    photon: {
      queryId: 3792656,
      limit: 1000,
      sort_by: "netPnLUSD desc",
    },
    bull: {
      queryId: 4436309,
      limit: 1000,
      sort_by: "net_pnl desc",
    },
  };

  getPhotonWallet(duneConfig.photon);
  // getBullWallet(duneConfig.bull);
}

async function fetchDuneData(config: DuneConfig) {
  const queryParams = new URLSearchParams({
    limit: "1000",
    sort_by: config.sort_by,
  });

  const url = `https://api.dune.com/api/v1/query/${config.queryId}/results?${queryParams}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Dune-API-Key": apiKey,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
  const data = response.result.rows;
  return data;
}

async function getPhotonWallet(config: DuneConfig) {
  const data: PhonoDuneData[] = await fetchDuneData(config);
  const filteredData = data.filter(
    (item: PhonoDuneData) =>
      item.netPnLUSD / item.buyVolumeUSD > 0.2 &&
      new Date(item.lastTradeDate) >=
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  fs.writeFileSync(
    `output/dune-photon.json`,
    JSON.stringify(filteredData.map((item) => item.userAddress), null, 2)
  );
}

async function getBullWallet(config: DuneConfig) {
  const data = await fetchDuneData(config);
  const filteredData = data.filter(async (item: any) => {
    if (item.wallet) {
      const extractedString = item.wallet.match(/portfolio\/(.*?)\?r=/)[1];
      const gmgnData = await fetchGmgnWallet({
        walletAddress: extractedString,
      });
      debugger;
      return gmgnData.data.winrate > 0.4;
    }

    return false;
  });

  fs.writeFileSync(
    `output/dune-bull.json`,
    JSON.stringify(filteredData, null, 2)
  );
}

dune();

const fetchGmgnWallet = async ({
  walletAddress,
}: {
  walletAddress: string;
}) => {
  const data = await fetch(
    `https://gmgn.ai/defi/quotation/v1/smartmoney/sol/walletNew/${walletAddress}?tz_name=Asia%2FShanghai&tz_offset=28800&app_lang=%22zh-CN%22&period=7d`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "If-None-Match": 'W/"631-F4T9kwlJrIOhqrcumopJjMx7rRU"',
        Priority: "u=1, i",
        Referer: `https://gmgn.ai/sol/address/${walletAddress}`,
        "Sec-CH-UA":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        "Sec-CH-UA-Arch": '"arm"',
        "Sec-CH-UA-Bitness": '"64"',
        "Sec-CH-UA-Full-Version": '"133.0.6943.54"',
        "Sec-CH-UA-Full-Version-List":
          '"Not(A:Brand";v="99.0.0.0", "Google Chrome";v="133.0.6943.54", "Chromium";v="133.0.6943.54"',
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Model": '""',
        "Sec-CH-UA-Platform": '"macOS"',
        "Sec-CH-UA-Platform-Version": '"15.1.1"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      },
      credentials: "include",
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
  return data;
};
