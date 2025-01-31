import getCookie from "../util/getCookie";

export const getWalletList = async (
  token: string,
  chain: string,
  sortField: string = "last_trade_time",
  sortOrder: string = "desc"
): Promise<WalletListResponse> => {
  const response = await fetch(
    `https://debot.ai/api/wallet/group/hot_token_wallets/details?token=${token}&chain=${chain}&sort_field=${sortField}&sort_order=${sortOrder}`,
    {
      headers: {
        Cookie: getCookie(),
      },
    }
  )
  return response?.json();
};

export type WalletListResponse = {
  data: {
    chain: string;
    token: string;
    wallet: string;
    profit: {
      realized_profit: number;
      realized_profit_pnl: number;
      unrealized_profit: number;
      unrealized_profit_pnl: number;
      total_profit: number;
      total_profit_pnl: number;
      buy_times: number;
      sell_times: number;
      buy_volume: number;
      sell_volume: number;
      buy_amount: number;
      sell_amount: number;
      actual_buy_amount: number;
      actual_buy_cost: number;
      first_trade_time: number;
      last_trade_time: number;
      hold_amount: number;
    }[];
  }[];
};
