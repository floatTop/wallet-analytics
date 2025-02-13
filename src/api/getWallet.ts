import request from "./request";

export async function getWallet(wallet: string, chain: string): Promise<WalletStats> {
  const url = `https://debot.ai/api/dashboard/wallet/market/stats?chain=${chain}&wallet=${wallet}&duration=7D`;

  return request(url);
}

export type WalletStats = {
  data: {
    address: string;
    balance: number;
    pnl_7d: number;
    pnl_30d: number;
    realized_profit_7d: number;
    realized_profit_30d: number;
    token_winrate_7d: number;
    token_winrate_30d: number;
    winrate_7d: number;
    winrate_30d: number;
    avg_buy_volume_7d: number;
    avg_buy_volume_30d: number;
    buy_times_7d: number;
    sell_times_7d: number;
    buy_times_30d: number;
    sell_times_30d: number;
    buy_volume_7d: number;
    sell_volume_7d: number;
    buy_volume_30d: number;
    sell_volume_30d: number;
    pnl_lt_minus_dot5_num: number;
    pnl_minus_dot5_0x_num: number;
    pnl_lt_2x_num: number;
    pnl_2x_5x_num: number;
    pnl_gt_5x_num: number;
    token_num: number;
    total_profit: number;
    total_profit_pnl: number;
    unrealized_profit: number;
    unrealized_pnl: number;
    last_active_timestamp: number;
    updated_at: number;
    tags: null;
  };
};
