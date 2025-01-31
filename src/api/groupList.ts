import getCookie from "../util/getCookie";

export const getGroupList = async (): Promise<GroupListResponse> => {
  const response = await fetch(
    "https://debot.ai/api/wallet/group/list",
    {
      headers: {
        Cookie: getCookie(),
      },
    }
  );
  return response.json();
};

export type GroupListResponse = {
  data: {
    id: number;
    group_name: string;
    user_id: number;
    type: number;
    create_time: string;
  }[];
};
