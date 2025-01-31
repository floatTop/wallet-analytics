import getCookie from "../util/getCookie";

export async function getWalletByGroup(groupId: number): Promise<WalletByGroupType> {
  const response = await fetch(
    `https://debot.ai/api/wallet/group/get?id=${groupId}&sort_field=pnl_percent_24h&sort_order=desc`,
    {
      headers: {
        Cookie: getCookie(),
      },
    }
  );
  return response.json();
}
export type WalletByGroupType = {
  data: {
    group: {
      id: number;
      group_name: string;
      user_id: number;
      type: number;
      create_time: string;
    },
    items: {
      chain: string;
      wallet_address: string;
      user_id: number;
      group_id: number;
      create_time: string;
      alias: string;
      buy_times_24h: number;
      sell_times_24h: number;
      sell_volume_24h: number;
      buy_volume_24h: number;
      buy_times_7d: number;
      sell_times_7d: number;
      sell_volume_7d: number;
      buy_volume_7d: number;
      profit_amount_24h: number;
      profit_amount_7d: number;
      pnl_percent_24h: number;
      pnl_percent_7d: number;
      win_rate_24h: number;
      win_rate_7d: number;
    }[];
  };
};

