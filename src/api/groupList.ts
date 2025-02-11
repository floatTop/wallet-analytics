import request from "./request";

export const getGroupList = async (): Promise<GroupListResponse> => {
  return request("https://debot.ai/api/wallet/group/list");
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
