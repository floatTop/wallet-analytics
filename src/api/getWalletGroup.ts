import getCookie from "../util/getCookie";

export async function getWalletGroup(): Promise<WalletGroupType> {
  const response = await fetch("https://debot.ai/api/wallet/group/list", {
    headers: {
      Cookie: getCookie(),
    },
  });
  return response.json();
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
