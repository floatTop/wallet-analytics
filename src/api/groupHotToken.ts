import getCookie from "../util/getCookie";

export const getGroupHotToken = async (
  groupId: number,
  pageIndex: number = 1,
  pageSize: number = 50,
  sortField: string = "latest_time",
  sortOrder: string = "desc",
  duration: string = "24H"
): Promise<GroupHotTokenResponse> => {
  const response = await fetch(
    `https://debot.ai/api/wallet/group/hot_token?group_id=${groupId}&page_index=${pageIndex}&page_size=${pageSize}&sort_field=${sortField}&sort_order=${sortOrder}&duration=${duration}`,
    {
      headers: {
        Cookie: getCookie(),
      },
    }
  );
  return response.json();
};

export type GroupHotTokenResponse = {
  data: {
    chain: string;
    token: string;
    pair: string;
    wallet_count: number;
    transaction_count: number;
    sell_count: number;
    buy_count: number;
    sell_volume: number;
    buy_volume: number;
    latest_time: number;
    symbol: string;
    decimals: number;
    icon: string;
    percent24h: number;
    percent12h: number;
    percent1h: number;
    percent5m: number;
    percent1m: number;
    liquidity: number;
    fdv: number;
    mkt_cap: number;
    tags: null;
    create_time: number;
  }[];
};
