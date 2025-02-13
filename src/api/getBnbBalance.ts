import request from "./request";

export default async function getBnbBalance(wallet: string) {
  return request(
    "https://bnb-mainnet.g.alchemy.com/v2/gW2ar3jVYkL5ub53Z7Z-XwWVuALzTRXJ",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [wallet, "latest"],
        id: 1,
      }),
    }
  ).then((res) => Number((BigInt(res.result) / BigInt(10 ** 18)).toString()));
}
