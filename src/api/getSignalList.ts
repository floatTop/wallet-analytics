import { ApiResponse, ResponseData } from "@/type";
import cliProgress from "../util/cliProgress";

export async function getSignalList() {
  const progress = cliProgress("Fetching Signal List");
  const fetchData = async (next: string): Promise<ApiResponse> => {
    return await fetch(
      `https://debot.ai/api/official/signal/channel/list?page_size=50&next=${next}`,
      {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9",
          // 注意：浏览器环境下无法直接设置cookie等敏感header
          origin: "https://localhost:3000",
          priority: "u=1, i",
          referer: "https://localhost:3000/",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
      }
    )
      .then((res) => res.json())
  };

  const data: ResponseData = {
    meta: {
      tokens: {},
      signals: {},
      metrics: {},
      safe_info: {},
      social_info: {},
      token_tags: {},
    },
    results: [],
    next: "",
    total: 0,
  };
  let next = "";

  progress.start(10, 0);
  do {
    const response = await fetchData(next);
    progress.setTotal(Math.ceil(response.data.total / 50));
    progress.increment();

    data.results.push(...response.data.results);
    data.meta.tokens = { ...data.meta.tokens, ...response.data.meta.tokens };
    data.meta.signals = { ...data.meta.signals, ...response.data.meta.signals };
    data.meta.metrics = { ...data.meta.metrics, ...response.data.meta.metrics };
    data.meta.safe_info = {
      ...data.meta.safe_info,
      ...response.data.meta.safe_info,
    };
    data.meta.social_info = {
      ...data.meta.social_info,
      ...response.data.meta.social_info,
    };
    data.meta.token_tags = {
      ...data.meta.token_tags,
      ...response.data.meta.token_tags,
    };
    next = response.data.next;
  } while (next);
  progress.stop();

  return data;
}
