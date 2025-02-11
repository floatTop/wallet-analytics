import request from "./request";

export const getHolding = async ({
  chain,
  wallet,
  next,
}: {
  chain: string;
  wallet: string;
  next?: string;
}) => {
  return request(
    `https://debot.ai/api/dashboard/wallet/holding_tokens?chain=${chain}&wallet=${wallet}&next=${next}&sort_field=last_active_timestamp&sort_order=desc`
  );
};

export type HoldingResponse = {
  data: {
    holding_tokens: {
      token: {
        chain: string;
        address: string;
        creator_address: string;
        symbol: string;
        name: string;
        decimals: number;
        logo: string;
        total_supply: number | null;
        launchpad: string;
        launchpad_status: string;
        creation_timestamp: number;
      };
      unrealized_profit: number;
      unrealized_pnl: number;
      total_profit: number;
      total_profit_pnl: number;
      buy_volume: number;
      sell_volume: number;
      avg_cost: number;
      avg_sold: number;
      balance: number;
      position: number;
      position_percent: number;
      last_active_timestamp: number;
      realized_profit: number;
      realized_profit_pnl: number;
      buy_times: number;
      sell_times: number;
      buy_amount: number;
      sell_amount: number;
      trade_hold_amount: number;
      profit_display_type: string;
      liquidity: number;
      fdv: number;
      mkt_cap: number;
      tags: string[];
    }[];
    next: string;
  };
};
