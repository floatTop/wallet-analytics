import request from "./request";

export async function getWalletGroup(): Promise<WalletGroupType> {
  return request("https://debot.ai/api/wallet/group/list");
}

export type WalletGroupType = {
  data: {
    id: number;
    group_name: string;
    user_id: number;
    type: number;
    create_time: string;
  }[];
};
